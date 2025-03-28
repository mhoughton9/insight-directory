/**
 * Script to check skipped resources in the database
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

// Check skipped resources
const checkSkippedResources = async () => {
  try {
    console.log('Checking skipped resources...');
    
    // Get all skipped resources
    const skippedResources = await Resource.find({ skipped: true }).lean();
    
    console.log(`Total skipped resources: ${skippedResources.length}`);
    
    if (skippedResources.length > 0) {
      console.log('\nSkipped resources:');
      skippedResources.forEach(resource => {
        console.log(`- ${resource.title} (${resource.type}) - ID: ${resource._id}`);
      });
    }
    
    // Check if there are any resources with the same type as a skipped resource
    if (skippedResources.length > 0) {
      const skippedTypes = [...new Set(skippedResources.map(r => r.type))];
      
      console.log('\nChecking for other resources of the same type:');
      
      for (const type of skippedTypes) {
        const unprocessedCount = await Resource.countDocuments({
          type,
          $or: [
            { processed: false },
            { processed: { $exists: false } }
          ],
          skipped: { $ne: true }
        });
        
        console.log(`- Type: ${type}, Unprocessed resources: ${unprocessedCount}`);
        
        if (unprocessedCount > 0) {
          const examples = await Resource.find({
            type,
            $or: [
              { processed: false },
              { processed: { $exists: false } }
            ],
            skipped: { $ne: true }
          }).limit(2).lean();
          
          console.log('  Examples:');
          examples.forEach(resource => {
            console.log(`  - ${resource.title} (${resource._id})`);
          });
        }
      }
    }
    
    // Check the query used in getNextUnprocessedResource
    console.log('\nTesting the query used in getNextUnprocessedResource:');
    
    const type = skippedResources.length > 0 ? skippedResources[0].type : null;
    
    const query = {
      $or: [
        { processed: false },
        { processed: { $exists: false } }
      ],
      skipped: { $ne: true }
    };
    
    if (type) {
      query.type = type;
      console.log(`Using type filter: ${type}`);
    }
    
    console.log('Query:', JSON.stringify(query, null, 2));
    
    const nextResource = await Resource.findOne(query).sort({ title: 1 }).lean();
    
    if (nextResource) {
      console.log('Next resource that would be returned:');
      console.log(`- ${nextResource.title} (${nextResource.type}) - ID: ${nextResource._id}`);
      console.log(`- Processed: ${nextResource.processed}, Skipped: ${nextResource.skipped}`);
    } else {
      console.log('No resources match the query');
    }
    
  } catch (error) {
    console.error('Error checking skipped resources:', error);
  }
};

// Run the script
const run = async () => {
  const conn = await connectDB();
  await checkSkippedResources();
  await mongoose.disconnect();
  console.log('Done');
};

run();
