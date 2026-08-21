import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  size: { type: String }, // For Clothing
  color: { type: String }, // Common
  compatibleModel: { type: String }, // For Accessories
  specification: { type: String }, // Connector/Power/etc.
  stock: { type: Number, required: true, default: 0 }
});

const specificationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, default: 'Magnet' },
  slug: { type: String, required: true, unique: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: null },
  image: { type: String, required: true }, // Main Image URL
  images: [{ type: String }], // Optional Gallery
  active: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  bestseller: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  dealOfTheDay: { type: Boolean, default: false },
  dealStockRemaining: { type: Number, default: 0 },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 },
  variants: [variantSchema],
  specifications: [specificationSchema],
  seoTitle: { type: String },
  seoDescription: { type: String }
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
