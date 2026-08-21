import { User } from '../models/User.js';
import { Product } from '../models/Product.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist').select('-password');
    return res.json(user);
  } catch (error) {
    next(error);
  }
};

export const saveAddress = async (req, res, next) => {
  try {
    const address = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isEdit = !!address.id;
    let updatedAddresses = [];

    if (isEdit) {
      updatedAddresses = user.addresses.map((a) => (a._id.toString() === address.id ? { ...address, _id: address.id } : a));
    } else {
      updatedAddresses = [...user.addresses, address];
    }

    // Default overrides
    if (address.isDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({
        ...a,
        isDefault: a.id === address.id || (!address.id && updatedAddresses.indexOf(a) === updatedAddresses.length - 1)
      }));
    }

    user.addresses = updatedAddresses;
    await user.save();

    return res.json(user.addresses);
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.addresses = user.addresses.filter((a) => a._id.toString() !== id);
    await user.save();

    return res.json(user.addresses);
  } catch (error) {
    next(error);
  }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const productIndex = user.wishlist.indexOf(productId);
    if (productIndex > -1) {
      user.wishlist.splice(productIndex, 1); // remove
    } else {
      user.wishlist.push(productId); // add
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    return res.json(updatedUser.wishlist);
  } catch (error) {
    next(error);
  }
};
