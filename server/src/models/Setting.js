import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  storeName: { type: String, default: 'Magnet Vapi Official' },
  whatsappNumber: { type: String, default: '+919999988888' },
  address: { type: String, default: 'Shop 12, High Street Galleria, Vapi, Gujarat, 396191' },
  email: { type: String, default: 'contact@magnetstore.com' },
  announcement: { type: String, default: '🔥 Deals of the Day: Flat 20% off on premium Graphic Tees! Free Delivery on orders above ₹1499' },
  brandColor: { type: String, default: '#ef4444' },
  brandFont: { type: String, default: 'Plus Jakarta Sans' }
}, { timestamps: true });

export const Setting = mongoose.model('Setting', settingSchema);
