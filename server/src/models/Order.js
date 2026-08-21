import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  variant: { type: Map, of: String } // Stores size, color, compatibleModel, specification
});

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // custom generated (e.g. MGT-1024)
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    notes: { type: String }
  },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['COD', 'Razorpay'], default: 'COD' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
  paymentDetails: {
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String }
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Refunded'],
    default: 'Pending'
  }
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
