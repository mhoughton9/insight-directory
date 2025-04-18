/**
 * Clear Home Folder Script
 * 
 * This script will delete all images from the "Home" folder in Cloudinary.
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

// Clear Cloudinary Home folder
const clearHomeFolder = async () => {
  try {
    console.log('\n=== Clearing Cloudinary Home Folder ===');
    
    // Delete all resources in the Home folder
    console.log('Clearing folder: Home...');
    const result = await cloudinary.api.delete_resources_by_prefix('Home/');
    console.log('Cleared images in Home folder');
    
    return true;
  } catch (error) {
    console.error('Error clearing Home folder:', error.message);
    if (error.http_code) {
      console.error(`HTTP Status: ${error.http_code}`);
    }
    if (error.error) {
      console.error('Error details:', error.error);
    }
    return false;
  }
};

// Main function
const main = async () => {
  try {
    console.log('\n==================================');
    console.log('CLOUDINARY HOME FOLDER CLEANUP');
    console.log('==================================');
    console.log('WARNING: This will delete all images from the Home folder in Cloudinary.');
    console.log('This operation cannot be undone.');
    console.log('==================================\n');
    
    // Ask for confirmation
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('Are you sure you want to proceed? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        console.log('\nProceeding with Home folder cleanup...');
        
        // Clear Cloudinary Home folder
        const success = await clearHomeFolder();
        
        if (success) {
          console.log('\n✅ Home folder cleanup completed successfully!');
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
