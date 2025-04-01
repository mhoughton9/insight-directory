/**
 * Script to check book links in the database
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB with hardcoded connection string for this one-time check
const MONGODB_URI = 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function checkBookLinks() {
  try {
    console.log('Checking book links...');
    
    // Get all book resources
    const books = await Resource.find({ type: 'book' });
    console.log(`Found ${books.length} books to check`);
    
    for (const book of books) {
      console.log(`\nBook: ${book.title}`);
      
      // Check for links in the bookDetails object
      if (book.bookDetails && book.bookDetails.links) {
        console.log(`  bookDetails.links: ${JSON.stringify(book.bookDetails.links, null, 2)}`);
      } else {
        console.log('  No links in bookDetails');
      }
      
      // Check for the old amazonUrl field
      if (book.amazonUrl) {
        console.log(`  Old amazonUrl: ${book.amazonUrl}`);
      }
    }
    
    console.log('\nCheck complete.');
  } catch (error) {
    console.error('Error during check:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Run the check
checkBookLinks();
