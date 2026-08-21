import { Banner } from '../models/Banner.js';

export const getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
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

    const banner = await Banner.create({
      heading,
      subtitle,
      image,
      ctaText,
      ctaUrl,
      active: active !== false,
      startDate,
      endDate
    });

    return res.status(201).json(banner);
  } catch (error) {
    next(error);
  }
};

export const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndUpdate(id, req.body, { new: true });
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found.' });
    }
    return res.json(banner);
  } catch (error) {
    next(error);
  }
};

export const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found.' });
    }
    return res.json({ message: 'Banner deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
