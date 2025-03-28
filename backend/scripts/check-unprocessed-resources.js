/**
 * Script to check unprocessed resources in the database
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

// Check unprocessed resources
const checkUnprocessedResources = async () => {
  try {
    console.log('Checking unprocessed resources...');
    
    // Get total count of unprocessed resources
    const totalUnprocessed = await Resource.countDocuments({ 
      processed: false,
      skipped: { $ne: true }
    });
    
    console.log(`Total unprocessed resources: ${totalUnprocessed}`);
    
    // Get counts by type
    const typeCounts = await Resource.aggregate([
      { $match: { processed: false, skipped: { $ne: true } } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('Unprocessed resources by type:');
    console.table(typeCounts);
    
    // Get total count of all resources
    const totalResources = await Resource.countDocuments({});
    const processedResources = await Resource.countDocuments({ processed: true });
    
    console.log(`Total resources: ${totalResources}`);
    console.log(`Processed resources: ${processedResources}`);
    console.log(`Unprocessed resources: ${totalResources - processedResources}`);
    
    // Check if there are any resources with type other than 'book'
    const nonBookResources = await Resource.find({ type: { $ne: 'book' } }).lean();
    
    console.log(`\nNon-book resources: ${nonBookResources.length}`);
    if (nonBookResources.length > 0) {
      console.log('Sample non-book resources:');
      nonBookResources.slice(0, 3).forEach(resource => {
        console.log(`- ${resource.title} (${resource.type}) - Processed: ${resource.processed}`);
      });
    }
  } catch (error) {
    console.error('Error checking unprocessed resources:', error);
  }
};

// Run the script
const run = async () => {
  const conn = await connectDB();
  await checkUnprocessedResources();
  await mongoose.disconnect();
  console.log('Done');
};

run();
