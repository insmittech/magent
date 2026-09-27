import { prisma } from '../config/db.js';

export const getSettings = async (req, res, next) => {
  try {
    let settings = await prisma.setting.findFirst();
    if (!settings) {
      settings = await prisma.setting.create({ data: {} });
    }
    return res.json(settings);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    let settings = await prisma.setting.findFirst();
    if (!settings) {
      settings = await prisma.setting.create({ data: req.body });
    } else {
      settings = await prisma.setting.update({
        where: { id: settings.id },
        data: req.body
      });
    }
    return res.json(settings);
  } catch (error) {
    next(error);
  }
};
