/**
 * Examine Description Sections
 * 
 * This script examines the description sections of resources to understand their structure.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function examineDescriptionSections() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find a resource with description sections
    const resource = await Resource.findOne({ descriptionSections: { $exists: true, $ne: {} } }).lean();
    
    if (!resource) {
      console.log('No resources found with description sections.');
      return;
    }
    
    console.log(`Found resource: ${resource.title}`);
    console.log('Description Sections:');
    console.log(JSON.stringify(resource.descriptionSections, null, 2));
    
  } catch (error) {
    console.error('Error examining description sections:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the examination
examineDescriptionSections();
