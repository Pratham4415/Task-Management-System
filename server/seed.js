const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const existing = await User.findOne({ email: 'admin@taskflow.com' });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }

    await User.create({
      name: 'Admin',
      email: 'admin@taskflow.com',
      password: 'Admin@123',
      role: 'admin'
    });

    console.log('Admin user created successfully');
    console.log('Email: admin@taskflow.com');
    console.log('Password: Admin@123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
