import express from 'express';
import { placeOrder, getMyOrders, getAdminOrders, updateOrderStatus } from '../controllers/orderController.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.js';
import { adminMiddleware } from '../middleware/admin.js';

const router = express.Router();

router.post('/', optionalAuthMiddleware, placeOrder);
router.get('/my', optionalAuthMiddleware, getMyOrders);

router.get('/admin', authMiddleware, adminMiddleware, getAdminOrders);
router.put('/admin/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
