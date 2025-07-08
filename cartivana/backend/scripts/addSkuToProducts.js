// Script to add a default SKU to all products that are missing it
const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const products = await Product.find({ $or: [{ sku: { $exists: false } }, { sku: '' }] });
    for (const product of products) {
      product.sku = `SKU-${product._id.toString().slice(-6).toUpperCase()}`;
      await product.save();
      console.log(`Updated product ${product.name} with SKU: ${product.sku}`);
    }
    console.log('SKU update complete.');
    process.exit(0);
  } catch (err) {
    console.error('Error updating SKUs:', err);
    process.exit(1);
  }
})();
