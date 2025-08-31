/**
 * Simple script to check and update category isActive status
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const checkAndUpdateCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the Category model
    const Category = require('./models/Category');

    // First, let's see what's in the database
    console.log('\n=== Current Categories in Database ===');
    const allCategories = await Category.find({});
    
    allCategories.forEach(cat => {
      console.log(`ID: ${cat._id}`);
      console.log(`Name: ${cat.name}`);
      console.log(`isActive: ${cat.isActive} (type: ${typeof cat.isActive})`);
      console.log(`Parent: ${cat.parentCategory || 'none'}`);
      console.log('---');
    });

    // Update all categories to have isActive: true if it's not already set
    console.log('\n=== Updating Categories ===');
    const updateResult = await Category.updateMany(
      { 
        $or: [
          { isActive: { $exists: false } },
          { isActive: null },
          { isActive: false }
        ]
      },
      { 
        $set: { 
          isActive: true,
          displayOrder: 0
        } 
      }
    );
    
    console.log(`Updated ${updateResult.modifiedCount} categories`);

    // Show final state
    console.log('\n=== Final Categories State ===');
    const updatedCategories = await Category.find({});
    
    updatedCategories.forEach(cat => {
      console.log(`${cat.name}: isActive = ${cat.isActive} (${typeof cat.isActive})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkAndUpdateCategories();
