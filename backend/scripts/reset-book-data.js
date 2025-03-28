/**
 * Reset Book Data Script
 * 
 * This script resets book image URLs, ISBNs, and image processing flags
 * to prepare for importing data from Amazon's Product Advertising API.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    resetBookData();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

/**
 * Reset book data to prepare for Amazon API import
 */
async function resetBookData() {
  try {
    console.log('Resetting book data to prepare for Amazon API import...');
    
    // Find all book resources
    const books = await Resource.find({ type: 'book' });
    console.log(`Found ${books.length} books to reset`);
    
    let updatedCount = 0;
    
    // Process each book
    for (const book of books) {
      const updateData = {};
      const fieldsToReset = [];
      
      // Reset image URL if it exists
      if (book.imageUrl) {
        updateData.imageUrl = null;
        fieldsToReset.push('imageUrl');
      }
      
      // Reset ISBN if it exists
      if (book.isbn) {
        updateData.isbn = null;
        fieldsToReset.push('isbn');
      }
      
      // Reset imageProcessed flag
      updateData.imageProcessed = false;
      fieldsToReset.push('imageProcessed');
      
      // Update the book if there are fields to reset
      if (fieldsToReset.length > 0) {
        await Resource.findByIdAndUpdate(book._id, updateData);
        updatedCount++;
        console.log(`Reset data for book: ${book.title} (${fieldsToReset.join(', ')})`);
      }
    }
    
    console.log(`\nReset complete!`);
    console.log(`Updated ${updatedCount} of ${books.length} books`);
    
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (err) {
    console.error('Error resetting book data:', err);
    mongoose.connection.close();
    process.exit(1);
  }
}
