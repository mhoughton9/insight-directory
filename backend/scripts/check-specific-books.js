/**
 * Check specific books in the database
 * This script checks the image URLs for specific books that are having display issues
 */

const mongoose = require('mongoose');
const Resource = require('../models/resource');
require('dotenv').config();

async function checkSpecificBooks() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // List of book titles to check
    const titlesToCheck = [
      'The Open Secret',
      'The Light That I Am',
      'Being Myself',
      'Awake: It\'s Your Turn',
      'The Direct Path',
      'Clarity',
      'Emptiness Dancing',
      'The Way of Liberation',
      'This Is Always Enough',
      'Nothing to Grasp',
      'When Spirit Leaps',
      'Awake in the Heartland',
      'The Sacred Mirror',
      'A Thousand Names for Joy',
      'Effortless Being'
    ];
    
    // Check each book
    for (const title of titlesToCheck) {
      const book = await Resource.findOne({ title: title, type: 'book' });
      
      if (book) {
        console.log(`\n${book.title}`);
        console.log(`ID: ${book._id}`);
        console.log(`Image URL: ${book.imageUrl || 'None'}`);
        console.log(`Image Processed: ${book.imageProcessed ? 'Yes' : 'No'}`);
        console.log(`ISBN: ${book.isbn || 'None'}`);
        console.log(`Slug: ${book.slug || 'None'}`);
      } else {
        console.log(`\nBook not found: ${title}`);
      }
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
checkSpecificBooks();
