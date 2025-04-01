/**
 * Fix ISBN Storage
 * 
 * This script checks for ISBNs in the database and ensures they're properly stored
 * in both the top-level isbn field and bookDetails.isbn.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function fixIsbnStorage() {
  try {
    console.log('Checking for ISBNs in the database...');
    
    // Find all book resources that might have ISBNs
    const books = await Resource.find({ type: 'book' }).lean();
    console.log(`Found ${books.length} books in the database`);
    
    // Filter books that have ISBNs
    const booksWithIsbn = books.filter(book => book.isbn && book.isbn.trim() !== '');
    console.log(`Found ${booksWithIsbn.length} books with ISBNs`);
    
    // Log the first few books with ISBNs
    if (booksWithIsbn.length > 0) {
      console.log('\nSample books with ISBNs:');
      for (let i = 0; i < Math.min(5, booksWithIsbn.length); i++) {
        console.log(`${booksWithIsbn[i].title}: ISBN = ${booksWithIsbn[i].isbn}`);
      }
    }
    
    // Now use the Mongoose model to properly update all books
    console.log(`\nProcessing ${books.length} books to ensure ISBNs are properly stored...`);
    
    let updatedCount = 0;
    let noIsbnCount = 0;
    
    for (const bookData of books) {
      // Get the actual Mongoose model instance for this book
      const book = await Resource.findById(bookData._id);
      if (!book) continue;
      
      console.log(`\nProcessing: ${book.title}`);
      console.log(`  Top-level ISBN: ${book.isbn || 'Not set'}`);
      console.log(`  bookDetails.isbn: ${book.bookDetails?.isbn || 'Not set'}`);
      
      if (book.isbn && book.isbn.trim() !== '') {
        // Initialize bookDetails if it doesn't exist
        if (!book.bookDetails) {
          book.bookDetails = {};
        }
        
        // Update bookDetails.isbn if it doesn't match the top-level isbn
        if (!book.bookDetails.isbn || book.bookDetails.isbn !== book.isbn) {
          book.bookDetails.isbn = book.isbn;
          
          // Save the book to trigger middleware
          await book.save();
          
          console.log(`  ✓ Updated ISBN for ${book.title}`);
          updatedCount++;
        } else {
          console.log(`  ✓ ISBN already properly stored for ${book.title}`);
        }
      } else {
        console.log(`  ✗ No ISBN found for ${book.title}`);
        noIsbnCount++;
      }
    }
    
    console.log('\nFix complete.');
    console.log(`Updated ${updatedCount} books with ISBNs.`);
    console.log(`${noIsbnCount} books had no ISBNs.`);
  } catch (error) {
    console.error('Error during fix:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Run the fix
fixIsbnStorage();
