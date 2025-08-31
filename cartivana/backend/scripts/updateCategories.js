/**
 * Update existing categories to ensure they have proper isActive values
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');

dotenv.config();

const updateCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all categories to be active if isActive is not set
    const result = await Category.updateMany(
      { isActive: { $exists: false } },
      { $set: { isActive: true, displayOrder: 0 } }
    );

    console.log(`Updated ${result.modifiedCount} categories`);

    // Show all categories
    const categories = await Category.find({});
    console.log('\nAll categories:');
    categories.forEach(cat => {
      console.log(`- ${cat.name} (Active: ${cat.isActive}, Parent: ${cat.parentCategory || 'none'})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error updating categories:', error);
    process.exit(1);
  }
};

updateCategories();
