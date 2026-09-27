import { prisma } from '../config/db.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    return res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, active, image, sortOrder } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        active: active !== false,
        image: image || '/images/clothing.jpg',
        sortOrder: sortOrder ? parseInt(sortOrder) : 0
      }
    });

    return res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id);
    const updates = { ...req.body };

    if (updates.name) {
      updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (updates.sortOrder !== undefined) {
      updates.sortOrder = parseInt(updates.sortOrder);
    }
    if (updates.active !== undefined) {
      updates.active = updates.active === 'true' || updates.active === true;
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: updates
    });

    return res.json(category);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Category not found.' });
    }
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id);
    await prisma.category.delete({
      where: { id: categoryId }
    });
    return res.json({ message: 'Category deleted successfully.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Category not found.' });
    }
    next(error);
  }
};
