/**
 * Script to remove the invalid "Who Am I?" resource with type "video"
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB with hardcoded connection string for this one-time operation
const MONGODB_URI = 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function removeInvalidVideo() {
  try {
    console.log('Looking for invalid "video" type resource...');
    
    // Find the resource with title "Who Am I?" and type "video"
    const invalidResource = await Resource.findOne({ 
      title: 'Who Am I?',
      type: 'video'
    });
    
    if (!invalidResource) {
      console.log('No resource found with title "Who Am I?" and type "video".');
      return;
    }
    
    console.log(`Found invalid resource: ${invalidResource.title} (${invalidResource._id})`);
    
    // Delete the resource
    await Resource.deleteOne({ _id: invalidResource._id });
    
    console.log(`Successfully deleted the invalid resource "${invalidResource.title}" with type "video".`);
  } catch (error) {
    console.error('Error during resource removal:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Run the removal
removeInvalidVideo();
