const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const existing = await User.findOne({ email: 'admin2@cartivana.com' });
    if (existing) {
      console.log('Admin user already exists.');
      return process.exit();
    }

    const hashedPassword = await bcrypt.hash('admin1234', 10);

    await User.create({
      name: 'Admin1',
      email: 'admin2@cartivana.com',
      password: "admin1234",
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
};

createAdmin();
