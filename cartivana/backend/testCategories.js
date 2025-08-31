require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

console.log('Testing connection...');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  return Category.find({});
}).then(cats => {
  console.log('Found categories:', cats.length);
  cats.forEach(cat => {
    console.log(`- ${cat.name} (ID: ${cat._id}, Parent: ${cat.parentCategory || 'none'})`);
  });
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
