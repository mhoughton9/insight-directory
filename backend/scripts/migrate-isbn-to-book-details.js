/**
 * Migrate ISBN to bookDetails
 * 
 * This script migrates ISBNs from the top-level field to bookDetails.isbn
 * using direct MongoDB operations to ensure the data is properly updated.
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function migrateIsbnToBookDetails() {
  try {
    // Wait for connection to be established
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Migrating ISBNs to bookDetails...');
    
    // Get the raw collection
    const db = mongoose.connection.db;
    const resourcesCollection = db.collection('resources');
    
    // Find all book resources with ISBNs
    const books = await resourcesCollection.find({
      type: 'book',
      isbn: { $exists: true, $ne: '' }
    }).toArray();
    
    console.log(`Found ${books.length} books with ISBNs to migrate`);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const book of books) {
      try {
        console.log(`\nProcessing: ${book.title}`);
        console.log(`  ISBN: ${book.isbn}`);
        
        // Update the book to add ISBN to bookDetails
        const result = await resourcesCollection.updateOne(
          { _id: book._id },
          { 
            $set: { 
              'bookDetails.isbn': book.isbn 
            }
          }
        );
        
        if (result.modifiedCount > 0) {
          console.log(`  ✓ Successfully migrated ISBN for ${book.title}`);
          updatedCount++;
        } else {
          console.log(`  ✗ No changes made for ${book.title}`);
        }
      } catch (err) {
        console.error(`  Error updating ${book.title}:`, err);
        errorCount++;
      }
    }
    
    console.log('\nMigration complete.');
    console.log(`Successfully migrated ${updatedCount} books.`);
    console.log(`Failed to migrate ${errorCount} books.`);
    
    // Verify the migration
    const verifyBooks = await resourcesCollection.find({
      type: 'book',
      'bookDetails.isbn': { $exists: true, $ne: '' }
    }).toArray();
    
    console.log(`\nVerification: ${verifyBooks.length} books now have ISBN in bookDetails.`);
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Run the migration
migrateIsbnToBookDetails();
