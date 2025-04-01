/**
 * Migrate Video Channel Resources
 * 
 * This script updates existing video channel resources to match the new standardized schema:
 * 1. Converts videoChannelDetails.creator from string to array
 * 2. Standardizes links to use {url, label} format
 * 3. Sets up dateRange if possible
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

async function migrateVideoChannels() {
  try {
    console.log('Migrating video channel resources...');
    
    // Find all video channel resources
    const videoChannels = await Resource.find({ type: 'videoChannel' });
    console.log(`Found ${videoChannels.length} video channels to migrate`);
    
    if (videoChannels.length === 0) {
      console.log('No video channels found. Nothing to migrate.');
      return;
    }
    
    let creatorMigratedCount = 0;
    let linksMigratedCount = 0;
    let dateRangeAddedCount = 0;
    
    for (const channel of videoChannels) {
      console.log(`\nProcessing: ${channel.title}`);
      let needsUpdate = false;
      
      // 1. Migrate creator from string to array if needed
      if (channel.videoChannelDetails && 
          typeof channel.videoChannelDetails.creator === 'string' && 
          channel.videoChannelDetails.creator.trim() !== '') {
        
        const creatorString = channel.videoChannelDetails.creator;
        console.log(`  Converting creator from string "${creatorString}" to array`);
        
        // Convert to array
        channel.videoChannelDetails.creator = [creatorString];
        
        // Ensure top-level creator is also set
        if (!channel.creator || channel.creator.length === 0) {
          channel.creator = [creatorString];
        }
        
        creatorMigratedCount++;
        needsUpdate = true;
      }
      
      // 2. Standardize links to use {url, label} format
      if (channel.videoChannelDetails && 
          Array.isArray(channel.videoChannelDetails.links) && 
          channel.videoChannelDetails.links.length > 0) {
        
        const oldLinks = [...channel.videoChannelDetails.links];
        const newLinks = [];
        let linksChanged = false;
        
        for (const link of oldLinks) {
          // Check if the link is already in the correct format
          if (typeof link === 'string') {
            // Convert string URL to {url, label} format
            const label = getLabelFromUrl(link);
            newLinks.push({ url: link, label });
            linksChanged = true;
          } else if (typeof link === 'object' && link.url) {
            // Already in correct format or close to it
            if (!link.label) {
              link.label = getLabelFromUrl(link.url);
              linksChanged = true;
            }
            newLinks.push(link);
          }
        }
        
        if (linksChanged) {
          console.log(`  Standardized ${oldLinks.length} links to {url, label} format`);
          channel.videoChannelDetails.links = newLinks;
          linksMigratedCount++;
          needsUpdate = true;
        }
      }
      
      // 3. Set up dateRange if not present
      if (!channel.dateRange || (!channel.dateRange.start && !channel.dateRange.end)) {
        // For video channels, we'll set a default start date if we don't have one
        // This is just an estimate - in a real scenario, you might want to fetch this from YouTube API
        console.log(`  Adding default dateRange`);
        
        if (!channel.dateRange) channel.dateRange = {};
        
        // Set a default start date (e.g., 5 years ago) if we don't have better information
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
        
        channel.dateRange.start = fiveYearsAgo;
        channel.dateRange.active = true; // Assume the channel is still active
        
        dateRangeAddedCount++;
        needsUpdate = true;
      }
      
      // Save the channel if changes were made
      if (needsUpdate) {
        await channel.save();
        console.log(`  ✓ Updated video channel: ${channel.title}`);
      } else {
        console.log(`  ✓ No changes needed for: ${channel.title}`);
      }
    }
    
    console.log('\nMigration complete.');
    console.log(`Migrated creator field for ${creatorMigratedCount} channels.`);
    console.log(`Standardized links for ${linksMigratedCount} channels.`);
    console.log(`Added dateRange for ${dateRangeAddedCount} channels.`);
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Helper function to extract a label from a URL
function getLabelFromUrl(url) {
  try {
    // Try to extract domain name from URL
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Convert hostname to a readable label
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return 'YouTube';
    } else if (hostname.includes('vimeo.com')) {
      return 'Vimeo';
    } else {
      // Extract domain without TLD as a fallback
      const parts = hostname.split('.');
      if (parts.length >= 2) {
        // Get the main domain name (e.g., 'example' from 'www.example.com')
        const domainName = parts[parts.length - 2];
        return domainName.charAt(0).toUpperCase() + domainName.slice(1);
      } else {
        return hostname;
      }
    }
  } catch (e) {
    // If URL parsing fails, use a generic label
    return 'Website';
  }
}

// Run the migration
migrateVideoChannels();
