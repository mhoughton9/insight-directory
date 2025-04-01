/**
 * Migration Script: Add status field based on processed boolean
 * 
 * This script updates all resources to use the new status field
 * based on the value of the processed boolean field.
 * It does NOT change the processed field behavior to ensure compatibility.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB with hardcoded connection string for this one-time migration
const MONGODB_URI = 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function migrateStatusField() {
  try {
    console.log('Starting status field migration...');
    
    // Get all resources
    const resources = await Resource.find({});
    console.log(`Found ${resources.length} resources to process`);
    
    let updatedCount = 0;
    let alreadySetCount = 0;
    
    for (const resource of resources) {
      // Skip if status is already set and matches processed value
      if (resource.status) {
        const expectedStatus = resource.processed ? 'posted' : 'pending';
        if (resource.status === expectedStatus) {
          alreadySetCount++;
          continue;
        }
      }
      
      // Set status based on processed value WITHOUT changing processed
      const originalProcessed = resource.processed;
      resource.status = originalProcessed ? 'posted' : 'pending';
      
      // Use a direct update to avoid triggering middleware that might change processed
      await Resource.updateOne(
        { _id: resource._id },
        { status: resource.status }
      );
      
      updatedCount++;
      console.log(`Updated status for ${resource.title} to ${resource.status} (processed: ${originalProcessed})`);
    }
    
    console.log(`Migration complete.`);
    console.log(`Updated ${updatedCount} resources with new status field.`);
    console.log(`${alreadySetCount} resources already had correct status.`);
    console.log(`All processed field values remain unchanged to ensure compatibility.`);
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Run the migration
migrateStatusField();
