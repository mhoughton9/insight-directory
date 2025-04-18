/**
 * List Cloudinary Assets Script
 * 
 * This script will list all assets in your Cloudinary account,
 * organized by folder structure, to help understand what needs to be cleaned up.
 */

// Load environment variables from the root .env file
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const cloudinary = require('cloudinary').v2;

// Debug environment variables
console.log('Environment variables loaded:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'Found' : 'Not found');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Found' : 'Not found');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Found' : 'Not found');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to get all resources
async function getAllResources(nextCursor = null, allResources = []) {
  try {
    const options = { max_results: 500 };
    if (nextCursor) {
      options.next_cursor = nextCursor;
    }
    
    const result = await cloudinary.api.resources(options);
    
    // Add resources to our collection
    allResources = [...allResources, ...result.resources];
    
    // If there are more resources, get them recursively
    if (result.next_cursor) {
      return getAllResources(result.next_cursor, allResources);
    }
    
    return allResources;
  } catch (error) {
    console.error('Error getting resources:', error);
    return allResources; // Return what we have so far
  }
}

// Function to organize resources by folder
function organizeByFolder(resources) {
  const folderStructure = {};
  
  resources.forEach(resource => {
    const publicId = resource.public_id;
    const parts = publicId.split('/');
    
    // Handle root level assets (no folder)
    if (parts.length === 1) {
      if (!folderStructure['[ROOT]']) {
        folderStructure['[ROOT]'] = [];
      }
      folderStructure['[ROOT]'].push(resource);
      return;
    }
    
    // Get the folder path (everything except the last part)
    const folderPath = parts.slice(0, -1).join('/');
    
    if (!folderStructure[folderPath]) {
      folderStructure[folderPath] = [];
    }
    
    folderStructure[folderPath].push(resource);
  });
  
  return folderStructure;
}

// Main function
async function main() {
  try {
    console.log('\n==================================');
    console.log('CLOUDINARY ASSETS LISTING');
    console.log('==================================\n');
    
    console.log('Fetching all resources from Cloudinary...');
    const allResources = await getAllResources();
    
    if (allResources.length === 0) {
      console.log('No resources found in Cloudinary');
      return;
    }
    
    console.log(`\nFound ${allResources.length} total assets in Cloudinary\n`);
    
    // Organize resources by folder
    const folderStructure = organizeByFolder(allResources);
    
    // Display folder structure
    console.log('Assets by folder:');
    console.log('==================================');
    
    const folders = Object.keys(folderStructure).sort();
    
    folders.forEach(folder => {
      const assets = folderStructure[folder];
      console.log(`\n${folder} (${assets.length} assets):`);
      
      // List first 10 assets in each folder
      const displayLimit = Math.min(10, assets.length);
      for (let i = 0; i < displayLimit; i++) {
        const asset = assets[i];
        console.log(`  ${i + 1}. ${asset.public_id} (${asset.format}, ${Math.round(asset.bytes / 1024)}KB)`);
      }
      
      if (assets.length > displayLimit) {
        console.log(`  ... and ${assets.length - displayLimit} more assets`);
      }
    });
    
    console.log('\n==================================');
    console.log('FOLDER SUMMARY');
    console.log('==================================');
    folders.forEach(folder => {
      console.log(`${folder}: ${folderStructure[folder].length} assets`);
    });
    
  } catch (error) {
    console.error('Error listing Cloudinary assets:', error);
  }
}

// Run the script
main();
