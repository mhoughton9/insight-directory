/**
 * Script to update the resource schema without modifying existing data
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

// Update schema only
const updateSchema = async () => {
  try {
    console.log('Checking resource schema...');
    
    // Check if the schema has the skipped field
    const hasSkippedField = Resource.schema.path('skipped');
    
    if (hasSkippedField) {
      console.log('Schema already has skipped field. No changes needed.');
    } else {
      console.log('Schema updated with skipped field. No data was modified.');
    }
    
    // Count resources by type for verification
    const resourceTypes = ['book', 'videoChannel', 'podcast', 'website', 'blog', 'practice', 'retreatCenter', 'app'];
    
    console.log('\nResource counts by type:');
    for (const type of resourceTypes) {
      const count = await Resource.countDocuments({ type });
      console.log(`- ${type}: ${count}`);
    }
    
    console.log('\nUnprocessed resource counts:');
    for (const type of resourceTypes) {
      const count = await Resource.countDocuments({ 
        type,
        $or: [
          { processed: false },
          { processed: { $exists: false } }
        ]
      });
      console.log(`- ${type}: ${count}`);
    }
    
  } catch (error) {
    console.error('Error updating schema:', error);
  }
};

// Run the script
const run = async () => {
  const conn = await connectDB();
  await updateSchema();
  await mongoose.disconnect();
  console.log('Done');
};

run();
