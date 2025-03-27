/**
 * Script to test updating a single resource with description sections
 * Run with: node scripts/test-update-description-sections.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import the Resource model
const Resource = require('../models/resource');

// Import sample data generator
const { generateSampleSections } = require('./sample-description-sections');

// Helper function to normalize resource type
const normalizeResourceTypeForSections = (type) => {
  if (!type) return '';
  
  // Convert to lowercase and handle special cases
  const normalizedType = type.toLowerCase();
  
  // Handle multi-word types
  if (normalizedType === 'video channel') return 'video_channel';
  if (normalizedType === 'retreat center') return 'retreat_center';
  
  // For single word types, just return the lowercase version
  return normalizedType.replace(/\s+/g, '_');
};

// Main function to test updating a resource
async function testUpdateDescriptionSections() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/awakening-resources');
    console.log('Connected to MongoDB');
    
    // Find a specific resource (using "The Power of Now" as an example)
    const resourceSlug = 'power-of-now';
    const resource = await Resource.findOne({ slug: resourceSlug });
    
    if (!resource) {
      console.log(`Resource with slug "${resourceSlug}" not found`);
      return;
    }
    
    console.log('\nFound resource:');
    console.log(`Title: ${resource.title}`);
    console.log(`Type: ${resource.type}`);
    console.log(`Description: ${resource.description.substring(0, 100)}...`);
    
    // Check if the resource already has description sections
    console.log('\nCurrent description sections:');
    console.log(resource.descriptionSections || 'None');
    
    // Normalize the resource type to match our section configuration
    const normalizedType = normalizeResourceTypeForSections(resource.type);
    
    // Generate sample sections based on resource type
    const sampleSections = generateSampleSections(normalizedType);
    
    console.log('\nSample description sections to be added:');
    console.log(JSON.stringify(sampleSections, null, 2));
    
    // Update the resource with the sample sections
    resource.descriptionSections = sampleSections;
    await resource.save();
    
    console.log('\nResource updated successfully!');
    
    // Verify the update by fetching the resource again
    const updatedResource = await Resource.findOne({ slug: resourceSlug });
    console.log('\nUpdated resource description sections:');
    console.log(JSON.stringify(updatedResource.descriptionSections || {}, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  }
}

// Run the function
testUpdateDescriptionSections();
