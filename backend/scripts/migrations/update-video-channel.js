/**
 * Script to update the Buddha at the Gas Pump resource with video channel sections
 * Run with: node scripts/update-video-channel.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import the Resource model
const Resource = require('../models/resource');

// Sample data for video channel
const videoChannelSections = {
  in_a_nutshell: "This video channel offers in-depth interviews with spiritually awakened individuals, providing insights into the awakening process through diverse perspectives and experiences.",
  style: "Conversational and accessible, with a focus on authentic sharing rather than theoretical concepts. Rick Archer creates a comfortable space for guests to share their unique journeys.",
  best_videos_to_start: [
    "Interviews with Rupert Spira on Non-Duality",
    "Conversations with Adyashanti on Awakening",
    "Discussions with Eckhart Tolle on Presence"
  ],
  unique_strength: "The channel provides access to a wide range of awakening experiences from people of various backgrounds, showing that spiritual awakening can happen to anyone, not just monks or lifelong practitioners.",
  most_common_criticism: "Some viewers find certain interviews too lengthy or meandering, and occasionally the technical quality varies depending on the guest's setup."
};

async function updateVideoChannel() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/awakening-resources');
    console.log('Connected to MongoDB');
    
    // Find Buddha at the Gas Pump resource
    const resource = await Resource.findOne({ title: 'Buddha at the Gas Pump' });
    
    if (!resource) {
      console.log('Resource "Buddha at the Gas Pump" not found');
      return;
    }
    
    console.log('Found resource:', resource.title);
    console.log('Current type:', resource.type);
    
    // Update the resource with video channel sections
    resource.descriptionSections = videoChannelSections;
    await resource.save();
    
    console.log('Successfully updated resource with video channel sections');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the function
updateVideoChannel();
