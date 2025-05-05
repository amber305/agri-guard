require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const sampleProducts = [
  {
    name: 'Organic Pesticide',
    description: 'Natural and effective pesticide for organic farming',
    price: 299,
    image: 'https://images.unsplash.com/photo-1584990347449-a2d4c2c8c1e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'Pest Control',
    stock: 50
  },
  {
    name: 'Soil Testing Kit',
    description: 'Complete kit for testing soil pH and nutrients',
    price: 499,
    image: 'https://images.unsplash.com/photo-1584990347449-a2d4c2c8c1e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'Soil Health',
    stock: 30
  },
  {
    name: 'Smart Irrigation System',
    description: 'Automated irrigation system with moisture sensors',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1584990347449-a2d4c2c8c1e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'Irrigation',
    stock: 15
  },
  {
    name: 'Disease Detection App',
    description: 'Mobile app for detecting plant diseases using AI',
    price: 199,
    image: 'https://images.unsplash.com/photo-1584990347449-a2d4c2c8c1e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'Disease Detection',
    stock: 100
  }
];

const createSampleProducts = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Add sample products
    await Product.insertMany(sampleProducts);
    
    console.log('Sample products created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample products:', error);
    process.exit(1);
  }
};

createSampleProducts(); 