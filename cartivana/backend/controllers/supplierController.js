const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * Get product statistics for the current supplier.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getProductStats = async (req, res) => {
  try {
    const supplierId = req.user._id;

    const total = await Product.countDocuments({ supplier: supplierId });
    const approved = await Product.countDocuments({ supplier: supplierId, status: 'approved' });
    const pending = await Product.countDocuments({ supplier: supplierId, status: 'pending' });
    const rejected = await Product.countDocuments({ supplier: supplierId, status: 'rejected' });

    res.json({ total, approved, pending, rejected });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product stats.' });
  }
};

/**
 * Get order statistics for the current supplier.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getOrderStats = async (req, res) => {
  try {
    const supplierId = req.user._id;

    const orders = await Order.find({ 'products.supplier': supplierId });

    const totalOrders = orders.length;

    // Monthly order count
    const monthlyOrders = Array(12).fill(0);
    orders.forEach(order => {
      const month = new Date(order.createdAt).getMonth();
      monthlyOrders[month]++;
    });

    res.json({ totalOrders, monthlyOrders });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order stats.' });
  }
};

module.exports = { getProductStats, getOrderStats };
