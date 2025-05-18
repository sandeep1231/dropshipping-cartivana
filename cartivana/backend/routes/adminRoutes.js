const express = require('express');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { getAllUsers, updateUserRole, getAdminStats, getAllOrders, getOrderById, updateOrderStatus } = require('../controllers/adminController');

const router = express.Router();

router.get('/users', protect, isAdmin, getAllUsers);
router.patch('/users/:id/role', protect, isAdmin, updateUserRole);
router.get('/stats', protect, isAdmin, getAdminStats);
router.get('/orders', protect, isAdmin, getAllOrders);
router.get('/orders/:id', protect, isAdmin, getOrderById);
router.patch('/orders/:id/status', protect, isAdmin, updateOrderStatus);


module.exports = router;
