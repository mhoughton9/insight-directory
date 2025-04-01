/**
 * Fix Book Details Structure
 * 
 * This script fixes the structure of bookDetails in book resources and ensures
 * links are properly formatted.
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

async function fixBookDetailsStructure() {
  try {
    console.log('Starting to fix book details structure...');
    
    // Get all book resources
    const books = await Resource.find({ type: 'book' });
    console.log(`Found ${books.length} books to process`);
    
    let updatedCount = 0;
    let noChangesCount = 0;
    
    for (const book of books) {
      console.log(`\nProcessing: ${book.title}`);
      
      let needsUpdate = false;
      
      // Check if bookDetails is properly structured
      if (!book.bookDetails || typeof book.bookDetails !== 'object') {
        console.log('  Creating bookDetails object');
        book.bookDetails = {};
        needsUpdate = true;
      }
      
      // Ensure links array exists
      if (!book.bookDetails.links || !Array.isArray(book.bookDetails.links)) {
        console.log('  Creating links array');
        book.bookDetails.links = [];
        needsUpdate = true;
      }
      
      // Add Amazon link based on ISBN if available
      if (book.isbn && book.isbn.trim() !== '') {
        const isbn = book.isbn.trim();
        const amazonUrl = `https://www.amazon.com/dp/${isbn}?tag=insightdirectory-20`;
        
        // Check if this Amazon link already exists
        const amazonLinkExists = book.bookDetails.links.some(link => {
          if (link && link.url && link.url.includes('amazon.com') && link.url.includes(isbn)) {
            return true;
          }
          return false;
        });
        
        if (!amazonLinkExists) {
          console.log(`  Adding Amazon link for ISBN: ${isbn}`);
          book.bookDetails.links.push({
            url: amazonUrl,
            label: 'Amazon'
          });
          needsUpdate = true;
        }
      }
      
      // Fix any character array links
      const fixedLinks = [];
      let foundBrokenLinks = false;
      
      for (const link of book.bookDetails.links) {
        // Skip null or undefined links
        if (!link) continue;
        
        // If link already has url and label properties, keep it
        if (link.url && typeof link.url === 'string') {
          fixedLinks.push(link);
          continue;
        }
        
        // Check if link is a character array
        if (typeof link === 'object') {
          const keys = Object.keys(link).filter(key => !isNaN(parseInt(key)));
          if (keys.length > 0) {
            // Reconstruct the URL from the character array
            keys.sort((a, b) => parseInt(a) - parseInt(b));
            let url = '';
            for (const key of keys) {
              if (link[key] === undefined) break;
              url += link[key];
            }
            
            if (url && isValidUrl(url)) {
              console.log(`  Fixed character array link: ${url}`);
              fixedLinks.push({
                url: url,
                label: getLabelFromUrl(url)
              });
              foundBrokenLinks = true;
            }
          }
        }
      }
      
      // Update links if we found and fixed broken links
      if (foundBrokenLinks) {
        console.log(`  Replaced ${book.bookDetails.links.length} links with ${fixedLinks.length} fixed links`);
        book.bookDetails.links = fixedLinks;
        needsUpdate = true;
      }
      
      // Save the book if changes were made
      if (needsUpdate) {
        await book.save();
        console.log(`  Updated book: ${book.title}`);
        updatedCount++;
      } else {
        console.log(`  No changes needed for: ${book.title}`);
        noChangesCount++;
      }
    }
    
    console.log('\nFix complete.');
    console.log(`Updated ${updatedCount} books.`);
    console.log(`${noChangesCount} books needed no changes.`);
  } catch (error) {
    console.error('Error during fix:', error);
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

// Helper function to get a label from a URL
function getLabelFromUrl(url) {
  try {
    const hostname = new URL(url).hostname;
    
    if (hostname.includes('amazon')) return 'Amazon';
    if (hostname.includes('goodreads')) return 'Goodreads';
    if (hostname.includes('barnesandnoble')) return 'Barnes & Noble';
    
    return hostname.replace('www.', '');
  } catch (_) {
    return 'Visit Website';
  }
}

// Run the fix
fixBookDetailsStructure();
