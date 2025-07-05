const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require('../models/Cart');

/**
 * Place a new order for the current user based on their cart.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Load the user's cart with product and supplier
    // 1. Find active cart
    const cart = await Cart.findOne({ user: userId, status: 'active' }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // 2. Build order items with detailed info
    const orderItems = cart.items.map(item => {
      const product = item.product;

      if (!product) throw new Error('Product not found in cart');

      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        supplier: product.supplier
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 3. Create the order
    const order = new Order({
      user: userId,
      products: orderItems,
      totalAmount,
      status: 'pending'
    });

    const saved = await order.save();

    // 4. Clear the user's cart
    cart.status = 'inactive';
    await cart.save();

    // ✅ 5. Create a new active cart for user (optional)
    await Cart.create({ user: userId, items: [], status: 'active' });
    // 6. Populate final order for response
    const populated = await Order.findById(saved._id)
      .populate('user', 'name email')
      .populate('products.product', 'name price')
      .populate('products.supplier', 'name email');

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Order failed', error: err.message });
  }
};
exports.getOrders = async (req, res) => {
  const orders = await Order.find().populate("customer products.product");
  res.json(orders);
};
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ customer: req.user._id }).populate("products.product");
  res.json(orders);
};

exports.getOrderDetails = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("products.product");
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
};
exports.getMyOrdersForUser = async (req, res) => {
    try {
      const userId = req.user?._id;
  
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: No user ID in request' });
      }
  
      const orders = await Order.find({ user: userId })
        .populate({ path: 'products.product', select: 'name price' })
        .populate({ path: 'products.supplier', select: 'name email' });
  
      return res.json(orders);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
    }
  };
  
exports.getOrderByIdForUser = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    })
      .populate('products.product', 'name price')
      .populate('products.supplier', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load order' });
  }
};
  
