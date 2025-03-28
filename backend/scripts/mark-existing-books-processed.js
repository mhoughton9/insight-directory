/**
 * Migration script to mark all existing book resources as processed
 * This ensures they continue to appear on the public site
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Mark all existing book resources as processed
const markBooksAsProcessed = async () => {
  try {
    console.log('Starting migration: Marking existing books as processed...');
    
    // Find all book resources that don't have the processed flag set
    const books = await Resource.find({ 
      type: 'book',
      processed: { $ne: true } // Only target books that aren't already marked as processed
    });
    
    console.log(`Found ${books.length} books to update`);
    
    if (books.length === 0) {
      console.log('No books need updating. All books are already marked as processed.');
      return;
    }
    
    // Update all books to set processed = true
    const result = await Resource.updateMany(
      { type: 'book', processed: { $ne: true } },
      { $set: { processed: true } }
    );
    
    console.log(`Successfully updated ${result.modifiedCount} books.`);
    console.log('Migration complete!');
  } catch (error) {
    console.error('Error in migration:', error);
  }
};

// Run the migration
const runMigration = async () => {
  await connectDB();
  await markBooksAsProcessed();
  process.exit(0);
};

runMigration();
