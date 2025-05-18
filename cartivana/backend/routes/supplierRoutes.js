const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProductStats,
  getOrderStats
} = require('../controllers/supplierController');

router.get('/products/stats', protect, getProductStats);
router.get('/orders/stats', protect, getOrderStats);

module.exports = router;
