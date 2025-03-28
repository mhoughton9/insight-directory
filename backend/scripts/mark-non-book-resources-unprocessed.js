/**
 * Script to mark all non-book resources as unprocessed
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

// Mark non-book resources as unprocessed
const markNonBookResourcesUnprocessed = async () => {
  try {
    console.log('Starting migration: Marking non-book resources as unprocessed...');
    
    // Find all resources where type is not 'book' and processed is undefined
    const query = {
      type: { $ne: 'book' },
      processed: { $exists: false }
    };
    
    const resources = await Resource.find(query);
    console.log(`Found ${resources.length} non-book resources to update`);
    
    if (resources.length === 0) {
      console.log('No resources to update. Migration complete!');
      return;
    }
    
    // Update all found resources to set processed: false
    const updateResult = await Resource.updateMany(
      query,
      { $set: { processed: false } }
    );
    
    console.log(`Successfully updated ${updateResult.modifiedCount} resources.`);
    console.log('Migration complete!');
  } catch (error) {
    console.error('Error marking non-book resources as unprocessed:', error);
  }
};

// Run the script
const run = async () => {
  const conn = await connectDB();
  await markNonBookResourcesUnprocessed();
  await mongoose.disconnect();
};

run();
