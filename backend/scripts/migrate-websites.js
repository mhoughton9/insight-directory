/**
 * Migrate Website Resources
 * 
 * This script updates existing website resources to match the standardized schema:
 * 1. Converts websiteDetails.creator from string to array
 * 2. Moves websiteDetails.link to websiteDetails.links array
 * 3. Sets up dateRange for websites
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

// Helper function to split creator string into array
function splitCreatorString(creatorString) {
  if (!creatorString) return [];
  
  // Split by common separators (and, &, comma)
  return creatorString
    .split(/(?:,\s*|\s+and\s+|\s*&\s*)/)
    .map(name => name.trim())
    .filter(name => name.length > 0);
}

async function migrateWebsites() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all website resources
    const websites = await Resource.find({ type: 'website' });
    console.log(`Found ${websites.length} websites to migrate`);
    
    if (websites.length === 0) {
      console.log('No websites found. Nothing to migrate.');
      return;
    }
    
    let updatedCount = 0;
    
    for (const website of websites) {
      console.log(`\nProcessing: ${website.title}`);
      let modified = false;
      
      // 1. Handle creator field conversion
      if (website.websiteDetails && typeof website.websiteDetails.creator === 'string') {
        const creatorString = website.websiteDetails.creator;
        console.log(`  Converting creator string to array: "${creatorString}"`);
        
        const creatorArray = splitCreatorString(creatorString);
        website.websiteDetails.creator = creatorArray;
        website.creator = creatorArray;
        
        console.log(`  u2713 Creator converted to: ${JSON.stringify(creatorArray)}`);
        modified = true;
      }
      
      // 2. Handle link field migration
      if (website.websiteDetails && website.websiteDetails.link) {
        const link = website.websiteDetails.link;
        console.log(`  Moving link to links array: ${link}`);
        
        // Initialize links array if it doesn't exist
        if (!website.websiteDetails.links) {
          website.websiteDetails.links = [];
        }
        
        // Check if the link already exists in the links array
        const linkExists = website.websiteDetails.links.some(l => l.url === link);
        
        if (!linkExists) {
          website.websiteDetails.links.push({
            url: link,
            label: 'Website'
          });
          console.log(`  u2713 Added link to links array`);
          modified = true;
        } else {
          console.log(`  Link already exists in links array`);
        }
      }
      
      // 3. Set up dateRange if it doesn't exist
      if (!website.dateRange) {
        console.log(`  Setting up dateRange`);
        website.dateRange = { active: true };
        console.log(`  u2713 Added dateRange with active: true`);
        modified = true;
      }
      
      // Save changes if modified
      if (modified) {
        await website.save();
        console.log(`  u2713 Saved changes to ${website.title}`);
        updatedCount++;
      } else {
        console.log(`  No changes needed for ${website.title}`);
      }
    }
    
    console.log(`\nMigration complete. Updated ${updatedCount} of ${websites.length} websites.`);
  } catch (error) {
    console.error('Error migrating websites:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the migration
migrateWebsites();
