const Product = require('../models/Product');
const Category = require('../models/Category');

const getAllProducts = async (req, res) => {
    const query = { status: 'approved' };
  
    if (req.query.supplier) {
      query.supplier = req.query.supplier;
    }
  
    try {
      const products = await Product.find(query)
        .populate('supplier', 'name email')
        .populate('category', 'name slug');
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch products.' });
    }
  };
  
  

const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ supplier: req.user._id })
      .populate('category', 'name slug');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your products.' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('supplier', 'name email')
      .populate('category', 'name slug description');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Invalid product ID' });
  }
};

const createProduct = async (req, res) => {
    try {
      console.log('Received product data:', req.body);
      const status = req.user.role === 'admin' ? 'approved' : 'pending';
  
      const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        imageUrls: req.body.imageUrls || (req.body.imageUrl ? [req.body.imageUrl] : []),
        supplier: req.user._id,
        status
      });
  
      console.log('Product to save:', product);
      const saved = await product.save();
      console.log('Saved product:', saved);
      res.status(201).json(saved);
    } catch (err) {
      console.error('Error creating product:', err);
      res.status(400).json({ message: 'Failed to create product.', error: err.message });
    }
  };
  
  

/**
 * Delete a product by ID. Only the owner or an admin can delete.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Only allow delete by owner or admin (expand this with role check if needed)
    if (product.supplier.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product.' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed.' });
  }
};
/**
 * Get all pending products.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getPendingProducts = async (req, res) => {
  try {
    const pending = await Product.find({ status: 'pending' }).populate('supplier', 'name email');
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending products.' });
  }
};
  
/**
 * Approve a product by ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.status = 'approved';
    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Approval failed.' });
  }
};
  
  const rejectProduct = async (req, res) => {
    try {
      const { reason } = req.body;
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
  
      product.status = 'rejected';
      product.rejectionReason = reason || 'Not specified';
      const updated = await product.save();
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: 'Rejection failed.' });
    }
  };
  
  const updateProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
  
      if (!product) return res.status(404).json({ message: 'Product not found' });
  
      // Only owner can edit
      if (product.supplier.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this product.' });
      }
  
      // Update fields
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.category = req.body.category || product.category;
      product.price = req.body.price || product.price;
      // Support multi-image update
      if (Array.isArray(req.body.imageUrls)) {
        product.imageUrls = req.body.imageUrls;
      }
      // Reset to pending if edited
      product.status = 'pending';

      const updated = await product.save();
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: 'Update failed.' });
    }
  };
const getFeatured = async (req, res) => {
    try {
      // Fetch approved products marked as featured
      const products = await Product.find({ status: 'approved', featured: true })
        .populate('category', 'name slug')
        .limit(10);
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch featured products.' });
    }
  };
  const toggleFeatured = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
  
      product.featured = !product.featured;
      const updated = await product.save();
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: 'Failed to toggle featured status.' });
    }
  };
const getCategories = async (req, res) => {
  try {
    // Use the new Category model instead of distinct from products
    const categories = await Category.find({ isActive: true })
      .select('name slug')
      .sort({ displayOrder: 1, name: 1 });
    
    // Return just the names for backward compatibility
    const categoryNames = categories.map(cat => cat.name);
    res.json(categoryNames);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories.' });
  }
};

// Search suggestions endpoint
const getSearchSuggestions = async (req, res) => {
  try {
    const { q, limit = 8 } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }

    // Search in product names and get category names separately
    const [productSuggestions, categorySuggestions] = await Promise.all([
      // Get product names that match
      Product.aggregate([
        {
          $match: {
            status: 'approved',
            name: { $regex: q, $options: 'i' }
          }
        },
        {
          $group: {
            _id: null,
            names: { $addToSet: '$name' }
          }
        }
      ]),
      // Get category names that match
      Category.find({
        isActive: true,
        name: { $regex: q, $options: 'i' }
      }).select('name').limit(5)
    ]);

    // Combine suggestions
    const productNames = productSuggestions[0]?.names || [];
    const categoryNames = categorySuggestions.map(cat => cat.name);
    
    // Filter and combine suggestions
    const namesSuggestions = productNames.filter(name => 
      name && name.toLowerCase().includes(q.toLowerCase())
    );
    
    const categorySuggestionsFiltered = categoryNames.filter(category => 
      category && category.toLowerCase().includes(q.toLowerCase())
    );

    // Combine and limit results
    const allSuggestions = [...namesSuggestions, ...categorySuggestionsFiltered];
    const uniqueSuggestions = [...new Set(allSuggestions)];
    
    res.json(uniqueSuggestions.slice(0, parseInt(limit)));
    
  } catch (err) {
    console.error('Search suggestions error:', err);
    res.status(500).json({ message: 'Failed to fetch search suggestions.' });
  }
};

// Advanced search with filtering, sorting, and pagination
const searchProducts = async (req, res) => {
  try {
    console.log('Search request query:', req.query);
    
    const {
      q,
      category,
      categories, // New: multiple categories support
      minPrice,
      maxPrice,
      rating,
      sortBy = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    // Handle categories array from frontend
    let categoriesArray = [];
    if (categories) {
      if (Array.isArray(categories)) {
        categoriesArray = categories;
      } else if (typeof categories === 'object') {
        // Convert object to array (from query params like categories[0], categories[1])
        categoriesArray = Object.values(categories);
      } else {
        categoriesArray = [categories];
      }
    }
    
    console.log('Processed categories array:', categoriesArray);

    // Build search query
    const searchQuery = { status: 'approved' };

    // Text search - search in product fields AND category names
    if (q && q.trim()) {
      // First find categories that match the search term
      const matchingCategories = await Category.find({
        name: { $regex: q, $options: 'i' },
        isActive: true
      }).select('_id');

      const categoryIds = matchingCategories.map(cat => cat._id);

      searchQuery.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $in: categoryIds } } // Also search by category
      ];
    }

    // Multiple categories filter (enhanced with subcategory support)
    if (categoriesArray && categoriesArray.length > 0) {
      // Convert category ID strings to ObjectIds and filter
      const validCategoryIds = categoriesArray.filter(id => id && id.match(/^[0-9a-fA-F]{24}$/));
      if (validCategoryIds.length > 0) {
        // Find all subcategories for the selected categories
        const allCategoriesToInclude = [...validCategoryIds];
        
        // For each selected category, find its subcategories
        for (const categoryId of validCategoryIds) {
          const subcategories = await Category.find({ 
            parentCategory: categoryId,
            isActive: true 
          }).select('_id');
          
          const subcategoryIds = subcategories.map(cat => cat._id.toString());
          allCategoriesToInclude.push(...subcategoryIds);
        }
        
        // Remove duplicates and set the filter
        const uniqueCategoryIds = [...new Set(allCategoriesToInclude)];
        searchQuery.category = { $in: uniqueCategoryIds };
        
        console.log('Filtering by categories (including subcategories):', uniqueCategoryIds);
      }
    }
    // Legacy single category filter (enhanced with subcategory support)
    else if (category && category !== 'All') {
      // First try to find the category by name to get its ObjectId
      const categoryDoc = await Category.findOne({ 
        name: { $regex: new RegExp(`^${category}$`, 'i') } 
      });
      
      if (categoryDoc) {
        // Include the main category and its subcategories
        const subcategories = await Category.find({ 
          parentCategory: categoryDoc._id,
          isActive: true 
        }).select('_id');
        
        const categoryIds = [categoryDoc._id, ...subcategories.map(cat => cat._id)];
        searchQuery.category = { $in: categoryIds };
        
        console.log('Filtering by category (including subcategories):', categoryIds);
      } else {
        // If category not found, return empty results
        return res.json({
          products: [],
          total: 0,
          page: parseInt(page),
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false
        });
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = parseFloat(minPrice);
      if (maxPrice) searchQuery.price.$lte = parseFloat(maxPrice);
    }

    // Note: Rating filter would require a rating field in the Product schema
    // For now, we'll ignore it or you can add rating field to the schema

    // Build sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'name-asc':
        sortOptions = { name: 1 };
        break;
      case 'name-desc':
        sortOptions = { name: -1 };
        break;
      case 'price-asc':
        sortOptions = { price: 1 };
        break;
      case 'price-desc':
        sortOptions = { price: -1 };
        break;
      case 'rating':
        // If you have rating field: sortOptions = { rating: -1 };
        sortOptions = { createdAt: -1 }; // Fallback to newest
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute search with pagination
    const [products, total] = await Promise.all([
      Product.find(searchQuery)
        .populate('supplier', 'name email')
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(searchQuery)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      products,
      total,
      page: pageNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    });

  } catch (err) {
    console.error('Search products error:', err);
    res.status(500).json({ message: 'Failed to search products.' });
  }
};

module.exports = {
  getAllProducts,
  getMyProducts,
  getFeatured,
  getProductById,
  createProduct,
  deleteProduct,
  approveProduct,
  rejectProduct ,
  getPendingProducts,
  updateProduct,
  toggleFeatured,
  getCategories,
  getSearchSuggestions,
  searchProducts
};
