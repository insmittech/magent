import { prisma } from '../config/db.js';

export const getBanners = async (req, res, next) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.json(banners);
  } catch (error) {
    next(error);
  }
};

export const createBanner = async (req, res, next) => {
  try {
    const { heading, subtitle, image, ctaText, ctaUrl, active, startDate, endDate } = req.body;
    if (!heading || !subtitle || !image) {
      return res.status(400).json({ message: 'Heading, Subtitle and Image URL are required.' });
    }

    const banner = await prisma.banner.create({
      data: {
        heading,
        subtitle,
        image,
        ctaText,
        ctaUrl,
        active: active !== false,
        startDate,
        endDate
      }
    });

    return res.status(201).json(banner);
  } catch (error) {
    next(error);
  }
};

export const updateBanner = async (req, res, next) => {
  try {
    const bannerId = parseInt(req.params.id);
    const updates = { ...req.body };
    if (updates.active !== undefined) {
      updates.active = updates.active === 'true' || updates.active === true;
    }

    const banner = await prisma.banner.update({
      where: { id: bannerId },
      data: updates
    });

    return res.json(banner);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Banner not found.' });
    }
    next(error);
  }
};

export const deleteBanner = async (req, res, next) => {
  try {
    const bannerId = parseInt(req.params.id);
    await prisma.banner.delete({
      where: { id: bannerId }
    });
    return res.json({ message: 'Banner deleted successfully.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Banner not found.' });
    }
    next(error);
  }
};
