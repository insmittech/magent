import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'magnet_secret_key');

    const user = await prisma.user.findUnique({
      where: { id: Number(decoded.id) },
      include: { addresses: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists or session expired.' });
    }

    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'magnet_secret_key');

      const user = await prisma.user.findUnique({
        where: { id: Number(decoded.id) },
        include: { addresses: true }
      });

      if (user) {
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
      }
    }
    next();
  } catch (error) {
    next();
  }
};
