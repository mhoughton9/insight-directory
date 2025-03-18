/**
 * Script to check resource types in the database
 * Run with: node check-resource-types.js
 */

const mongoose = require('mongoose');
const Resource = require('../models/resource');

// MongoDB connection string with the correct database name
const MONGODB_URI = 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

console.log('Connecting to MongoDB...');

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 60000,
  connectTimeoutMS: 60000,
  socketTimeoutMS: 60000,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    
    // Get all resources grouped by type
    const resourcesByType = await Resource.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 }, resources: { $push: { title: '$title', slug: '$slug' } } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\nResources by Type:');
    resourcesByType.forEach(group => {
      console.log(`\n${group._id} (${group.count} resources):`);
      group.resources.forEach(resource => {
        console.log(`  - ${resource.title} (${resource.slug})`);
      });
    });
    
    // Close the connection
    mongoose.connection.close()
      .then(() => {
        console.log('\nDatabase connection closed');
        process.exit(0);
      });
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });
