/**
 * Count books without images
 */

const mongoose = require('mongoose');
const Resource = require('../models/resource');
require('dotenv').config();

async function countMissingImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Count books without images
    const count = await Resource.countDocuments({ 
      type: 'book', 
      $or: [
        { imageUrl: { $exists: false } },
        { imageUrl: null },
        { imageUrl: '' }
      ]
    });
    
    console.log(`Books without images: ${count}`);
    
    // Get total book count
    const total = await Resource.countDocuments({ type: 'book' });
    console.log(`Total books: ${total}`);
    console.log(`Books with images: ${total - count}`);
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the database connection
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the function
countMissingImages();
