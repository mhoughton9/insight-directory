/**
 * Delete Retreat Center Sample
 * 
 * This script deletes the sample retreat center resource so we can start fresh.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function deleteRetreatCenterSample() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all retreat center resources
    const retreatCenters = await Resource.find({ type: 'retreatCenter' });
    console.log(`Found ${retreatCenters.length} retreat center resources`);
    
    if (retreatCenters.length === 0) {
      console.log('No retreat centers found. Nothing to delete.');
      return;
    }
    
    // Delete each retreat center
    for (const center of retreatCenters) {
      console.log(`Deleting retreat center: ${center.title}`);
      await Resource.deleteOne({ _id: center._id });
      console.log(`\u2713 Deleted retreat center: ${center.title}`);
    }
    
    console.log('All retreat center samples deleted successfully.');
  } catch (error) {
    console.error('Error deleting retreat center samples:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the script
deleteRetreatCenterSample();
