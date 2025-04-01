/**
 * Clear Video Channel Links
 * 
 * This script clears the problematic links from the video channel resource.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function clearVideoChannelLinks() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find the video channel resource
    const videoChannel = await Resource.findOne({ type: 'videoChannel' });
    
    if (!videoChannel) {
      console.log('No video channel found.');
      return;
    }
    
    console.log(`Clearing links for: ${videoChannel.title}`);
    
    // Clear the links array
    if (videoChannel.videoChannelDetails) {
      videoChannel.videoChannelDetails.links = [];
      
      // Save the changes
      await videoChannel.save();
      console.log('Links cleared successfully.');
    } else {
      console.log('No videoChannelDetails found.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the script
clearVideoChannelLinks();
