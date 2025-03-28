/**
 * Script to check the status of resources in the database
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

// Check resource status
const checkResourceStatus = async () => {
  try {
    console.log('Checking resource status...');
    
    // Get all resources
    const resources = await Resource.find({}).lean();
    console.log(`Total resources: ${resources.length}`);
    
    // Count by status
    const processed = resources.filter(r => r.processed === true).length;
    const unprocessed = resources.filter(r => r.processed === false).length;
    const undefinedProcessed = resources.filter(r => r.processed === undefined).length;
    const skipped = resources.filter(r => r.skipped === true).length;
    
    console.log(`Processed: ${processed}`);
    console.log(`Unprocessed: ${unprocessed}`);
    console.log(`Undefined processed: ${undefinedProcessed}`);
    console.log(`Skipped: ${skipped}`);
    
    // Check if any skipped resources are also marked as processed
    const skippedAndProcessed = resources.filter(r => r.skipped === true && r.processed === true).length;
    console.log(`Skipped AND processed: ${skippedAndProcessed}`);
    
    if (skippedAndProcessed > 0) {
      console.log('\nResources that are both skipped AND processed:');
      resources
        .filter(r => r.skipped === true && r.processed === true)
        .forEach(r => {
          console.log(`- ${r.title} (${r.type}) - ID: ${r._id}`);
        });
    }
    
    // Check resources by type
    console.log('\nResource counts by type:');
    const types = [...new Set(resources.map(r => r.type))];
    
    for (const type of types) {
      const typeResources = resources.filter(r => r.type === type);
      const typeProcessed = typeResources.filter(r => r.processed === true).length;
      const typeSkipped = typeResources.filter(r => r.skipped === true).length;
      const typeUnprocessed = typeResources.filter(r => r.processed === false || r.processed === undefined).length - typeSkipped;
      
      console.log(`${type}: Total=${typeResources.length}, Processed=${typeProcessed}, Skipped=${typeSkipped}, Unprocessed=${typeUnprocessed}`);
    }
    
  } catch (error) {
    console.error('Error checking resource status:', error);
  }
};

// Run the script
const run = async () => {
  const conn = await connectDB();
  await checkResourceStatus();
  await mongoose.disconnect();
  console.log('Done');
};

run();
