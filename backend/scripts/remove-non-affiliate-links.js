/**
 * Remove Non-Affiliate Links
 * 
 * This script removes all non-affiliate links from book resources,
 * keeping only the Amazon affiliate links.
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

async function removeNonAffiliateLinks() {
  try {
    console.log('Starting to remove non-affiliate links...');
    
    // Get all book resources
    const books = await Resource.find({ type: 'book' });
    console.log(`Found ${books.length} books to process`);
    
    let updatedCount = 0;
    let noChangesCount = 0;
    let totalLinksRemoved = 0;
    
    for (const book of books) {
      console.log(`\nProcessing: ${book.title}`);
      
      // Skip if no bookDetails or links
      if (!book.bookDetails || !book.bookDetails.links || !Array.isArray(book.bookDetails.links)) {
        console.log('  No links found or invalid links array');
        noChangesCount++;
        continue;
      }
      
      const originalLinksCount = book.bookDetails.links.length;
      
      // Filter links to keep only Amazon affiliate links
      const affiliateLinks = book.bookDetails.links.filter(link => {
        // Skip null or undefined links
        if (!link) return false;
        
        // Get the URL from the link
        let url = '';
        if (link.url) {
          url = link.url;
        } else if (typeof link === 'object') {
          // Handle character array links
          const keys = Object.keys(link).filter(key => !isNaN(parseInt(key)));
          if (keys.length > 0) {
            keys.sort((a, b) => parseInt(a) - parseInt(b));
            for (const key of keys) {
              if (link[key] === undefined) break;
              url += link[key];
            }
          }
        }
        
        // Check if it's an Amazon affiliate link
        const isAmazonAffiliateLink = url.includes('amazon.com') && 
                                     (url.includes('tag=') || url.includes('?tag=') || url.includes('&tag='));
        
        if (!isAmazonAffiliateLink && url) {
          console.log(`  Removing non-affiliate link: ${url}`);
        }
        
        return isAmazonAffiliateLink;
      });
      
      const linksRemoved = originalLinksCount - affiliateLinks.length;
      totalLinksRemoved += linksRemoved;
      
      // Update the book if links were removed
      if (linksRemoved > 0) {
        book.bookDetails.links = affiliateLinks;
        await book.save();
        console.log(`  Removed ${linksRemoved} non-affiliate links from ${book.title}`);
        updatedCount++;
      } else {
        console.log(`  No non-affiliate links found in ${book.title}`);
        noChangesCount++;
      }
    }
    
    console.log('\nRemoval complete.');
    console.log(`Updated ${updatedCount} books.`);
    console.log(`Removed a total of ${totalLinksRemoved} non-affiliate links.`);
    console.log(`${noChangesCount} books had no non-affiliate links.`);
  } catch (error) {
    console.error('Error during removal:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Run the removal
removeNonAffiliateLinks();
