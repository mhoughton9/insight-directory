/**
 * Simple script to test MongoDB connection
 * Run with: node test-db-connection.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection string with the correct database name
const MONGODB_URI = 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

console.log('Attempting to connect to MongoDB...');
console.log(`Connection string: ${MONGODB_URI.replace(/poseidonwoodworks:([^@]+)@/, 'poseidonwoodworks:****@')}`);

// Connect to MongoDB with increased timeout
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 60000, // 60 seconds
  connectTimeoutMS: 60000,
  socketTimeoutMS: 60000,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`Connected to database: ${mongoose.connection.db.databaseName}`);
    console.log(`Host: ${mongoose.connection.host}`);
    
    // List all collections
    return mongoose.connection.db.listCollections().toArray();
  })
  .then((collections) => {
    console.log('\nAvailable collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Close the connection
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('\nConnection closed successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });
