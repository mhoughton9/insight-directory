/**
 * Migration Script: Standardize name fields
 * 
 * This script ensures all resources have their type-specific name fields
 * (podcastName, websiteName, etc.) in sync with the top-level title field.
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

async function migrateNameFields() {
  try {
    console.log('Starting name fields migration...');
    
    // Get all resources
    const resources = await Resource.find({});
    console.log(`Found ${resources.length} resources to process`);
    
    let updatedCount = 0;
    let alreadySetCount = 0;
    
    for (const resource of resources) {
      const type = resource.type;
      const title = resource.title;
      let needsUpdate = false;
      let updateData = {};
      
      // Check if type-specific name field needs updating
      switch (type) {
        case 'podcast':
          if (!resource.podcastDetails) {
            updateData['podcastDetails'] = { podcastName: title };
            needsUpdate = true;
          } else if (resource.podcastDetails.podcastName !== title) {
            updateData['podcastDetails.podcastName'] = title;
            needsUpdate = true;
          }
          break;
          
        case 'website':
          if (!resource.websiteDetails) {
            updateData['websiteDetails'] = { websiteName: title };
            needsUpdate = true;
          } else if (resource.websiteDetails.websiteName !== title) {
            updateData['websiteDetails.websiteName'] = title;
            needsUpdate = true;
          }
          break;
          
        case 'blog':
          if (!resource.blogDetails) {
            updateData['blogDetails'] = { name: title };
            needsUpdate = true;
          } else if (resource.blogDetails.name !== title) {
            updateData['blogDetails.name'] = title;
            needsUpdate = true;
          }
          break;
          
        case 'retreatCenter':
          if (!resource.retreatCenterDetails) {
            updateData['retreatCenterDetails'] = { name: title };
            needsUpdate = true;
          } else if (resource.retreatCenterDetails.name !== title) {
            updateData['retreatCenterDetails.name'] = title;
            needsUpdate = true;
          }
          break;
          
        case 'practice':
          if (!resource.practiceDetails) {
            updateData['practiceDetails'] = { name: title };
            needsUpdate = true;
          } else if (resource.practiceDetails.name !== title) {
            updateData['practiceDetails.name'] = title;
            needsUpdate = true;
          }
          break;
          
        case 'app':
          if (!resource.appDetails) {
            updateData['appDetails'] = { appName: title };
            needsUpdate = true;
          } else if (resource.appDetails.appName !== title) {
            updateData['appDetails.appName'] = title;
            needsUpdate = true;
          }
          break;
      }
      
      // Update the resource if needed
      if (needsUpdate) {
        await Resource.updateOne({ _id: resource._id }, { $set: updateData });
        updatedCount++;
        console.log(`Updated name fields for ${resource.title} (${resource.type})`);
      } else {
        alreadySetCount++;
      }
    }
    
    console.log(`Migration complete.`);
    console.log(`Updated ${updatedCount} resources with standardized name fields.`);
    console.log(`${alreadySetCount} resources already had correct name fields.`);
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Run the migration
migrateNameFields();
