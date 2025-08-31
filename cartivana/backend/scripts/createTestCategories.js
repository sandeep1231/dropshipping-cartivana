/**
 * Script to add test categories for tree structure testing
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');

dotenv.config();

const testCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing categories first (optional)
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Create parent categories
    const electronics = await Category.create({
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
      isActive: true,
      displayOrder: 1
    });

    const clothing = await Category.create({
      name: 'Clothing',
      description: 'Fashion and apparel',
      isActive: true,
      displayOrder: 2
    });

    const home = await Category.create({
      name: 'Home & Garden',
      description: 'Home improvement and garden supplies',
      isActive: true,
      displayOrder: 3
    });

    console.log('Created parent categories:', {
      electronics: electronics._id,
      clothing: clothing._id,
      home: home._id
    });

    // Create subcategories for Electronics
    await Category.create([
      {
        name: 'Smartphones',
        description: 'Mobile phones and accessories',
        parentCategory: electronics._id,
        isActive: true,
        displayOrder: 1
      },
      {
        name: 'Laptops',
        description: 'Computers and laptops',
        parentCategory: electronics._id,
        isActive: true,
        displayOrder: 2
      },
      {
        name: 'Headphones',
        description: 'Audio devices',
        parentCategory: electronics._id,
        isActive: true,
        displayOrder: 3
      }
    ]);

    // Create subcategories for Clothing
    await Category.create([
      {
        name: 'Men\'s Clothing',
        description: 'Clothing for men',
        parentCategory: clothing._id,
        isActive: true,
        displayOrder: 1
      },
      {
        name: 'Women\'s Clothing',
        description: 'Clothing for women',
        parentCategory: clothing._id,
        isActive: true,
        displayOrder: 2
      },
      {
        name: 'Shoes',
        description: 'Footwear for all',
        parentCategory: clothing._id,
        isActive: true,
        displayOrder: 3
      }
    ]);

    // Create subcategories for Home & Garden
    await Category.create([
      {
        name: 'Furniture',
        description: 'Home furniture',
        parentCategory: home._id,
        isActive: true,
        displayOrder: 1
      },
      {
        name: 'Garden Tools',
        description: 'Tools for gardening',
        parentCategory: home._id,
        isActive: true,
        displayOrder: 2
      }
    ]);

    console.log('Created all test categories successfully!');

    // Show final structure
    const allCategories = await Category.find({}).sort({ displayOrder: 1, name: 1 });
    console.log('\nFinal category structure:');
    
    allCategories.forEach(cat => {
      const indent = cat.parentCategory ? '  └─ ' : '';
      console.log(`${indent}${cat.name} (ID: ${cat._id}, Active: ${cat.isActive}, Parent: ${cat.parentCategory || 'none'})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating test categories:', error);
    process.exit(1);
  }
};

testCategories();
