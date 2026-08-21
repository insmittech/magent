import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';

// Place Order (with server-side price security validation and stock checking)
export const placeOrder = async (req, res, next) => {
  try {
    const { customer, items, paymentMethod } = req.body;

    if (!customer || !items || !items.length) {
      return res.status(400).json({ message: 'Customer details and order items are required.' });
    }

    const customerDetails = {
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
      notes: customer.notes || ''
    };

    const validatedItems = [];
    let computedTotal = 0;

    // Loop and secure prices and check stock
    for (const item of items) {
      const dbProduct = await Product.findById(item.productId);
      if (!dbProduct || !dbProduct.active) {
        return res.status(400).json({ message: `Product ${item.name || 'ID ' + item.productId} is unavailable.` });
      }

      // Check variant stock
      const matchedVariant = dbProduct.variants.find((v) => {
        const itemKeys = Object.keys(item.variant || {}).filter(k => k !== 'id' && k !== 'stock');
        return itemKeys.every(key => v[key] === item.variant[key]);
      });

      if (!matchedVariant) {
        return res.status(400).json({ message: `Selected variant of ${dbProduct.name} is not available.` });
      }

      if (matchedVariant.stock < item.quantity) {
        return res.status(400).json({ message: `Only ${matchedVariant.stock} items of ${dbProduct.name} variant are in stock.` });
      }

      const securePrice = dbProduct.discountPrice !== null ? dbProduct.discountPrice : dbProduct.price;

      validatedItems.push({
        productId: dbProduct._id.toString(),
        name: dbProduct.name,
        price: securePrice,
        quantity: item.quantity,
        variant: item.variant
      });

      computedTotal += securePrice * item.quantity;
    }

    // Deduct stock atomically
    for (const item of items) {
      const dbProduct = await Product.findById(item.productId);
      const updatedVariants = dbProduct.variants.map((v) => {
        const itemKeys = Object.keys(item.variant || {}).filter(k => k !== 'id' && k !== 'stock');
        const isMatch = itemKeys.every(key => v[key] === item.variant[key]);
        if (isMatch) {
          return { ...v, stock: Math.max(0, v.stock - item.quantity) };
        }
        return v;
      });

      await Product.findByIdAndUpdate(item.productId, { variants: updatedVariants });
    }

    const orderCustomId = `MGT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = await Order.create({
      id: orderCustomId,
      user: req.user ? req.user._id : null,
      customer: customerDetails,
      items: validatedItems,
      total: computedTotal,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'Razorpay' ? 'Pending' : 'Pending',
      status: 'Pending'
    });

    return res.status(201).json({
      orderId: newOrder.id,
      order: newOrder
    });
  } catch (error) {
    next(error);
  }
};

// Customer Orders Fetch
export const getMyOrders = async (req, res, next) => {
  try {
    const query = req.user 
      ? { $or: [{ user: req.user._id }, { 'customer.phone': req.user.phone }] }
      : { 'customer.phone': req.query.phone || '' };

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Admin Orders Fetch
export const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Admin Order Status Update
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const updates = {};
    if (status) updates.status = status;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const order = await Order.findOneAndUpdate({ id }, updates, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    return res.json(order);
  } catch (error) {
    next(error);
  }
};
