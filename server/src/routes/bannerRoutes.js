import express from 'express';
import { getBanners, createBanner, updateBanner, deleteBanner } from '../controllers/bannerController.js';
import { authMiddleware } from '../middleware/auth.js';
import { adminMiddleware } from '../middleware/admin.js';

const router = express.Router();

router.get('/', getBanners);

router.post('/', authMiddleware, adminMiddleware, createBanner);
router.put('/:id', authMiddleware, adminMiddleware, updateBanner);
router.delete('/:id', authMiddleware, adminMiddleware, deleteBanner);

export default router;
