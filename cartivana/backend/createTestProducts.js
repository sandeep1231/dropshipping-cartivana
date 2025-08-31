require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  
  // Get categories first
  const categories = await Category.find({});
  console.log('Available categories:', categories.map(c => `${c.name} (${c._id})`));
  
  // Find Electronics and its subcategories
  const electronics = categories.find(c => c.name === 'Electronics');
  const smartphones = categories.find(c => c.name === 'Smartphones');
  const laptops = categories.find(c => c.name === 'Laptops');
  
  if (electronics && smartphones && laptops) {
    console.log('Creating test products...');
    
    // Create products in parent category (Electronics)
    await Product.create({
      name: 'Electronics Bundle',
      description: 'General electronics bundle',
      price: 199.99,
      category: electronics._id,
      supplier: '507f1f77bcf86cd799439011', // Dummy supplier ID
      imageUrls: ['/uploads/test.jpg'],
      stock: 10,
      status: 'approved'
    });
    
    // Create products in subcategories
    await Product.create({
      name: 'iPhone 15',
      description: 'Latest smartphone',
      price: 999.99,
      category: smartphones._id,
      supplier: '507f1f77bcf86cd799439011',
      imageUrls: ['/uploads/test.jpg'],
      stock: 5,
      status: 'approved'
    });
    
    await Product.create({
      name: 'MacBook Pro',
      description: 'Professional laptop',
      price: 1999.99,
      category: laptops._id,
      supplier: '507f1f77bcf86cd799439011',
      imageUrls: ['/uploads/test.jpg'],
      stock: 3,
      status: 'approved'
    });
    
    console.log('Test products created successfully!');
  } else {
    console.log('Required categories not found');
  }
  
  // Check all products
  const products = await Product.find({}).populate('category', 'name parentCategory');
  console.log('All products:', products.map(p => `${p.name} (Category: ${p.category?.name})`));
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
