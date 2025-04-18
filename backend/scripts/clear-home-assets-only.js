/**
 * Clear Assets in Home Folder Only Script
 * 
 * This script will delete ONLY the assets directly in the Home folder,
 * preserving all subfolders and their contents.
 * 
 * IMPORTANT: This is a destructive operation and cannot be undone.
 * Make sure you have backups if needed before running this script.
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

// Function to get assets directly in the Home folder
async function getHomeAssets(nextCursor = null, homeAssets = []) {
  try {
    // Get resources in the Home folder
    const options = { 
      type: 'upload',
      prefix: 'Home/',
      max_results: 500
    };
    
    if (nextCursor) {
      options.next_cursor = nextCursor;
    }
    
    const result = await cloudinary.api.resources(options);
    
    // Filter to only include assets directly in the Home folder (not in subfolders)
    const directHomeAssets = result.resources.filter(resource => {
      // Remove the 'Home/' prefix to get the relative path
      const relativePath = resource.public_id.substring('Home/'.length);
      // If there's no '/' in the relative path, it's directly in the Home folder
      return !relativePath.includes('/');
    });
    
    // Add filtered resources to our collection
    homeAssets = [...homeAssets, ...directHomeAssets];
    
    // If there are more resources, get them recursively
    if (result.next_cursor) {
      return getHomeAssets(result.next_cursor, homeAssets);
    }
    
    return homeAssets;
  } catch (error) {
    console.error('Error getting Home assets:', error);
    return homeAssets; // Return what we have so far
  }
}

// Function to delete resources in batches
async function deleteResourcesInBatches(resources) {
  try {
    // Process in batches of 100
    const batchSize = 100;
    const totalResources = resources.length;
    let deletedCount = 0;
    
    console.log(`Found ${totalResources} assets directly in the Home folder to delete`);
    
    // List the assets that will be deleted
    console.log('\nAssets to be deleted:');
    resources.forEach((resource, index) => {
      console.log(`${index + 1}. ${resource.public_id} (${resource.format}, ${Math.round(resource.bytes / 1024)}KB)`);
    });
    console.log('');
    
    if (totalResources === 0) {
      console.log('No assets to delete directly in the Home folder');
      return true;
    }
    
    for (let i = 0; i < totalResources; i += batchSize) {
      const batch = resources.slice(i, i + batchSize);
      const publicIds = batch.map(resource => resource.public_id);
      
      console.log(`Deleting batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(totalResources/batchSize)}...`);
      
      await cloudinary.api.delete_resources(publicIds);
      
      deletedCount += batch.length;
      console.log(`Progress: ${deletedCount}/${totalResources} assets deleted`);
    }
    
    console.log('All assets directly in the Home folder deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting resources:', error);
    return false;
  }
}

// Clear assets directly in the Home folder
const clearHomeAssets = async () => {
  try {
    console.log('\n=== Clearing Assets Directly in Home Folder ===');
    
    // Get assets directly in the Home folder
    console.log('Fetching assets directly in the Home folder...');
    const homeAssets = await getHomeAssets();
    
    // Delete the assets
    const success = await deleteResourcesInBatches(homeAssets);
    
    return success;
  } catch (error) {
    console.error('Error clearing Home assets:', error);
    return false;
  }
};

// Main function
const main = async () => {
  try {
    console.log('\n==================================');
    console.log('HOME FOLDER ASSETS CLEANUP');
    console.log('==================================');
    console.log('WARNING: This will delete all assets directly in the Home folder,');
    console.log('but preserve all subfolders and their contents.');
    console.log('This operation cannot be undone.');
    console.log('==================================\n');
    
    // Ask for confirmation
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('Are you sure you want to proceed? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        console.log('\nProceeding with Home folder assets cleanup...');
        
        // Clear assets directly in the Home folder
        const success = await clearHomeAssets();
        
        if (success) {
          console.log('\n✅ Home folder assets cleanup completed successfully!');
        } else {
          console.log('\n⚠️ Cleanup completed with errors. Please check the logs above.');
        }
      } else {
        console.log('\nOperation cancelled. No changes were made.');
      }
      
      // Close readline interface and exit
      readline.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Error in main execution:', error);
    process.exit(1);
  }
};

// Run the script
main();
