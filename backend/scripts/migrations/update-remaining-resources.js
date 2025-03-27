/**
 * Script to update remaining resources with sample description sections
 * Run with: node scripts/update-remaining-resources.js
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
  
  // Handle 'video' type (map to video_channel for sections)
  if (normalizedType === 'video') return 'video_channel';
  
  // For single word types, just return the lowercase version
  return normalizedType.replace(/\s+/g, '_');
};

// Main function to update remaining resources
async function updateRemainingResources() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/awakening-resources');
    console.log('Connected to MongoDB');
    
    // Get all resources
    const resources = await Resource.find({});
    console.log(`Found ${resources.length} resources`);
    
    // Count of updated resources
    let updatedCount = 0;
    let skippedCount = 0;
    
    // Update each resource with appropriate sample sections
    for (const resource of resources) {
      try {
        // Skip resources that already have non-empty description sections
        if (resource.descriptionSections && 
            resource.descriptionSections instanceof Map && 
            resource.descriptionSections.size > 0) {
          console.log(`Skipping resource "${resource.title}" - already has description sections`);
          skippedCount++;
          continue;
        }
        
        // Normalize the resource type to match our section configuration
        const normalizedType = normalizeResourceTypeForSections(resource.type);
        
        // Generate sample sections based on resource type
        const sampleSections = generateSampleSections(normalizedType);
        
        // Update the resource with the sample sections
        resource.descriptionSections = sampleSections;
        await resource.save();
        
        console.log(`Updated resource "${resource.title}" with sample description sections`);
        updatedCount++;
      } catch (resourceError) {
        console.log(`Error updating resource "${resource.title}": ${resourceError.message}`);
      }
    }
    
    console.log(`\nSummary: Updated ${updatedCount} resources, skipped ${skippedCount} resources (out of ${resources.length} total).`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the function
updateRemainingResources();
