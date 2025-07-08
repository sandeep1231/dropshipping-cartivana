const Cart = require("../models/Cart");

/**
 * Get the current user's cart.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

// Always return a cart object with items, totalQuantity, totalPrice
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id, status: 'active' }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [], status: 'active' });
    }
    // Calculate and update totals in DB
    const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
    cart.totalQuantity = totalQuantity;
    cart.totalPrice = totalPrice;
    await cart.save();
    res.json({
      _id: cart._id,
      user: cart.user,
      items: cart.items,
      totalQuantity: cart.totalQuantity,
      totalPrice: cart.totalPrice,
      status: cart.status,
      updatedAt: cart.updatedAt
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
};
  

/**
 * Add a product to the current user's cart.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

// Always use the active cart, create if not exists, and return consistent structure
exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return res.status(400).json({ message: 'Product ID is required' });

  try {
    let cart = await Cart.findOne({ user: req.user._id, status: 'active' });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [], status: 'active' });
    }
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    await cart.populate('items.product');
    // Calculate and update totals in DB
    const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
    cart.totalQuantity = totalQuantity;
    cart.totalPrice = totalPrice;
    await cart.save();
    res.json({
      _id: cart._id,
      user: cart.user,
      items: cart.items,
      totalQuantity: cart.totalQuantity,
      totalPrice: cart.totalPrice,
      status: cart.status,
      updatedAt: cart.updatedAt
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to cart' });
  }
};
  
/**
 * Remove an item from the current user's cart.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.removeFromCart = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Log for debug
    console.log('Item ID to remove:', itemId);
    console.log('Current cart items:', cart.items);
  
      // Filter out by item._id
      cart.items = cart.items.filter(item => item._id.toString() !== itemId);
  
      await cart.save();
      const populated = await cart.populate('items.product');
      res.json(populated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to remove item from cart' });
    }
  };
  exports.updateCartItem = async (req, res) => {
    try {
      const { quantity } = req.body;
      const itemId = req.params.itemId;
  
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: 'Invalid quantity' });
      }
  
      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      const item = cart.items.find(i => i._id.toString() === itemId);
      if (!item) return res.status(404).json({ message: 'Item not found in cart' });
  
      item.quantity = quantity;
  
      await cart.save();
      const populated = await cart.populate('items.product');
      res.json(populated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update cart item' });
    }
  };
