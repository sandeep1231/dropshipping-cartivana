require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  const products = await Product.find({}).populate('category', 'name parentCategory');
  console.log('Products found:', products.length);
  products.forEach(p => console.log(`- ${p.name} (Category: ${p.category?.name || 'None'})`));
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
