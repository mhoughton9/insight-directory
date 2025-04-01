/**
 * Verify Video Channel Updates
 * 
 * This script verifies that the video channel resources have been properly updated
 * to match the new standardized schema.
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

async function verifyVideoChannelUpdates() {
  try {
    console.log('Verifying video channel updates...');
    
    // Find all video channel resources
    const videoChannels = await Resource.find({ type: 'videoChannel' });
    console.log(`Found ${videoChannels.length} video channels`);
    
    if (videoChannels.length === 0) {
      console.log('No video channels found. Nothing to verify.');
      return;
    }
    
    for (const channel of videoChannels) {
      console.log(`\nVideo Channel: ${channel.title}`);
      
      // Check creator fields
      console.log(`  Top-level creator: ${JSON.stringify(channel.creator)}`);
      console.log(`  videoChannelDetails.creator: ${JSON.stringify(channel.videoChannelDetails?.creator)}`);
      
      // Check if creator fields are in sync
      const topLevelCreator = JSON.stringify(channel.creator || []);
      const detailsCreator = JSON.stringify(channel.videoChannelDetails?.creator || []);
      
      if (topLevelCreator === detailsCreator) {
        console.log(`  u2713 Creator fields are in sync`);
      } else {
        console.log(`  u2717 Creator fields are not in sync`);
      }
      
      // Check title and channelName sync
      console.log(`  Title: ${channel.title}`);
      console.log(`  channelName: ${channel.videoChannelDetails?.channelName}`);
      
      if (channel.title === channel.videoChannelDetails?.channelName) {
        console.log(`  u2713 Title and channelName are in sync`);
      } else {
        console.log(`  u2717 Title and channelName are not in sync`);
      }
      
      // Check dateRange
      if (channel.dateRange && channel.dateRange.start) {
        console.log(`  dateRange.start: ${channel.dateRange.start.toISOString()}`);
        console.log(`  dateRange.active: ${channel.dateRange.active}`);
        console.log(`  u2713 dateRange is properly set`);
      } else {
        console.log(`  u2717 dateRange is not properly set`);
      }
      
      // Check links format
      if (channel.videoChannelDetails?.links && channel.videoChannelDetails.links.length > 0) {
        console.log(`  Links:`);
        let allLinksFormatted = true;
        
        for (const link of channel.videoChannelDetails.links) {
          if (typeof link === 'object' && link.url && link.label) {
            console.log(`    - ${link.label}: ${link.url}`);
          } else if (typeof link === 'object' && link.url) {
            console.log(`    - ${link.url} (missing label)`);
            allLinksFormatted = false;
          } else if (typeof link === 'string') {
            console.log(`    - ${link} (string format, not object)`);
            allLinksFormatted = false;
          } else {
            console.log(`    - Invalid link format: ${JSON.stringify(link)}`);
            allLinksFormatted = false;
          }
        }
        
        if (allLinksFormatted) {
          console.log(`  u2713 All links are in the correct {url, label} format`);
        } else {
          console.log(`  u2717 Some links are not in the correct format`);
        }
      } else {
        console.log(`  No links found`);
      }
      
      // Print the full document for inspection
      console.log('\nFull document:');
      console.log(JSON.stringify(channel.toObject(), null, 2));
    }
  } catch (error) {
    console.error('Error verifying video channel updates:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Run the verification
verifyVideoChannelUpdates();
