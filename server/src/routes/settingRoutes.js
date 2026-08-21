import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingController.js';
import { authMiddleware } from '../middleware/auth.js';
import { adminMiddleware } from '../middleware/admin.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', authMiddleware, adminMiddleware, updateSettings);

export default router;
