/**
 * Migration Script: Standardize creator fields
 * 
 * This script migrates resources to use the standardized top-level creator field
 * by copying values from type-specific creator fields (author, hosts, etc.)
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

async function migrateCreators() {
  try {
    console.log('Starting creator field migration...');
    
    // Get all resources
    const resources = await Resource.find({});
    console.log(`Found ${resources.length} resources to process`);
    
    let updatedCount = 0;
    
    for (const resource of resources) {
      // Skip if creator field is already populated
      if (resource.creator && Array.isArray(resource.creator) && resource.creator.length > 0) {
        console.log(`Resource ${resource.title} already has creator field populated. Skipping.`);
        continue;
      }
      
      let creators = [];
      const type = resource.type;
      
      // Extract creator information based on resource type
      switch (type) {
        case 'book':
          if (resource.bookDetails?.author) {
            creators = Array.isArray(resource.bookDetails.author) 
              ? resource.bookDetails.author 
              : [resource.bookDetails.author];
          }
          break;
          
        case 'podcast':
          if (resource.podcastDetails?.hosts) {
            creators = Array.isArray(resource.podcastDetails.hosts) 
              ? resource.podcastDetails.hosts 
              : [resource.podcastDetails.hosts];
          }
          break;
          
        case 'videoChannel':
          if (resource.videoChannelDetails?.creator) {
            creators = [resource.videoChannelDetails.creator];
          }
          break;
          
        case 'website':
          if (resource.websiteDetails?.creator) {
            creators = [resource.websiteDetails.creator];
          }
          break;
          
        case 'blog':
          if (resource.blogDetails?.author) {
            creators = [resource.blogDetails.author];
          }
          break;
          
        case 'practice':
          if (resource.practiceDetails?.source) {
            creators = [resource.practiceDetails.source];
          }
          break;
          
        case 'app':
          if (resource.appDetails?.creator) {
            creators = [resource.appDetails.creator];
          }
          break;
          
        case 'retreatCenter':
          // Retreat centers might not have a specific creator field
          break;
          
        default:
          console.log(`Unknown resource type: ${type} for resource ${resource.title}`);
      }
      
      // Update the resource if creators were found
      if (creators.length > 0) {
        resource.creator = creators;
        await resource.save();
        updatedCount++;
        console.log(`Updated creator for ${resource.title} (${resource.type}): ${creators.join(', ')}`);
      } else {
        console.log(`No creator information found for ${resource.title} (${resource.type})`);
      }
    }
    
    console.log(`Migration complete. Updated ${updatedCount} resources.`);
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Run the migration
migrateCreators();
