const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryTree,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesWithCounts
} = require('../controllers/categoryController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getCategories);
router.get('/tree', getCategoryTree);
router.get('/with-counts', getCategoriesWithCounts);
router.get('/:id', getCategoryById);

// Admin-only routes
router.post('/', protect, isAdmin, createCategory);
router.put('/:id', protect, isAdmin, updateCategory);
router.delete('/:id', protect, isAdmin, deleteCategory);

module.exports = router;
