/**
 * Delete App Sample
 * 
 * This script deletes the sample app resource so we can start fresh.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function deleteAppSample() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all app resources
    const apps = await Resource.find({ type: 'app' });
    console.log(`Found ${apps.length} app resources`);
    
    if (apps.length === 0) {
      console.log('No apps found. Nothing to delete.');
      return;
    }
    
    // Delete each app
    for (const app of apps) {
      console.log(`Deleting app: ${app.title}`);
      await Resource.deleteOne({ _id: app._id });
      console.log(`\u2713 Deleted app: ${app.title}`);
    }
    
    console.log('All app samples deleted successfully.');
  } catch (error) {
    console.error('Error deleting app samples:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the script
deleteAppSample();
