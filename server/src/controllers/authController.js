import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Helper to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Customer / Admin Register
export const register = async (req, res, next) => {
  try {
    const { name, phone, email, password, role } = req.body;
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check existing
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: 'Phone number already registered.' });
    }

    // Determine role (force admin if email is admin@magnet.com)
    let assignedRole = 'customer';
    if (email === 'admin@magnet.com' || role === 'admin') {
      assignedRole = 'admin';
    }

    const user = await User.create({
      name,
      phone,
      email,
      password,
      role: assignedRole,
      addresses: []
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        wishlist: user.wishlist
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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user._id);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile details
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return res.json(user);
  } catch (error) {
    next(error);
  }
};
