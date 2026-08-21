import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { authMiddleware } from '../middleware/auth.js';
import { adminMiddleware } from '../middleware/admin.js';
import { uploadMiddleware } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', authMiddleware, adminMiddleware, uploadMiddleware.single('image'), createProduct);
router.put('/:id', authMiddleware, adminMiddleware, uploadMiddleware.single('image'), updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;
