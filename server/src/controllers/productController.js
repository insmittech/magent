import { Product } from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

// Helper to stream upload file to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    if (process.env.CLOUDINARY_CLOUD_NAME === 'mock_cloudinary' || !process.env.CLOUDINARY_CLOUD_NAME) {
      // Local dev mock fallback
      console.log('Using mock Cloudinary fallback URL');
      return resolve('/images/clothing.jpg');
    }
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'magnet_products' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// Get all products (with optional filter/search)
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, activeOnly } = req.query;
    const query = {};

    if (activeOnly !== 'false') {
      query.active = true;
    }
    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return res.json(products);
  } catch (error) {
    next(error);
  }
};

// Get product details
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.json(product);
  } catch (error) {
    next(error);
  }
};

// Create product (Admin)
export const createProduct = async (req, res, next) => {
  try {
    const { name, brand, category, description, price, discountPrice, sku, active, featured, trending, bestseller, newArrival, dealOfTheDay, dealStockRemaining, variants, specifications, seoTitle, seoDescription } = req.body;

    if (!name || !price || !category || !sku) {
      return res.status(400).json({ message: 'Name, Price, Category and SKU are required.' });
    }

    let imageUrl = '/images/clothing.jpg';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    // Slug generation
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Parse nested objects if sent as stringified JSON (from multipart/form-data)
    const parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : (variants || []);
    const parsedSpecs = typeof specifications === 'string' ? JSON.parse(specifications) : (specifications || []);

    const product = await Product.create({
      name,
      brand: brand || 'Magnet',
      slug,
      sku,
      category,
      description: description || '',
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      image: imageUrl,
      active: active === 'false' ? false : true,
      featured: featured === 'true',
      trending: trending === 'true',
      bestseller: bestseller === 'true',
      newArrival: newArrival === 'true',
      dealOfTheDay: dealOfTheDay === 'true',
      dealStockRemaining: dealStockRemaining ? parseInt(dealStockRemaining) : 0,
      variants: parsedVariants,
      specifications: parsedSpecs,
      seoTitle: seoTitle || name,
      seoDescription: seoDescription || description || ''
    });

    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// Update product (Admin)
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updates = { ...req.body };

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (req.file) {
      updates.image = await uploadToCloudinary(req.file.buffer);
    }

    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.discountPrice !== undefined) {
      updates.discountPrice = updates.discountPrice ? parseFloat(updates.discountPrice) : null;
    }
    if (updates.dealStockRemaining) updates.dealStockRemaining = parseInt(updates.dealStockRemaining);

    // Parsing nested forms
    if (typeof updates.variants === 'string') updates.variants = JSON.parse(updates.variants);
    if (typeof updates.specifications === 'string') updates.specifications = JSON.parse(updates.specifications);

    if (updates.name && updates.name !== product.name) {
      updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
    return res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// Delete product (Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
export { uploadToCloudinary };
