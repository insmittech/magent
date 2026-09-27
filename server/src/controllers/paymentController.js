import crypto from 'crypto';
import razorpayInstance from '../config/razorpay.js';
import { prisma } from '../config/db.js';

export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, currency } = req.body;
    if (!amount) return res.status(400).json({ message: 'Amount is required.' });

    if (process.env.RAZORPAY_KEY_ID === 'rzp_test_mock_id' || !process.env.RAZORPAY_KEY_ID) {
      return res.json({
        id: `order_mock_${Date.now()}`,
        amount: amount * 100,
        currency: currency || 'INR',
        receipt: `receipt_${Date.now()}`
      });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const rpOrder = await razorpayInstance.orders.create(options);
    return res.json(rpOrder);
  } catch (error) {
    next(error);
  }
};

export const verifyPaymentSignature = async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'Missing required validation signatures.' });
    }

    if (process.env.RAZORPAY_KEY_ID === 'rzp_test_mock_id' || !process.env.RAZORPAY_KEY_ID) {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'Paid',
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature
        }
      });
      return res.json({ status: 'success', order: updatedOrder });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');

    if (generatedSignature === razorpaySignature) {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'Paid',
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature
        }
      });
      return res.json({ status: 'success', order: updatedOrder });
    } else {
      return res.status(400).json({ message: 'Invalid payment signature. Verification failed.' });
    }
  } catch (error) {
    next(error);
  }
};
