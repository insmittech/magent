import { prisma } from '../config/db.js';

// Place Order (with server-side price security validation and stock checking)
export const placeOrder = async (req, res, next) => {
  try {
    const { customer, items, paymentMethod } = req.body;

    if (!customer || !items || !items.length) {
      return res.status(400).json({ message: 'Customer details and order items are required.' });
    }

    const validatedItems = [];
    let computedTotal = 0;

    for (const item of items) {
      const prodId = parseInt(item.productId);
      const dbProduct = await prisma.product.findUnique({ where: { id: isNaN(prodId) ? undefined : prodId } });
      if (!dbProduct || !dbProduct.active) {
        return res.status(400).json({ message: `Product ${item.name || 'ID ' + item.productId} is unavailable.` });
      }

      const variantsList = Array.isArray(dbProduct.variants) ? dbProduct.variants : [];
      const matchedVariant = variantsList.find((v) => {
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
        productId: dbProduct.id,
        name: dbProduct.name,
        price: securePrice,
        quantity: item.quantity,
        variant: item.variant
      });

      computedTotal += securePrice * item.quantity;
    }

    // Deduct stock
    for (const item of items) {
      const prodId = parseInt(item.productId);
      const dbProduct = await prisma.product.findUnique({ where: { id: prodId } });
      const variantsList = Array.isArray(dbProduct.variants) ? dbProduct.variants : [];

      const updatedVariants = variantsList.map((v) => {
        const itemKeys = Object.keys(item.variant || {}).filter(k => k !== 'id' && k !== 'stock');
        const isMatch = itemKeys.every(key => v[key] === item.variant[key]);
        if (isMatch) {
          return { ...v, stock: Math.max(0, v.stock - item.quantity) };
        }
        return v;
      });

      await prisma.product.update({
        where: { id: prodId },
        data: { variants: updatedVariants }
      });
    }

    const orderCustomId = `MGT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = await prisma.order.create({
      data: {
        id: orderCustomId,
        userId: req.user ? req.user.id : null,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        customerAddress: customer.address,
        customerCity: customer.city,
        customerState: customer.state,
        customerPincode: customer.pincode,
        customerNotes: customer.notes || '',
        items: validatedItems,
        total: computedTotal,
        paymentMethod: paymentMethod || 'COD',
        paymentStatus: paymentMethod === 'Razorpay' ? 'Pending' : 'Pending',
        status: 'Pending'
      }
    });

    const responseOrder = {
      ...newOrder,
      customer: {
        name: newOrder.customerName,
        phone: newOrder.customerPhone,
        email: newOrder.customerEmail,
        address: newOrder.customerAddress,
        city: newOrder.customerCity,
        state: newOrder.customerState,
        pincode: newOrder.customerPincode,
        notes: newOrder.customerNotes
      }
    };

    return res.status(201).json({
      orderId: newOrder.id,
      order: responseOrder
    });
  } catch (error) {
    next(error);
  }
};

// Customer Orders Fetch
export const getMyOrders = async (req, res, next) => {
  try {
    const phoneParam = req.query.phone || '';
    const userPhone = req.user ? req.user.phone : phoneParam;

    const where = req.user
      ? { OR: [{ userId: req.user.id }, { customerPhone: userPhone }] }
      : { customerPhone: phoneParam };

    const rawOrders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const formattedOrders = rawOrders.map(o => ({
      ...o,
      customer: {
        name: o.customerName,
        phone: o.customerPhone,
        email: o.customerEmail,
        address: o.customerAddress,
        city: o.customerCity,
        state: o.customerState,
        pincode: o.customerPincode,
        notes: o.customerNotes
      }
    }));

    return res.json(formattedOrders);
  } catch (error) {
    next(error);
  }
};

// Admin Orders Fetch
export const getAdminOrders = async (req, res, next) => {
  try {
    const rawOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const formattedOrders = rawOrders.map(o => ({
      ...o,
      customer: {
        name: o.customerName,
        phone: o.customerPhone,
        email: o.customerEmail,
        address: o.customerAddress,
        city: o.customerCity,
        state: o.customerState,
        pincode: o.customerPincode,
        notes: o.customerNotes
      }
    }));

    return res.json(formattedOrders);
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

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updates
    });

    const formattedOrder = {
      ...updatedOrder,
      customer: {
        name: updatedOrder.customerName,
        phone: updatedOrder.customerPhone,
        email: updatedOrder.customerEmail,
        address: updatedOrder.customerAddress,
        city: updatedOrder.customerCity,
        state: updatedOrder.customerState,
        pincode: updatedOrder.customerPincode,
        notes: updatedOrder.customerNotes
      }
    };

    return res.json(formattedOrder);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Order not found.' });
    }
    next(error);
  }
};
