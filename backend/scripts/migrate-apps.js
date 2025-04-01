/**
 * Migrate App Resources
 * 
 * This script updates existing app resources to match the standardized schema:
 * 1. Converts appDetails.creator from string to array
 * 2. Sets up dateRange for apps
 * 3. Ensures links array is properly structured
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function migrateApps() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all app resources
    const apps = await Resource.find({ type: 'app' });
    console.log(`Found ${apps.length} apps to migrate`);
    
    if (apps.length === 0) {
      console.log('No apps found. Nothing to migrate.');
      return;
    }
    
    let updatedCount = 0;
    
    for (const app of apps) {
      console.log(`\nProcessing: ${app.title}`);
      let modified = false;
      
      // 1. Handle creator field conversion
      if (app.appDetails && typeof app.appDetails.creator === 'string') {
        const creatorString = app.appDetails.creator;
        console.log(`  Converting creator string to array: "${creatorString}"`);
        
        // Convert string to array
        app.appDetails.creator = creatorString ? [creatorString] : [];
        app.creator = [...app.appDetails.creator];
        
        console.log(`  ✓ Creator converted to: ${JSON.stringify(app.appDetails.creator)}`);
        modified = true;
      } else if (!app.appDetails.creator) {
        // Initialize creator array if it doesn't exist
        app.appDetails.creator = [];
        app.creator = [];
        console.log(`  ✓ Initialized empty creator array`);
        modified = true;
      }
      
      // 2. Set up dateRange if it doesn't exist
      if (!app.dateRange) {
        console.log(`  Setting up dateRange`);
        app.dateRange = { active: true };
        console.log(`  ✓ Added dateRange with active: true`);
        modified = true;
      }
      
      // 3. Initialize links array if it doesn't exist
      if (!app.appDetails.links) {
        console.log(`  Initializing links array`);
        app.appDetails.links = [];
        console.log(`  ✓ Initialized empty links array`);
        modified = true;
      }
      
      // 4. Extract URL from top-level url field if it exists
      if (app.url && !app.appDetails.links.some(link => link.url === app.url)) {
        console.log(`  Moving URL to links array: ${app.url}`);
        app.appDetails.links.push({
          url: app.url,
          label: 'Website'
        });
        console.log(`  ✓ Added URL to links array`);
        modified = true;
      }
      
      // 5. Ensure teachers is an array
      if (app.appDetails.teachers && !Array.isArray(app.appDetails.teachers)) {
        console.log(`  Converting teachers to array`);
        app.appDetails.teachers = app.appDetails.teachers ? [app.appDetails.teachers] : [];
        console.log(`  ✓ Teachers converted to array`);
        modified = true;
      } else if (!app.appDetails.teachers) {
        console.log(`  Initializing teachers array`);
        app.appDetails.teachers = [];
        console.log(`  ✓ Initialized empty teachers array`);
        modified = true;
      }
      
      // Save changes if modified
      if (modified) {
        await app.save();
        console.log(`  ✓ Saved changes to ${app.title}`);
        updatedCount++;
      } else {
        console.log(`  No changes needed for ${app.title}`);
      }
    }
    
    console.log(`\nMigration complete. Updated ${updatedCount} of ${apps.length} apps.`);
  } catch (error) {
    console.error('Error migrating apps:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the migration
migrateApps();
