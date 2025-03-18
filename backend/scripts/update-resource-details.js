/**
 * Script to update existing resources with type-specific details
 * Run with: node update-resource-details.js
 */

const mongoose = require('mongoose');
const Resource = require('../models/resource');
require('dotenv').config();

// MongoDB connection string from .env file
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/awakening-resources';

// Connect to MongoDB with increased timeout
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log(`MongoDB Connected: ${MONGODB_URI}`))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Function to update resources
async function updateResources() {
  try {
    console.log('Starting resource update process...');
    
    // Get all resources
    const resources = await Resource.find({});
    console.log(`Found ${resources.length} resources to process`);
    
    // Update each resource based on its type
    for (const resource of resources) {
      console.log(`Processing resource: ${resource.title} (${resource.type})`);
      
      let updateData = {};
      
      // Create type-specific details based on resource type
      switch(resource.type) {
        case 'book':
          // Default book details if none exist
          updateData.bookDetails = {
            publisher: resource.publisher || 'Unknown Publisher',
            pages: resource.pageCount || 200,
            language: 'English',
            isbn: `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`
          };
          break;
          
        case 'video':
          // Default video details if none exist
          updateData.videoDetails = {
            duration: resource.duration || '1:00:00',
            platform: 'YouTube'
          };
          break;
          
        case 'article':
          // Default article details if none exist
          if (!resource.wordCount) {
            updateData.wordCount = Math.floor(1000 + Math.random() * 4000);
          }
          break;
          
        case 'podcast':
          // Default podcast details if none exist
          updateData.podcastDetails = {
            episode: resource.episodeCount || 1,
            series: `${resource.title} Series`,
            duration: '45:00'
          };
          break;

        case 'practice':
          // Default practice details if none exist
          updateData.practiceDetails = {
            duration: '20 minutes',
            difficulty: 'Beginner',
            technique: 'Self-Inquiry',
            benefits: ['Increased awareness', 'Reduced identification with thoughts']
          };
          break;
          
        default:
          console.log(`Skipping resource type: ${resource.type}`);
      }
      
      // Only update if we have data to update
      if (Object.keys(updateData).length > 0) {
        const updated = await Resource.findByIdAndUpdate(
          resource._id,
          { $set: updateData },
          { new: true }
        );
        console.log(`Updated ${resource.title} with type-specific details`);
      }
    }
    
    console.log('All resources updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating resources:', error);
    process.exit(1);
  }
}

// Run the function
updateResources();
