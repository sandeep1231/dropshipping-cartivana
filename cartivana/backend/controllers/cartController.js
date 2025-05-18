const Cart = require("../models/Cart");

exports.getCart = async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user._id })
        .populate('items.product'); // ✅ populate nested product
  
      if (!cart) return res.json({ items: [], total: 0 });
  
      res.json(cart);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch cart' });
    }
  };
  

  exports.addToCart = async (req, res) => {
    const { productId, quantity = 1 } = req.body;
  
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
  
    try {
      let cart = await Cart.findOne({ user: req.user._id });
  
      if (!cart) {
        cart = new Cart({
          user: req.user._id,
          items: [{ product: productId, quantity }]
        });
      } else {
        const existingItem = cart.items.find(item => item.product.toString() === productId);
  
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({ product: productId, quantity });
        }
      }
  
      const updated = await cart.save();
      const populated = await updated.populate('items.product');
      res.json(populated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to add to cart' });
    }
  };
  
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
