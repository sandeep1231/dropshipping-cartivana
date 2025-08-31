const mongoose = require('mongoose');

/**
 * Product schema for MongoDB collection.
 * @typedef {Object} Product
 * @property {string} name - Name of the product
 * @property {string} description - Description of the product
 * @property {number} price - Price of the product
 * @property {mongoose.Types.ObjectId} category - Reference to Category
 * @property {string[]} imageUrls - Array of image URLs
 * @property {string} sku - Stock Keeping Unit
 * @property {boolean} featured - Whether the product is featured
 * @property {boolean} approved - Whether the product is approved
 * @property {mongoose.Types.ObjectId} supplier - Reference to the supplier (User)
 * @property {string} status - Product status ('pending', 'approved', 'rejected')
 * @property {string} rejectionReason - Reason for rejection
 */
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  // Keep old category field for backward compatibility during migration
  categoryName: { type: String }, // Temporary field for migration
  imageUrls: {
    type: [String],
    default: []
  },
  sku: { type: String, default: '' },
  stock: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: { type: String, default: '' },
  tags: [{ type: String }],
  weight: { type: Number },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  }
}, {
  timestamps: true
});

// Index for better query performance
productSchema.index({ category: 1, status: 1 });
productSchema.index({ supplier: 1 });
productSchema.index({ featured: 1, status: 1 });

module.exports = mongoose.model('Product', productSchema);
