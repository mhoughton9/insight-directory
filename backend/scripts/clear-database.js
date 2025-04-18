/**
 * Clear Database and Cloudinary Images Script
 * 
 * This script will:
 * 1. Clear all documents from the MongoDB database
 * 2. Delete all images from Cloudinary folders
 * 
 * IMPORTANT: This is a destructive operation and cannot be undone.
 * Make sure you have backups if needed before running this script.
 */

// Load environment variables from the root .env file
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

// Debug environment variables
console.log('Environment variables loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found' : 'Not found');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'Found' : 'Not found');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Found' : 'Not found');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Found' : 'Not found');

// Import models
const Resource = require('../models/resource');
const Teacher = require('../models/teacher');
const Tradition = require('../models/tradition');
const Comment = require('../models/comment');
const User = require('../models/user');
const Suggestion = require('../models/suggestion');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Clear MongoDB collections
const clearDatabase = async () => {
  try {
    console.log('\n=== Clearing MongoDB Collections ===');
    
    // Delete all resources
    const resourceCount = await Resource.countDocuments();
    await Resource.deleteMany({});
    console.log(`Deleted ${resourceCount} resources`);
    
    // Delete all teachers
    const teacherCount = await Teacher.countDocuments();
    await Teacher.deleteMany({});
    console.log(`Deleted ${teacherCount} teachers`);
    
    // Delete all traditions
    const traditionCount = await Tradition.countDocuments();
    await Tradition.deleteMany({});
    console.log(`Deleted ${traditionCount} traditions`);
    
    // Delete all comments
    const commentCount = await Comment.countDocuments();
    await Comment.deleteMany({});
    console.log(`Deleted ${commentCount} comments`);
    
    // Delete all suggestions
    const suggestionCount = await Suggestion.countDocuments();
    await Suggestion.deleteMany({});
    console.log(`Deleted ${suggestionCount} suggestions`);
    
    // Note: We're not deleting users to preserve admin accounts
    console.log('Note: User accounts were preserved');
    
    console.log('All collections cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing database:', error);
    return false;
  }
};

// Clear Cloudinary images
const clearCloudinaryImages = async () => {
  try {
    console.log('\n=== Clearing Cloudinary Images ===');
    
    // Define folders to clear based on the application's structure
    const folders = [
      'books',
      'podcasts',
      'videoChannels',
      'teachers',
      'traditions',
      'practices',
      'retreatCenters',
      'websites',
      'blogs',
      'apps',
      'misc'
    ];
    
    // Delete all resources in each folder
    for (const folder of folders) {
      try {
        console.log(`Clearing folder: ${folder}...`);
        
        // Delete all resources in the folder
        const result = await cloudinary.api.delete_resources_by_prefix(`${folder}/`);
        console.log(`Cleared images in ${folder} folder`);
      } catch (folderError) {
        console.error(`Error clearing folder ${folder}:`, folderError.message);
        // Continue with other folders even if one fails
      }
    }
    
    console.log('Cloudinary images cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing Cloudinary images:', error);
    return false;
  }
};

// Main function
const main = async () => {
  try {
    // Connect to the database
    await connectDB();
    
    console.log('\n==================================');
    console.log('DATABASE AND CLOUDINARY CLEANUP');
    console.log('==================================');
    console.log('WARNING: This will delete all resources, teachers, traditions,');
    console.log('comments, suggestions, and images from the database.');
    console.log('This operation cannot be undone.');
    console.log('==================================\n');
    
    // Ask for confirmation
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('Are you sure you want to proceed? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        console.log('\nProceeding with database and Cloudinary cleanup...');
        
        // Clear MongoDB collections
        const dbSuccess = await clearDatabase();
        
        // Clear Cloudinary images
        const cloudinarySuccess = await clearCloudinaryImages();
        
        if (dbSuccess && cloudinarySuccess) {
          console.log('\n✅ Database and Cloudinary cleanup completed successfully!');
        } else {
          console.log('\n⚠️ Cleanup completed with some errors. Please check the logs above.');
        }
      } else {
        console.log('\nOperation cancelled. No changes were made.');
      }
      
      // Close connections and exit
      readline.close();
      await mongoose.connection.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Error in main execution:', error);
    process.exit(1);
  }
};

// Run the script
main();
