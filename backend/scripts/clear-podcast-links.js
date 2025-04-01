/**
 * Clear Podcast Links
 * 
 * This script clears any non-standard links from podcast resources.
 * As requested, we'll delete links that aren't in the {url, label} format
 * rather than trying to transform them.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function clearPodcastLinks() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all podcast resources
    const podcasts = await Resource.find({ type: 'podcast' });
    console.log(`Found ${podcasts.length} podcasts`);
    
    if (podcasts.length === 0) {
      console.log('No podcasts found. Nothing to clear.');
      return;
    }
    
    for (const podcast of podcasts) {
      console.log(`\nProcessing: ${podcast.title}`);
      
      // Check if links exist and need clearing
      if (podcast.podcastDetails && 
          Array.isArray(podcast.podcastDetails.links) && 
          podcast.podcastDetails.links.length > 0) {
        
        const links = podcast.podcastDetails.links;
        console.log(`  Found ${links.length} links`);
        
        // Check if any links are not in the {url, label} format
        const nonStandardLinks = links.filter(link => 
          typeof link === 'string' || 
          (typeof link === 'object' && (!link.url || !link.label))
        );
        
        if (nonStandardLinks.length > 0) {
          console.log(`  Found ${nonStandardLinks.length} non-standard links to clear`);
          
          // Clear all links as requested
          podcast.podcastDetails.links = [];
          await podcast.save();
          
          console.log(`  ✓ Cleared all links for ${podcast.title}`);
        } else {
          console.log(`  All links are in the standard format. No changes needed.`);
        }
      } else {
        console.log(`  No links found.`);
      }
    }
    
    console.log('\nLink clearing complete.');
  } catch (error) {
    console.error('Error clearing podcast links:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the script
clearPodcastLinks();
