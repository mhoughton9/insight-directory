/**
 * Migration Script: Fix Book Amazon Links
 * 
 * This script migrates Amazon affiliate links from bookDetails.amazonLink to bookDetails.links
 * and removes any bogus links that were previously generated.
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

async function migrateBookAmazonLinks() {
  try {
    console.log('Starting book Amazon links migration...');
    
    // Get all book resources
    const books = await Resource.find({ type: 'book' });
    console.log(`Found ${books.length} books to process`);
    
    let updatedCount = 0;
    let noAmazonLinkCount = 0;
    let noChangesCount = 0;
    
    for (const book of books) {
      console.log(`\nProcessing: ${book.title}`);
      
      // Check if book has amazonLink from the admin form
      if (!book.bookDetails || !book.bookDetails.amazonLink) {
        console.log('  No amazonLink found');
        noAmazonLinkCount++;
        continue;
      }
      
      const amazonLink = book.bookDetails.amazonLink.trim();
      if (!amazonLink) {
        console.log('  Empty amazonLink');
        noAmazonLinkCount++;
        continue;
      }
      
      console.log(`  Found amazonLink: ${amazonLink}`);
      
      // Initialize links array if it doesn't exist
      if (!book.bookDetails.links) {
        book.bookDetails.links = [];
      }
      
      // Check if the Amazon link already exists in the links array
      const amazonLinkExists = book.bookDetails.links.some(link => {
        // Check if link has url property and it's the same as amazonLink
        if (link.url && link.url === amazonLink) return true;
        
        // Check if link is a character array and reconstructing it matches amazonLink
        if (typeof link === 'object' && !link.url) {
          const keys = Object.keys(link).filter(key => !isNaN(parseInt(key)));
          if (keys.length > 0) {
            keys.sort((a, b) => parseInt(a) - parseInt(b));
            let url = '';
            for (const key of keys) {
              if (link[key] === undefined) break;
              url += link[key];
            }
            return url === amazonLink;
          }
        }
        
        return false;
      });
      
      if (amazonLinkExists) {
        console.log('  Amazon link already exists in links array');
        noChangesCount++;
        continue;
      }
      
      // Filter out any bogus links (links that don't have a proper URL structure)
      const validLinks = book.bookDetails.links.filter(link => {
        // Keep links with valid url property
        if (link.url && isValidUrl(link.url)) return true;
        
        // For character array links, reconstruct and validate
        if (typeof link === 'object' && !link.url) {
          const keys = Object.keys(link).filter(key => !isNaN(parseInt(key)));
          if (keys.length > 0) {
            keys.sort((a, b) => parseInt(a) - parseInt(b));
            let url = '';
            for (const key of keys) {
              if (link[key] === undefined) break;
              url += link[key];
            }
            return isValidUrl(url);
          }
        }
        
        return false;
      });
      
      // Add the Amazon link to the filtered links array
      validLinks.push({
        url: amazonLink,
        label: 'Amazon'
      });
      
      // Update the book with the new links array
      book.bookDetails.links = validLinks;
      await book.save();
      
      console.log(`  Updated links for ${book.title}`);
      console.log(`  Removed ${book.bookDetails.links.length - validLinks.length} bogus links`);
      console.log(`  Added Amazon affiliate link`);
      
      updatedCount++;
    }
    
    console.log('\nMigration complete.');
    console.log(`Updated ${updatedCount} books with Amazon affiliate links.`);
    console.log(`${noAmazonLinkCount} books had no Amazon affiliate link.`);
    console.log(`${noChangesCount} books already had the correct Amazon link.`);
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Helper function to validate URLs
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Run the migration
migrateBookAmazonLinks();
