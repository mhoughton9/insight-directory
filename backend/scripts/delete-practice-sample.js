/**
 * Delete Practice Sample
 * 
 * This script deletes the sample practice resource so we can start fresh.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function deletePracticeSample() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all practice resources
    const practices = await Resource.find({ type: 'practice' });
    console.log(`Found ${practices.length} practice resources`);
    
    if (practices.length === 0) {
      console.log('No practices found. Nothing to delete.');
      return;
    }
    
    // Delete each practice
    for (const practice of practices) {
      console.log(`Deleting practice: ${practice.title}`);
      await Resource.deleteOne({ _id: practice._id });
      console.log(`\u2713 Deleted practice: ${practice.title}`);
    }
    
    console.log('All practice samples deleted successfully.');
  } catch (error) {
    console.error('Error deleting practice samples:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the script
deletePracticeSample();
