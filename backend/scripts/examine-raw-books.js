/**
 * Examine Raw Book Documents
 * 
 * This script directly examines the raw MongoDB documents to find ISBNs
 * and understand why they're not showing up in the Mongoose model.
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

async function examineRawBooks() {
  try {
    // Wait for connection to be established
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Examining raw book documents in MongoDB...');
    
    // Get the raw collection
    const db = mongoose.connection.db;
    const resourcesCollection = db.collection('resources');
    
    // Find all book resources
    const books = await resourcesCollection.find({ type: 'book' }).toArray();
    console.log(`Found ${books.length} books in the database`);
    
    // Check for ISBN fields
    let topLevelIsbnCount = 0;
    let bookDetailsIsbnCount = 0;
    let bothIsbnCount = 0;
    let noIsbnCount = 0;
    
    console.log('\nExamining ISBN fields in raw documents:');
    
    for (const book of books) {
      const title = book.title || 'Unknown Title';
      const topLevelIsbn = book.isbn;
      const bookDetailsIsbn = book.bookDetails?.isbn;
      
      console.log(`\nBook: ${title}`);
      console.log(`  Raw _id: ${book._id}`);
      console.log(`  Top-level ISBN: ${topLevelIsbn || 'Not set'}`);
      console.log(`  bookDetails.isbn: ${bookDetailsIsbn || 'Not set'}`);
      
      // Count ISBN occurrences
      if (topLevelIsbn && bookDetailsIsbn) {
        bothIsbnCount++;
        console.log('  ✓ ISBN exists in both places');
      } else if (topLevelIsbn) {
        topLevelIsbnCount++;
        console.log('  ! ISBN only exists at top level');
      } else if (bookDetailsIsbn) {
        bookDetailsIsbnCount++;
        console.log('  ! ISBN only exists in bookDetails');
      } else {
        noIsbnCount++;
        console.log('  ✗ No ISBN found');
      }
      
      // Check other important fields
      console.log(`  Schema version: ${book.__v !== undefined ? book.__v : 'Not set'}`);
      console.log(`  Has bookDetails: ${book.bookDetails ? 'Yes' : 'No'}`);
      
      // Print all fields for the first few books
      if (books.indexOf(book) < 3) {
        console.log('  All fields:');
        console.log(JSON.stringify(book, null, 2).split('\n').map(line => `    ${line}`).join('\n'));
      }
    }
    
    console.log('\nSummary:');
    console.log(`Total books: ${books.length}`);
    console.log(`Books with ISBN in both places: ${bothIsbnCount}`);
    console.log(`Books with ISBN only at top level: ${topLevelIsbnCount}`);
    console.log(`Books with ISBN only in bookDetails: ${bookDetailsIsbnCount}`);
    console.log(`Books with no ISBN: ${noIsbnCount}`);
  } catch (error) {
    console.error('Error examining raw books:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Run the examination
examineRawBooks();
