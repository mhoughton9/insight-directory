/**
 * Check book image URLs
 * This script checks the image URLs for books in the database
 */

const mongoose = require('mongoose');
const Resource = require('../models/resource');
require('dotenv').config();

async function checkBookImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find books with images
    const books = await Resource.find({ 
      type: 'book',
      imageUrl: { $exists: true, $ne: null, $ne: '' }
    }).limit(20);
    
    console.log(`Found ${books.length} books with image URLs`);
    
    // Display each book's title and image URL
    books.forEach(book => {
      console.log(`\n${book.title}`);
      console.log(`Image URL: ${book.imageUrl}`);
      console.log(`Processed: ${book.imageProcessed ? 'Yes' : 'No'}`);
    });
    
    // Check for books with placeholder URLs
    const placeholderBooks = await Resource.find({
      type: 'book',
      imageUrl: /example\.com/
    }).limit(10);
    
    if (placeholderBooks.length > 0) {
      console.log('\n\nBooks with placeholder URLs:');
      placeholderBooks.forEach(book => {
        console.log(`${book.title}: ${book.imageUrl}`);
      });
    }
    
    // Check for books with Cloudinary URLs
    const cloudinaryBooks = await Resource.find({
      type: 'book',
      imageUrl: /cloudinary\.com/
    }).limit(10);
    
    if (cloudinaryBooks.length > 0) {
      console.log('\n\nBooks with Cloudinary URLs:');
      cloudinaryBooks.forEach(book => {
        console.log(`${book.title}: ${book.imageUrl}`);
      });
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the database connection
    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the function
checkBookImages();
