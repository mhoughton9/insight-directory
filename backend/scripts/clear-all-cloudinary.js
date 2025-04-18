/**
 * Clear All Cloudinary Assets Script
 * 
 * This script will delete ALL assets from Cloudinary, regardless of folder structure.
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

// Function to delete resources in batches
async function deleteResourcesInBatches(resources) {
  try {
    // Process in batches of 100
    const batchSize = 100;
    const totalResources = resources.length;
    let deletedCount = 0;
    
    console.log(`Found ${totalResources} resources to delete`);
    
    for (let i = 0; i < totalResources; i += batchSize) {
      const batch = resources.slice(i, i + batchSize);
      const publicIds = batch.map(resource => resource.public_id);
      
      console.log(`Deleting batch ${i/batchSize + 1} of ${Math.ceil(totalResources/batchSize)}...`);
      
      await cloudinary.api.delete_resources(publicIds);
      
      deletedCount += batch.length;
      console.log(`Progress: ${deletedCount}/${totalResources} resources deleted`);
    }
    
    console.log('All resources deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting resources:', error);
    return false;
  }
}

// Clear all Cloudinary assets
const clearAllCloudinaryAssets = async () => {
  try {
    console.log('\n=== Clearing ALL Cloudinary Assets ===');
    
    // Get all resources
    console.log('Fetching all resources from Cloudinary...');
    const allResources = await getAllResources();
    
    if (allResources.length === 0) {
      console.log('No resources found in Cloudinary');
      return true;
    }
    
    // Delete all resources
    const success = await deleteResourcesInBatches(allResources);
    
    return success;
  } catch (error) {
    console.error('Error clearing Cloudinary assets:', error);
    return false;
  }
};

// Main function
const main = async () => {
  try {
    console.log('\n==================================');
    console.log('COMPLETE CLOUDINARY CLEANUP');
    console.log('==================================');
    console.log('WARNING: This will delete ALL assets from Cloudinary.');
    console.log('This operation cannot be undone.');
    console.log('==================================\n');
    
    // Ask for confirmation
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('Are you sure you want to proceed? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        console.log('\nProceeding with complete Cloudinary cleanup...');
        
        // Clear all Cloudinary assets
        const success = await clearAllCloudinaryAssets();
        
        if (success) {
          console.log('\n✅ Cloudinary cleanup completed successfully!');
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
