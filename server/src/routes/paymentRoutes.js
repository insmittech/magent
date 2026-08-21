import express from 'express';
import { createRazorpayOrder, verifyPaymentSignature } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/razorpay/order', createRazorpayOrder);
router.post('/razorpay/verify', verifyPaymentSignature);

export default router;
