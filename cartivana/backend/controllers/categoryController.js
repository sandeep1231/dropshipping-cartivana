const Category = require('../models/Category');
const Product = require('../models/Product');

/**
 * Get categories (all for admin, active only for public)
 */
const getCategories = async (req, res) => {
  try {
    // Check if includeInactive query parameter is present (for admin)
    const includeInactive = req.query.includeInactive === 'true';
    const filter = includeInactive ? {} : { isActive: true };
    
    const categories = await Category.find(filter)
      .sort({ displayOrder: 1, name: 1 })
      .select('name slug description image parentCategory isActive displayOrder');
    
    // Ensure isActive has a default value if missing
    const categoriesWithDefaults = categories.map(cat => ({
      ...cat.toObject(),
      isActive: cat.isActive !== undefined ? cat.isActive : true
    }));
    
    console.log('getCategories - returning:', categoriesWithDefaults.map(cat => ({
      name: cat.name,
      isActive: cat.isActive,
      isActiveType: typeof cat.isActive
    })));
    
    res.json(categoriesWithDefaults);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

/**
 * Get category tree (hierarchical structure)
 */
const getCategoryTree = async (req, res) => {
  try {
    const tree = await Category.getCategoryTree();
    res.json(tree);
  } catch (error) {
    console.error('Error fetching category tree:', error);
    res.status(500).json({ message: 'Failed to fetch category tree' });
  }
};

/**
 * Get category by ID or slug
 */
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by ID first, then by slug
    let category = await Category.findById(id);
    if (!category) {
      category = await Category.findOne({ slug: id, isActive: true });
    }
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Get product count for this category
    const productCount = await Product.countDocuments({ 
      category: category._id, 
      status: 'approved' 
    });
    
    const categoryWithCount = {
      ...category.toObject(),
      productCount
    };
    
    res.json(categoryWithCount);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Failed to fetch category' });
  }
};

/**
 * Create new category (Admin only)
 */
const createCategory = async (req, res) => {
  try {
    const { name, description, image, parentCategory } = req.body;
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    const category = new Category({
      name,
      description,
      image,
      parentCategory: parentCategory || null
    });
    
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(400).json({ message: 'Failed to create category', error: error.message });
  }
};

/**
 * Update category (Admin only)
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const category = await Category.findByIdAndUpdate(
      id, 
      { ...updateData, updatedAt: Date.now() }, 
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(400).json({ message: 'Failed to update category', error: error.message });
  }
};

/**
 * Delete/Deactivate category (Admin only)
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category has products
    const productCount = await Product.countDocuments({ category: id });
    
    if (productCount > 0) {
      // Deactivate instead of delete if it has products
      const category = await Category.findByIdAndUpdate(
        id, 
        { isActive: false, updatedAt: Date.now() }, 
        { new: true }
      );
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      return res.json({ 
        message: 'Category deactivated (has associated products)', 
        category 
      });
    }
    
    // Permanently delete if no products
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Failed to delete category' });
  }
};

/**
 * Get categories with product counts
 */
const getCategoriesWithCounts = async (req, res) => {
  try {
    // Check if includeInactive query parameter is present (for admin)
    const includeInactive = req.query.includeInactive === 'true';
    const matchFilter = includeInactive ? {} : { isActive: true };
    
    console.log('=== getCategoriesWithCounts Debug ===');
    console.log('includeInactive:', includeInactive);
    console.log('matchFilter:', matchFilter);
    
    const categories = await Category.aggregate([
      { $match: matchFilter },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products'
        }
      },
      {
        $addFields: {
          productCount: {
            $size: {
              $filter: {
                input: '$products',
                as: 'product',
                cond: { $eq: ['$$product.status', 'approved'] }
              }
            }
          },
          // Ensure isActive has a default value
          isActive: {
            $ifNull: ['$isActive', true]
          }
        }
      },
      {
        $project: {
          name: 1,
          slug: 1,
          description: 1,
          image: 1,
          parentCategory: 1,
          isActive: 1,
          displayOrder: 1,
          productCount: 1
        }
      },
      { $sort: { displayOrder: 1, name: 1 } }
    ]);
    
    console.log('Categories from DB:', categories.map(cat => ({
      name: cat.name,
      isActive: cat.isActive,
      isActiveType: typeof cat.isActive
    })));
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories with counts:', error);
    res.status(500).json({ message: 'Failed to fetch categories with counts' });
  }
};

module.exports = {
  getCategories,
  getCategoryTree,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesWithCounts
};
