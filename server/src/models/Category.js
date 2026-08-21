import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true },
  image: { type: String },
  productCount: { type: Number, default: 0 },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

export const Category = mongoose.model('Category', categorySchema);
