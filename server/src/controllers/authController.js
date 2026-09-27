import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/db.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'magnet_secret_key', { expiresIn: '7d' });
};

// Customer / Admin Register
export const register = async (req, res, next) => {
  try {
    const { name, phone, email, password, role } = req.body;
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check existing
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const existingPhone = await prisma.user.findUnique({ where: { phone } });
    if (existingPhone) {
      return res.status(400).json({ message: 'Phone number already registered.' });
    }

    let assignedRole = 'customer';
    if (email === 'admin@magnet.com' || role === 'admin') {
      assignedRole = 'admin';
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        role: assignedRole
      },
      include: {
        addresses: true,
        wishlist: { include: { product: true } }
      }
    });

    const token = generateToken(user.id);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses || [],
        wishlist: user.wishlist ? user.wishlist.map(w => w.product) : []
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        addresses: true,
        wishlist: { include: { product: true } }
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user.id);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses || [],
        wishlist: user.wishlist ? user.wishlist.map(w => w.product) : []
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile details
export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        addresses: true,
        wishlist: { include: { product: true } }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { password, ...userWithoutPassword } = user;
    return res.json({
      ...userWithoutPassword,
      wishlist: user.wishlist ? user.wishlist.map(w => w.product) : []
    });
  } catch (error) {
    next(error);
  }
};
