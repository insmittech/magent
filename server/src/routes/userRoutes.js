import express from 'express';
import { getProfile, saveAddress, deleteAddress, toggleWishlist } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.post('/addresses', authMiddleware, saveAddress);
router.delete('/addresses/:id', authMiddleware, deleteAddress);
router.post('/wishlist/:productId', authMiddleware, toggleWishlist);

export default router;
