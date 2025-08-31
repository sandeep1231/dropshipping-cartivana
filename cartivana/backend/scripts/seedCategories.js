/**
 * Seed script to create default categories
 * Run this to populate the Category collection with common e-commerce categories
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');

dotenv.config();

const defaultCategories = [
  {
    name: 'Electronics',
    description: 'Electronic devices, gadgets, and accessories',
    displayOrder: 1
  },
  {
    name: 'Clothing',
    description: 'Fashion and apparel for all ages',
    displayOrder: 2
  },
  {
    name: 'Home & Garden',
    description: 'Home decor, furniture, and gardening supplies',
    displayOrder: 3
  },
  {
    name: 'Sports & Fitness',
    description: 'Sports equipment, fitness gear, and outdoor activities',
    displayOrder: 4
  },
  {
    name: 'Books',
    description: 'Books, magazines, and educational materials',
    displayOrder: 5
  },
  {
    name: 'Beauty & Health',
    description: 'Cosmetics, skincare, and health products',
    displayOrder: 6
  },
  {
    name: 'Toys & Games',
    description: 'Toys, games, and entertainment for kids and adults',
    displayOrder: 7
  },
  {
    name: 'Automotive',
    description: 'Car accessories, parts, and automotive supplies',
    displayOrder: 8
  },
  {
    name: 'Office Supplies',
    description: 'Office equipment, stationery, and business supplies',
    displayOrder: 9
  },
  {
    name: 'Pet Supplies',
    description: 'Pet food, toys, and accessories for all pets',
    displayOrder: 10
  }
];

const seedCategories = async () => {
  try {
    console.log('🌱 Starting category seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    let createdCount = 0;
    let skippedCount = 0;

    for (const categoryData of defaultCategories) {
      try {
        // Check if category already exists
        const existingCategory = await Category.findOne({ 
          name: { $regex: new RegExp(`^${categoryData.name}$`, 'i') } 
        });
        
        if (existingCategory) {
          console.log(`⚠️  Category already exists: ${categoryData.name}`);
          skippedCount++;
          continue;
        }

        // Create new category
        const category = new Category(categoryData);
        await category.save();
        
        console.log(`✅ Created category: ${categoryData.name} (${category.slug})`);
        createdCount++;
        
      } catch (error) {
        console.error(`❌ Error creating category ${categoryData.name}:`, error.message);
      }
    }

    console.log(`\n🎉 Seeding completed!`);
    console.log(`✅ Created ${createdCount} new categories`);
    console.log(`⚠️  Skipped ${skippedCount} existing categories`);

    // Show all categories
    const allCategories = await Category.find({ isActive: true })
      .sort({ displayOrder: 1, name: 1 })
      .select('name slug displayOrder');
    
    console.log(`\n📋 Total active categories: ${allCategories.length}`);
    allCategories.forEach(cat => {
      console.log(`  ${cat.displayOrder}. ${cat.name} (${cat.slug})`);
    });

  } catch (error) {
    console.error('💥 Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the seeding
if (require.main === module) {
  seedCategories();
}

module.exports = { seedCategories, defaultCategories };
