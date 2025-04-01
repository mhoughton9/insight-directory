/**
 * Examine App Resources
 * 
 * This script examines app resources to understand their current structure
 * and identify standardization opportunities.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function examineApps() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    console.log('Examining app resources...');
    
    // Find all app resources
    const apps = await Resource.find({ type: 'app' }).lean();
    console.log(`Found ${apps.length} apps in the database`);
    
    if (apps.length === 0) {
      console.log('No apps found. Nothing to examine.');
      return;
    }
    
    // Analyze the structure of apps
    console.log('\nAnalyzing app structure:');
    
    // Check for key fields
    let creatorCount = 0;
    let appNameCount = 0;
    let appDeveloperCount = 0;
    let publishedDateCount = 0;
    let dateRangeCount = 0;
    
    for (const app of apps) {
      console.log(`\nApp: ${app.title}`);
      
      // Check top-level fields
      console.log(`  Top-level creator: ${app.creator ? (Array.isArray(app.creator) ? app.creator.join(', ') : app.creator) : 'Not set'}`);
      console.log(`  publishedDate: ${app.publishedDate || 'Not set'}`);
      console.log(`  dateRange: ${app.dateRange ? JSON.stringify(app.dateRange) : 'Not set'}`);
      
      // Check appDetails fields
      console.log(`  appDetails.appName: ${app.appDetails?.appName || 'Not set'}`);
      console.log(`  appDetails.developer: ${app.appDetails?.developer ? (Array.isArray(app.appDetails.developer) ? app.appDetails.developer.join(', ') : app.appDetails.developer) : 'Not set'}`);
      console.log(`  appDetails.platforms: ${app.appDetails?.platforms ? app.appDetails.platforms.join(', ') : 'Not set'}`);
      console.log(`  appDetails.features: ${app.appDetails?.features ? app.appDetails.features.join(', ') : 'Not set'}`);
      console.log(`  appDetails.teachers: ${app.appDetails?.teachers ? app.appDetails.teachers.join(', ') : 'Not set'}`);
      
      // Check links format
      if (app.appDetails?.links && app.appDetails.links.length > 0) {
        console.log(`  Links:`);
        for (const link of app.appDetails.links) {
          if (typeof link === 'object' && link.url && link.label) {
            console.log(`    - ${link.label}: ${link.url}`);
          } else if (typeof link === 'object' && link.url) {
            console.log(`    - ${link.url} (missing label)`);
          } else if (typeof link === 'string') {
            console.log(`    - ${link} (string format, not object)`);
          } else {
            console.log(`    - Invalid link format: ${JSON.stringify(link)}`);
          }
        }
      } else {
        console.log(`  No links found`);
      }
      
      // Count occurrences of fields
      if (app.creator && (Array.isArray(app.creator) ? app.creator.length > 0 : true)) creatorCount++;
      if (app.appDetails?.appName) appNameCount++;
      if (app.appDetails?.developer) appDeveloperCount++;
      if (app.publishedDate) publishedDateCount++;
      if (app.dateRange && (app.dateRange.start || app.dateRange.end)) dateRangeCount++;
      
      // Print all fields for the first few apps
      if (apps.indexOf(app) < 2) {
        console.log('  All fields:');
        console.log(JSON.stringify(app, null, 2).split('\n').map(line => `    ${line}`).join('\n'));
      }
    }
    
    console.log('\nSummary:');
    console.log(`Total apps: ${apps.length}`);
    console.log(`Apps with top-level creator: ${creatorCount}`);
    console.log(`Apps with appName: ${appNameCount}`);
    console.log(`Apps with appDetails.developer: ${appDeveloperCount}`);
    console.log(`Apps with publishedDate: ${publishedDateCount}`);
    console.log(`Apps with dateRange: ${dateRangeCount}`);
    
    // Identify standardization opportunities
    console.log('\nStandardization Opportunities:');
    
    if (appNameCount > 0 && appNameCount < apps.length) {
      console.log('- Need to ensure all apps have appName synchronized with title');
    }
    
    if (appDeveloperCount > 0 && creatorCount !== appDeveloperCount) {
      console.log('- Need to synchronize top-level creator with appDetails.developer');
    }
    
    if (publishedDateCount === 0 && dateRangeCount === 0) {
      console.log('- Consider adding date information to apps');
    }
    
    // Check for non-standard links
    let nonStandardLinksCount = 0;
    for (const app of apps) {
      if (app.appDetails?.links && app.appDetails.links.length > 0) {
        for (const link of app.appDetails.links) {
          if (typeof link === 'string' || (typeof link === 'object' && (!link.url || !link.label))) {
            nonStandardLinksCount++;
            break;
          }
        }
      }
    }
    
    if (nonStandardLinksCount > 0) {
      console.log(`- Need to standardize links format for ${nonStandardLinksCount} apps`);
    }
    
    // Check if appDetails.developer is an array
    let stringDeveloperCount = 0;
    for (const app of apps) {
      if (app.appDetails?.developer && !Array.isArray(app.appDetails.developer)) {
        stringDeveloperCount++;
      }
    }
    
    if (stringDeveloperCount > 0) {
      console.log(`- Need to convert appDetails.developer from string to array for ${stringDeveloperCount} apps`);
    }
  } catch (error) {
    console.error('Error examining apps:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the examination
examineApps();
