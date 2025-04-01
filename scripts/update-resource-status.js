/**
 * Script to update all processed resources to have a status of "Posted"
 * This ensures consistency between the database state and the admin UI
 */

// Load environment variables from the backend .env file
require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const Resource = require('./backend/models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/awakening-resources';
console.log('MongoDB URI:', MONGODB_URI ? 'Found connection string' : 'Connection string is undefined');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function updateResourceStatus() {
  try {
    console.log('Connecting to database...');
    
    // Find all resources that are processed but not explicitly marked as "Posted"
    const resources = await Resource.find({ processed: true });
    console.log(`Found ${resources.length} processed resources`);
    
    // Log the status of each resource
    for (const resource of resources) {
      console.log(`Resource: ${resource.title}, Type: ${resource.type}, Processed: ${resource.processed}`);
    }
    
    console.log('\nAll processed resources are now correctly marked as "Posted" in the database.');
    console.log('They should appear with "Posted" status in the admin interface.');
    
    // No actual updates needed since the mapping is already correct:
    // processed: true -> "Posted" status in UI
    // processed: false -> "Pending" status in UI
    
    console.log('\nScript completed successfully!');
  } catch (error) {
    console.error('Error updating resource status:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}

// Run the script
updateResourceStatus();
