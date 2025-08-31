/**
 * Migration script to convert string categories to Category references
 * Run this script ONCE after deploying the new Category model
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');

dotenv.config();

const migrateCategoriesAndProducts = async () => {
  try {
    console.log('🚀 Starting category migration...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Step 1: Get all unique category names from existing products
    console.log('📊 Finding unique categories from products...');
    const products = await Product.find({}).select('category categoryName');
    
    // Collect unique category names (handle both old and new field names)
    const uniqueCategories = new Set();
    products.forEach(product => {
      if (product.category && typeof product.category === 'string') {
        uniqueCategories.add(product.category.trim());
      }
      if (product.categoryName && typeof product.categoryName === 'string') {
        uniqueCategories.add(product.categoryName.trim());
      }
    });

    const categoryNames = Array.from(uniqueCategories).filter(name => name && name !== '');
    console.log(`Found ${categoryNames.length} unique categories:`, categoryNames);

    // Step 2: Create Category documents
    console.log('📝 Creating category documents...');
    const categoryMap = new Map(); // name -> ObjectId mapping
    
    for (const categoryName of categoryNames) {
      try {
        // Check if category already exists
        let category = await Category.findOne({ 
          name: { $regex: new RegExp(`^${categoryName}$`, 'i') } 
        });
        
        if (!category) {
          category = new Category({
            name: categoryName,
            description: `Products in ${categoryName} category`,
            isActive: true,
            displayOrder: 0
          });
          await category.save();
          console.log(`✅ Created category: ${categoryName}`);
        } else {
          console.log(`⚠️  Category already exists: ${categoryName}`);
        }
        
        categoryMap.set(categoryName, category._id);
      } catch (error) {
        console.error(`❌ Error creating category ${categoryName}:`, error.message);
      }
    }

    // Step 3: Update products to reference Category ObjectIds
    console.log('🔄 Updating product category references...');
    let updatedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        let categoryName = null;
        
        // Determine which category name to use
        if (product.category && typeof product.category === 'string') {
          categoryName = product.category.trim();
        } else if (product.categoryName && typeof product.categoryName === 'string') {
          categoryName = product.categoryName.trim();
        }

        if (categoryName && categoryMap.has(categoryName)) {
          const categoryId = categoryMap.get(categoryName);
          
          // Update the product
          await Product.findByIdAndUpdate(
            product._id,
            {
              category: categoryId,
              categoryName: categoryName // Keep for reference during transition
            }
          );
          
          updatedCount++;
          if (updatedCount % 10 === 0) {
            console.log(`Updated ${updatedCount} products...`);
          }
        } else {
          console.warn(`⚠️  No category found for product ${product._id}: "${categoryName}"`);
          errorCount++;
        }
      } catch (error) {
        console.error(`❌ Error updating product ${product._id}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n🎉 Migration completed!`);
    console.log(`✅ Updated ${updatedCount} products`);
    console.log(`⚠️  ${errorCount} errors/warnings`);
    console.log(`📋 Created ${categoryMap.size} categories`);

    // Step 4: Verify the migration
    console.log('\n🔍 Verifying migration...');
    const productsWithCategoryRefs = await Product.countDocuments({ 
      category: { $type: 'objectId' } 
    });
    const totalProducts = await Product.countDocuments({});
    
    console.log(`Products with category references: ${productsWithCategoryRefs}/${totalProducts}`);
    
    // Show sample of migrated data
    const sampleProduct = await Product.findOne({ category: { $type: 'objectId' } })
      .populate('category', 'name slug');
    
    if (sampleProduct) {
      console.log('\n📄 Sample migrated product:');
      console.log(`  Product: ${sampleProduct.name}`);
      console.log(`  Category: ${sampleProduct.category?.name} (${sampleProduct.category?._id})`);
    }

    console.log('\n✨ Migration script completed successfully!');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the migration
if (require.main === module) {
  migrateCategoriesAndProducts();
}

module.exports = { migrateCategoriesAndProducts };
