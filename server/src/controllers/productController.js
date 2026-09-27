import { prisma } from '../config/db.js';
import cloudinary from '../config/cloudinary.js';

// Helper to stream upload file to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    if (process.env.CLOUDINARY_CLOUD_NAME === 'mock_cloudinary' || !process.env.CLOUDINARY_CLOUD_NAME) {
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
    const where = {};

    if (activeOnly !== 'false') {
      where.active = true;
    }
    if (category && category !== 'all') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { sku: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    return res.json(products);
  } catch (error) {
    next(error);
  }
};

// Get product details
export const getProductById = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await prisma.product.findUnique({
      where: { id: isNaN(productId) ? undefined : productId }
    });
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

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : (variants || []);
    const parsedSpecs = typeof specifications === 'string' ? JSON.parse(specifications) : (specifications || []);

    const product = await prisma.product.create({
      data: {
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
        featured: featured === 'true' || featured === true,
        trending: trending === 'true' || trending === true,
        bestseller: bestseller === 'true' || bestseller === true,
        newArrival: newArrival === 'true' || newArrival === true,
        dealOfTheDay: dealOfTheDay === 'true' || dealOfTheDay === true,
        dealStockRemaining: dealStockRemaining ? parseInt(dealStockRemaining) : 0,
        variants: parsedVariants,
        specifications: parsedSpecs,
        seoTitle: seoTitle || name,
        seoDescription: seoDescription || description || ''
      }
    });

    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// Update product (Admin)
export const updateProduct = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    let updates = { ...req.body };

    const product = await prisma.product.findUnique({ where: { id: productId } });
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

    if (typeof updates.variants === 'string') updates.variants = JSON.parse(updates.variants);
    if (typeof updates.specifications === 'string') updates.specifications = JSON.parse(updates.specifications);

    if (updates.active !== undefined) updates.active = updates.active === 'true' || updates.active === true;
    if (updates.featured !== undefined) updates.featured = updates.featured === 'true' || updates.featured === true;
    if (updates.trending !== undefined) updates.trending = updates.trending === 'true' || updates.trending === true;
    if (updates.bestseller !== undefined) updates.bestseller = updates.bestseller === 'true' || updates.bestseller === true;
    if (updates.newArrival !== undefined) updates.newArrival = updates.newArrival === 'true' || updates.newArrival === true;
    if (updates.dealOfTheDay !== undefined) updates.dealOfTheDay = updates.dealOfTheDay === 'true' || updates.dealOfTheDay === true;

    if (updates.name && updates.name !== product.name) {
      updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updates
    });

    return res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// Delete product (Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await prisma.product.delete({
      where: { id: productId }
    });
    return res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Product not found.' });
    }
    next(error);
  }
};

export { uploadToCloudinary };
