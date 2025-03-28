/**
 * Script to fix skipped resources in the database
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Fix skipped resources
const fixSkippedResources = async () => {
  try {
    console.log('Starting fix: Ensuring skipped field is properly set...');
    
    // Find all resources where skipped is not defined
    const query = { skipped: { $exists: false } };
    
    const resources = await Resource.find(query);
    console.log(`Found ${resources.length} resources without skipped field`);
    
    if (resources.length === 0) {
      console.log('No resources to update. Fix complete!');
      return;
    }
    
    // Update all found resources to set skipped: false
    const updateResult = await Resource.updateMany(
      query,
      { $set: { skipped: false } }
    );
    
    console.log(`Successfully updated ${updateResult.modifiedCount} resources.`);
    
    // Reset any resources that might have been incorrectly marked as skipped
    // but are still showing up in the UI (edge case)
    const podcastToReset = await Resource.findOne({ type: 'podcast', title: /Awareness/i });
    if (podcastToReset) {
      console.log(`Resetting podcast: ${podcastToReset.title}`);
      podcastToReset.skipped = false;
      await podcastToReset.save();
    }
    
    console.log('Fix complete!');
  } catch (error) {
    console.error('Error fixing skipped resources:', error);
  }
};

// Run the script
const run = async () => {
  const conn = await connectDB();
  await fixSkippedResources();
  await mongoose.disconnect();
  console.log('Done');
};

run();
