const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    const updated = await user.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user role' });
  }
};
const getAdminStats = async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalProducts = await Product.countDocuments();
      const totalOrders = await Order.countDocuments();
  
      const roleCounts = await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]);
  
      const monthlyOrders = await Order.aggregate([
        {
          $group: {
            _id: { $month: '$createdAt' },
            count: { $sum: 1 }
          }
        }
      ]);
  
      const monthlyData = Array(12).fill(0);
      monthlyOrders.forEach(m => {
        monthlyData[m._id - 1] = m.count;
      });
  
      res.json({
        totalUsers,
        totalProducts,
        totalOrders,
        roleCounts,
        monthlyOrders: monthlyData
      });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch admin stats' });
    }
  };
  /**
   * Get all orders with optional filters (email, status, date range).
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  const getAllOrders = async (req, res) => {
    try {
      const { email, status, startDate, endDate } = req.query;
      const filter = {};

      if (email) {
        const user = await User.findOne({ email });
        if (user) filter.user = user._id;
        else return res.json([]); // no match
      }

      if (status) filter.status = status;
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }

      const orders = await Order.find(filter)
        .populate('user', 'name email')
        .populate('products.product', 'name price');

      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  };
  /**
   * Get an order by ID.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  const getOrderById = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate('products.product', 'name price')
        .populate('products.supplier', 'name email');

      if (!order) return res.status(404).json({ message: 'Order not found' });

      res.json(order);
    } catch {
      res.status(500).json({ message: 'Failed to fetch order' });
    }
  };
  
  const updateOrderStatus = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
  
      order.status = req.body.status;
      const updated = await order.save();
      res.json(updated);
    } catch {
      res.status(500).json({ message: 'Status update failed' });
    }
  };
  

module.exports = {
  getAllUsers,
  updateUserRole,
  getAdminStats,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
};
