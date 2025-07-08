const mongoose = require('mongoose');

/**
 * Order schema for MongoDB collection.
 * @typedef {Object} Order
 * @property {mongoose.Types.ObjectId} user - Reference to the user
 * @property {Array<{product: mongoose.Types.ObjectId, name: string, price: number, quantity: number, supplier: mongoose.Types.ObjectId, status: string}>} products - Ordered products with per-item status
 * @property {number} totalAmount - Total order amount
 * @property {string} status - Order status ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
 * @property {string} confirmationId - Confirmation ID
 */
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    price: Number,
    quantity: Number,
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    }
  }],
  totalAmount: Number,
  // status: {
  //   type: String,
  //   enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
  //   default: 'pending'
  // },
  confirmationId: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
