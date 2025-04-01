/**
 * Inspection Script: Check Book Fields
 * 
 * This script examines book resources to check if ISBN and creator/author fields
 * are properly synchronized.
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

async function inspectBookFields() {
  try {
    console.log('Inspecting book fields...');
    
    // Get all book resources
    const books = await Resource.find({ type: 'book' });
    console.log(`Found ${books.length} books to inspect`);
    
    let isbnInBothCount = 0;
    let isbnOnlyTopLevelCount = 0;
    let isbnOnlyBookDetailsCount = 0;
    let creatorAuthorSyncedCount = 0;
    let creatorAuthorMismatchCount = 0;
    
    for (const book of books) {
      console.log(`\nBook: ${book.title}`);
      
      // Check ISBN fields
      const topLevelIsbn = book.isbn;
      const bookDetailsIsbn = book.bookDetails?.isbn;
      
      console.log(`  Top-level ISBN: ${topLevelIsbn || 'Not set'}`);
      console.log(`  bookDetails.isbn: ${bookDetailsIsbn || 'Not set'}`);
      
      if (topLevelIsbn && bookDetailsIsbn) {
        if (topLevelIsbn === bookDetailsIsbn) {
          console.log('  ✓ ISBN fields are in sync');
          isbnInBothCount++;
        } else {
          console.log('  ✗ ISBN fields have different values');
        }
      } else if (topLevelIsbn) {
        console.log('  ✗ ISBN only exists at top level');
        isbnOnlyTopLevelCount++;
      } else if (bookDetailsIsbn) {
        console.log('  ✗ ISBN only exists in bookDetails');
        isbnOnlyBookDetailsCount++;
      } else {
        console.log('  - No ISBN set');
      }
      
      // Check creator and author fields
      const creator = book.creator || [];
      const author = book.bookDetails?.author || [];
      
      console.log(`  Creator: ${creator.length > 0 ? creator.join(', ') : 'Not set'}`);
      console.log(`  Author: ${author.length > 0 ? author.join(', ') : 'Not set'}`);
      
      // Check if arrays have the same elements
      const creatorStr = creator.map(c => c.toString()).sort().join(',');
      const authorStr = author.map(a => a.toString()).sort().join(',');
      
      if (creatorStr === authorStr) {
        if (creator.length > 0) {
          console.log('  ✓ Creator and author fields are in sync');
          creatorAuthorSyncedCount++;
        } else {
          console.log('  - Both creator and author are empty');
        }
      } else {
        console.log('  ✗ Creator and author fields are not in sync');
        creatorAuthorMismatchCount++;
      }
    }
    
    console.log('\nInspection summary:');
    console.log(`Total books: ${books.length}`);
    console.log(`Books with ISBN in both places: ${isbnInBothCount}`);
    console.log(`Books with ISBN only at top level: ${isbnOnlyTopLevelCount}`);
    console.log(`Books with ISBN only in bookDetails: ${isbnOnlyBookDetailsCount}`);
    console.log(`Books with creator/author in sync: ${creatorAuthorSyncedCount}`);
    console.log(`Books with creator/author mismatch: ${creatorAuthorMismatchCount}`);
  } catch (error) {
    console.error('Error during inspection:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Run the inspection
inspectBookFields();
