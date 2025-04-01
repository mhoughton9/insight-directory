/**
 * Migration Script: Move ISBN to bookDetails
 * 
 * This script moves the ISBN from the top-level field to bookDetails.isbn
 * and syncs the creator and author fields for book resources.
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

async function migrateBookIsbn() {
  try {
    console.log('Starting to migrate ISBN and sync creator/author fields...');
    
    // Get all book resources
    const books = await Resource.find({ type: 'book' });
    console.log(`Found ${books.length} books to process`);
    
    let isbnMigratedCount = 0;
    let creatorSyncedCount = 0;
    let noChangesCount = 0;
    
    for (const book of books) {
      console.log(`\nProcessing: ${book.title}`);
      
      let needsUpdate = false;
      
      // Initialize bookDetails if it doesn't exist
      if (!book.bookDetails) {
        book.bookDetails = {};
        needsUpdate = true;
      }
      
      // Move ISBN to bookDetails if it exists at top level
      if (book.isbn && (!book.bookDetails.isbn || book.bookDetails.isbn !== book.isbn)) {
        console.log(`  Moving ISBN ${book.isbn} to bookDetails`);
        book.bookDetails.isbn = book.isbn;
        isbnMigratedCount++;
        needsUpdate = true;
      }
      
      // Sync creator and author fields
      if (book.creator && book.creator.length > 0) {
        if (!book.bookDetails.author || !arraysEqual(book.creator, book.bookDetails.author)) {
          console.log(`  Syncing creator to author: ${book.creator.join(', ')}`);
          book.bookDetails.author = [...book.creator];
          creatorSyncedCount++;
          needsUpdate = true;
        }
      } else if (book.bookDetails.author && book.bookDetails.author.length > 0) {
        console.log(`  Syncing author to creator: ${book.bookDetails.author.join(', ')}`);
        book.creator = [...book.bookDetails.author];
        creatorSyncedCount++;
        needsUpdate = true;
      }
      
      // Save the book if changes were made
      if (needsUpdate) {
        await book.save();
        console.log(`  Updated book: ${book.title}`);
      } else {
        console.log(`  No changes needed for: ${book.title}`);
        noChangesCount++;
      }
    }
    
    console.log('\nMigration complete.');
    console.log(`Migrated ISBN for ${isbnMigratedCount} books.`);
    console.log(`Synced creator/author for ${creatorSyncedCount} books.`);
    console.log(`${noChangesCount} books needed no changes.`);
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Helper function to check if two arrays have the same elements
function arraysEqual(arr1, arr2) {
  if (!arr1 || !arr2) return false;
  if (arr1.length !== arr2.length) return false;
  
  // Convert to sets and compare string representations
  const set1 = new Set(arr1.map(item => item.toString()));
  const set2 = new Set(arr2.map(item => item.toString()));
  
  if (set1.size !== set2.size) return false;
  
  for (const item of set1) {
    if (!set2.has(item)) return false;
  }
  
  return true;
}

// Run the migration
migrateBookIsbn();
