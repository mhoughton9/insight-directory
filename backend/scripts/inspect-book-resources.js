/**
 * Inspection Script: Examine Book Resources
 * 
 * This script examines book resources to find where Amazon affiliate links might be stored.
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

async function inspectBookResources() {
  try {
    console.log('Inspecting book resources...');
    
    // Get all book resources
    const books = await Resource.find({ type: 'book' });
    console.log(`Found ${books.length} books to inspect`);
    
    // Examine the first few books in detail
    const sampleSize = Math.min(5, books.length);
    console.log(`\nExamining ${sampleSize} sample books in detail:`);
    
    for (let i = 0; i < sampleSize; i++) {
      const book = books[i];
      console.log(`\n----- Book ${i+1}: ${book.title} -----`);
      
      // Log all top-level fields
      console.log('Top-level fields:');
      Object.keys(book._doc).forEach(key => {
        if (key !== 'bookDetails' && key !== '__v' && key !== '_id') {
          console.log(`  ${key}: ${JSON.stringify(book[key])}`);
        }
      });
      
      // Log bookDetails fields
      if (book.bookDetails) {
        console.log('\nbookDetails fields:');
        Object.keys(book.bookDetails._doc || book.bookDetails).forEach(key => {
          console.log(`  ${key}: ${JSON.stringify(book.bookDetails[key])}`);
        });
      } else {
        console.log('\nNo bookDetails found');
      }
      
      // Check for processed field
      console.log(`\nProcessed: ${book.processed || false}`);
    }
    
    // Count books with various fields
    console.log('\n----- Field Statistics -----');
    
    // Count books with links in bookDetails
    const booksWithLinks = books.filter(book => 
      book.bookDetails && 
      book.bookDetails.links && 
      book.bookDetails.links.length > 0
    );
    console.log(`Books with links in bookDetails: ${booksWithLinks.length}`);
    
    // Count books with url field
    const booksWithUrl = books.filter(book => book.url && book.url.trim() !== '');
    console.log(`Books with url field: ${booksWithUrl.length}`);
    
    // Count books with amazonLink in bookDetails
    const booksWithAmazonLink = books.filter(book => 
      book.bookDetails && 
      book.bookDetails.amazonLink && 
      book.bookDetails.amazonLink.trim() !== ''
    );
    console.log(`Books with amazonLink in bookDetails: ${booksWithAmazonLink.length}`);
    
    // Count processed books
    const processedBooks = books.filter(book => book.processed === true);
    console.log(`Books marked as processed: ${processedBooks.length}`);
    
    // Look for any other fields that might contain Amazon links
    console.log('\n----- Searching for potential Amazon link fields -----');
    const potentialLinkFields = new Set();
    
    books.forEach(book => {
      // Check all top-level string fields for 'amazon'
      Object.keys(book._doc).forEach(key => {
        if (typeof book[key] === 'string' && book[key].includes('amazon')) {
          potentialLinkFields.add(key);
          console.log(`Found potential Amazon link in field '${key}': ${book[key]}`);
        }
      });
      
      // Check all bookDetails string fields for 'amazon'
      if (book.bookDetails) {
        Object.keys(book.bookDetails._doc || book.bookDetails).forEach(key => {
          if (typeof book.bookDetails[key] === 'string' && book.bookDetails[key].includes('amazon')) {
            potentialLinkFields.add(`bookDetails.${key}`);
            console.log(`Found potential Amazon link in field 'bookDetails.${key}': ${book.bookDetails[key]}`);
          }
        });
      }
    });
    
    console.log(`\nPotential fields containing Amazon links: ${Array.from(potentialLinkFields).join(', ') || 'None found'}`);
    
  } catch (error) {
    console.error('Error during inspection:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Run the inspection
inspectBookResources();
