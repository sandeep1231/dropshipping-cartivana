const mongoose = require('mongoose');

/**
 * Product schema for MongoDB collection.
 * @typedef {Object} Product
 * @property {string} name - Name of the product
 * @property {string} description - Description of the product
 * @property {number} price - Price of the product
 * @property {string} category - Category of the product
 * @property {string} imageUrl - Image URL
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
  category: String,
  imageUrl: String,
  sku: { type: String, default: '' },
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

}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
