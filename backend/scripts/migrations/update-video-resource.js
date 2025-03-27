/**
 * Script to update the video resource that had a validation error
 * Run with: node scripts/update-video-resource.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import the Resource model
const Resource = require('../models/resource');

// Import sample data generator
const { generateSampleSections } = require('./sample-description-sections');

async function updateVideoResource() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/awakening-resources');
    console.log('Connected to MongoDB');
    
    // Find the specific video resource
    const videoResource = await Resource.findOne({ title: 'Who Am I?' });
    
    if (!videoResource) {
      console.log('Video resource "Who Am I?" not found');
      return;
    }
    
    console.log('Found video resource:', videoResource.title);
    
    // Generate sample sections for video type
    const sampleSections = generateSampleSections('video_channel');
    
    // Update the resource with the sample sections
    videoResource.descriptionSections = sampleSections;
    await videoResource.save();
    
    console.log('Successfully updated video resource with description sections');
    
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
updateVideoResource();
