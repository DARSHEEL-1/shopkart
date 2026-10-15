const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/product.model');

const sampleProducts = [
  {
    name: 'Wireless Headphones',
    price: 99.99,
    category: 'Electronics',
    description: 'High-quality active noise cancelling wireless headphones.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    stock: 10,
  },
  {
    name: 'Smart Watch',
    price: 149.99,
    category: 'Electronics',
    description: 'Fitness tracker and smartwatch with heart rate monitor.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    stock: 15,
  },
  {
    name: 'Running Shoes',
    price: 79.99,
    category: 'Sports',
    description: 'Comfortable lightweight running shoes for daily workouts.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    stock: 20,
  },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB for seeding...');
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted successfully!');
    process.exit();
  })
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });