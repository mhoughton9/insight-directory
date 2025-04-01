/**
 * Examine Video Channel Resources
 * 
 * This script examines video channel resources to understand their current structure
 * and identify standardization opportunities.
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

async function examineVideoChannels() {
  try {
    // Wait for connection to be established
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Examining video channel resources...');
    
    // Get the raw collection
    const db = mongoose.connection.db;
    const resourcesCollection = db.collection('resources');
    
    // Find all video channel resources
    const videoChannels = await resourcesCollection.find({ type: 'videoChannel' }).toArray();
    console.log(`Found ${videoChannels.length} video channels in the database`);
    
    if (videoChannels.length === 0) {
      console.log('No video channels found. Nothing to examine.');
      return;
    }
    
    // Analyze the structure of video channels
    console.log('\nAnalyzing video channel structure:');
    
    // Check for key fields
    let creatorCount = 0;
    let channelNameCount = 0;
    let videoChannelCreatorCount = 0;
    let publishedDateCount = 0;
    let dateRangeCount = 0;
    
    for (const channel of videoChannels) {
      console.log(`\nVideo Channel: ${channel.title}`);
      
      // Check top-level fields
      console.log(`  Top-level creator: ${channel.creator ? (Array.isArray(channel.creator) ? channel.creator.join(', ') : channel.creator) : 'Not set'}`);
      console.log(`  publishedDate: ${channel.publishedDate || 'Not set'}`);
      console.log(`  dateRange: ${channel.dateRange ? JSON.stringify(channel.dateRange) : 'Not set'}`);
      
      // Check videoChannelDetails fields
      console.log(`  videoChannelDetails.channelName: ${channel.videoChannelDetails?.channelName || 'Not set'}`);
      console.log(`  videoChannelDetails.creator: ${channel.videoChannelDetails?.creator || 'Not set'}`);
      
      // Count occurrences of fields
      if (channel.creator && (Array.isArray(channel.creator) ? channel.creator.length > 0 : true)) creatorCount++;
      if (channel.videoChannelDetails?.channelName) channelNameCount++;
      if (channel.videoChannelDetails?.creator) videoChannelCreatorCount++;
      if (channel.publishedDate) publishedDateCount++;
      if (channel.dateRange && (channel.dateRange.start || channel.dateRange.end)) dateRangeCount++;
      
      // Print all fields for the first few channels
      if (videoChannels.indexOf(channel) < 2) {
        console.log('  All fields:');
        console.log(JSON.stringify(channel, null, 2).split('\n').map(line => `    ${line}`).join('\n'));
      }
    }
    
    console.log('\nSummary:');
    console.log(`Total video channels: ${videoChannels.length}`);
    console.log(`Channels with top-level creator: ${creatorCount}`);
    console.log(`Channels with channelName: ${channelNameCount}`);
    console.log(`Channels with videoChannelDetails.creator: ${videoChannelCreatorCount}`);
    console.log(`Channels with publishedDate: ${publishedDateCount}`);
    console.log(`Channels with dateRange: ${dateRangeCount}`);
    
    // Identify standardization opportunities
    console.log('\nStandardization Opportunities:');
    
    if (channelNameCount > 0 && channelNameCount < videoChannels.length) {
      console.log('- Need to ensure all video channels have channelName synchronized with title');
    }
    
    if (videoChannelCreatorCount > 0 && creatorCount !== videoChannelCreatorCount) {
      console.log('- Need to synchronize top-level creator with videoChannelDetails.creator');
    }
    
    if (publishedDateCount === 0 && dateRangeCount === 0) {
      console.log('- Consider adding date information to video channels');
    }
  } catch (error) {
    console.error('Error examining video channels:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Run the examination
examineVideoChannels();
