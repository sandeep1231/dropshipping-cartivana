const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
    const query = { status: 'approved' };
  
    if (req.query.supplier) {
      query.supplier = req.query.supplier;
    }
  
    try {
      const products = await Product.find(query).populate('supplier', 'name email');
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch products.' });
    }
  };
  
  

const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ supplier: req.user._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your products.' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Invalid product ID' });
  }
};

const createProduct = async (req, res) => {
    try {
      const status = req.user.role === 'admin' ? 'approved' : 'pending';
  
      const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
        supplier: req.user._id,
        status
      });
  
      const saved = await product.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ message: 'Failed to create product.' });
    }
  };
  
  

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
const getPendingProducts = async (req, res) => {
    try {
      const pending = await Product.find({ status: 'pending' }).populate('supplier', 'name email');
      res.json(pending);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch pending products.' });
    }
  };
  
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
      product.imageUrl = req.body.imageUrl || product.imageUrl;
  
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
      const products = await Product.find({ status: 'approved', featured: true }).limit(10);
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
  toggleFeatured
};
