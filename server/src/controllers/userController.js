import { prisma } from '../config/db.js';

export const getProfile = async (req, res, next) => {
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

export const saveAddress = async (req, res, next) => {
  try {
    const addressData = req.body;
    const userId = req.user.id;

    if (addressData.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    if (addressData.id) {
      await prisma.address.update({
        where: { id: Number(addressData.id) },
        data: {
          name: addressData.name,
          type: addressData.type || 'Home',
          address: addressData.address,
          city: addressData.city,
          state: addressData.state,
          pincode: addressData.pincode,
          phone: addressData.phone,
          isDefault: addressData.isDefault || false
        }
      });
    } else {
      await prisma.address.create({
        data: {
          userId,
          name: addressData.name,
          type: addressData.type || 'Home',
          address: addressData.address,
          city: addressData.city,
          state: addressData.state,
          pincode: addressData.pincode,
          phone: addressData.phone,
          isDefault: addressData.isDefault || false
        }
      });
    }

    const addresses = await prisma.address.findMany({
      where: { userId }
    });

    return res.json(addresses);
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const addressId = parseInt(req.params.id);
    const userId = req.user.id;

    await prisma.address.deleteMany({
      where: { id: addressId, userId }
    });

    const addresses = await prisma.address.findMany({
      where: { userId }
    });

    return res.json(addresses);
  } catch (error) {
    next(error);
  }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId);
    const userId = req.user.id;

    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

    if (existingItem) {
      await prisma.wishlistItem.delete({
        where: { id: existingItem.id }
      });
    } else {
      await prisma.wishlistItem.create({
        data: { userId, productId }
      });
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: true }
    });

    return res.json(wishlistItems.map(w => w.product));
  } catch (error) {
    next(error);
  }
};
