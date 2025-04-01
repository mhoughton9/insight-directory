/**
 * Migration Script: Fix book links format
 * 
 * This script fixes the format of book links that were incorrectly stored
 * as character arrays instead of proper objects with url and label properties.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB with hardcoded connection string for this one-time migration
const MONGODB_URI = 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function fixBookLinks() {
  try {
    console.log('Starting book links format fix...');
    
    // Get all book resources
    const books = await Resource.find({ type: 'book' });
    console.log(`Found ${books.length} books to process`);
    
    let updatedCount = 0;
    let alreadyCorrectCount = 0;
    let noLinksCount = 0;
    
    for (const book of books) {
      console.log(`\nProcessing: ${book.title}`);
      
      // Skip if no bookDetails or links
      if (!book.bookDetails || !book.bookDetails.links) {
        console.log('  No links found');
        noLinksCount++;
        continue;
      }
      
      const links = book.bookDetails.links;
      
      // Check if links need fixing
      let needsFix = false;
      const fixedLinks = [];
      
      for (const link of links) {
        // Check if this is a character array style link
        if (typeof link === 'object' && Object.keys(link).some(key => !isNaN(parseInt(key)))) {
          needsFix = true;
          
          // Reconstruct the URL from the character array
          let url = '';
          for (let i = 0; i < 200; i++) { // Limit to 200 characters to avoid infinite loops
            if (link[i.toString()] === undefined) break;
            url += link[i.toString()];
          }
          
          if (url) {
            // Create a proper link object
            const fixedLink = {
              url: url,
              label: getDefaultLabel(url)
            };
            fixedLinks.push(fixedLink);
            console.log(`  Fixed link: ${url}`);
          }
        } else if (link.url) {
          // This link is already in the correct format
          fixedLinks.push(link);
          console.log(`  Link already correct: ${link.url}`);
        }
      }
      
      // Update the book if links needed fixing
      if (needsFix) {
        book.bookDetails.links = fixedLinks;
        await book.save();
        updatedCount++;
        console.log(`  Updated links for ${book.title}`);
      } else if (links.length > 0) {
        alreadyCorrectCount++;
        console.log(`  Links already in correct format`);
      } else {
        noLinksCount++;
        console.log(`  No links found`);
      }
    }
    
    console.log('\nMigration complete.');
    console.log(`Updated ${updatedCount} books with fixed links.`);
    console.log(`${alreadyCorrectCount} books already had correct link format.`);
    console.log(`${noLinksCount} books had no links.`);
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Helper function to generate a default label from a URL
function getDefaultLabel(url) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    
    // Special case for common domains
    if (domain === 'amazon.com') return 'Amazon';
    if (domain.includes('goodreads.com')) return 'Goodreads';
    if (domain.includes('barnesandnoble.com')) return 'Barnes & Noble';
    
    return domain;
  } catch (e) {
    return 'Visit Website';
  }
}

// Run the migration
fixBookLinks();
