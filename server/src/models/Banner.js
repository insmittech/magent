import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  subtitle: { type: String, required: true },
  image: { type: String, required: true },
  ctaText: { type: String },
  ctaUrl: { type: String },
  active: { type: Boolean, default: true },
  startDate: { type: String },
  endDate: { type: String }
}, { timestamps: true });

export const Banner = mongoose.model('Banner', bannerSchema);
