/**
 * Migrate Retreat Center Resources
 * 
 * This script updates existing retreat center resources to match the standardized schema:
 * 1. Converts string links to the standard {url, label} format
 * 2. Sets up dateRange for retreat centers
 * 3. Initializes creator array for consistency
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function migrateRetreatCenters() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all retreat center resources
    const retreatCenters = await Resource.find({ type: 'retreatCenter' });
    console.log(`Found ${retreatCenters.length} retreat centers to migrate`);
    
    if (retreatCenters.length === 0) {
      console.log('No retreat centers found. Nothing to migrate.');
      return;
    }
    
    let updatedCount = 0;
    
    for (const center of retreatCenters) {
      console.log(`\nProcessing: ${center.title}`);
      let modified = false;
      
      // 1. Initialize creator array if it doesn't exist
      if (!center.creator) {
        console.log(`  Initializing creator array`);
        center.creator = [];
        center.retreatCenterDetails.creator = [];
        console.log(`  u2713 Initialized empty creator array`);
        modified = true;
      }
      
      // 2. Standardize links format
      if (center.retreatCenterDetails && center.retreatCenterDetails.links) {
        const links = center.retreatCenterDetails.links;
        
        if (Array.isArray(links)) {
          const newLinks = [];
          let linksModified = false;
          
          for (const link of links) {
            if (typeof link === 'string') {
              console.log(`  Converting string link to object: ${link}`);
              newLinks.push({
                url: link,
                label: 'Website'
              });
              linksModified = true;
            } else if (typeof link === 'object' && link.url) {
              // Ensure the link has a label
              if (!link.label) {
                link.label = 'Website';
                linksModified = true;
              }
              newLinks.push(link);
            }
          }
          
          if (linksModified) {
            center.retreatCenterDetails.links = newLinks;
            console.log(`  u2713 Standardized links format`);
            modified = true;
          }
        }
      }
      
      // 3. Extract URL from top-level url field if it exists
      if (center.url && (!center.retreatCenterDetails.links || 
          !center.retreatCenterDetails.links.some(link => 
            (typeof link === 'object' && link.url === center.url) || 
            link === center.url
          ))) {
        console.log(`  Moving URL to links array: ${center.url}`);
        
        if (!center.retreatCenterDetails.links) {
          center.retreatCenterDetails.links = [];
        }
        
        center.retreatCenterDetails.links.push({
          url: center.url,
          label: 'Website'
        });
        
        console.log(`  u2713 Added URL to links array`);
        modified = true;
      }
      
      // 4. Set up dateRange if it doesn't exist
      if (!center.dateRange) {
        console.log(`  Setting up dateRange`);
        center.dateRange = { active: true };
        console.log(`  u2713 Added dateRange with active: true`);
        modified = true;
      }
      
      // Save changes if modified
      if (modified) {
        await center.save();
        console.log(`  u2713 Saved changes to ${center.title}`);
        updatedCount++;
      } else {
        console.log(`  No changes needed for ${center.title}`);
      }
    }
    
    console.log(`\nMigration complete. Updated ${updatedCount} of ${retreatCenters.length} retreat centers.`);
  } catch (error) {
    console.error('Error migrating retreat centers:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the migration
migrateRetreatCenters();
