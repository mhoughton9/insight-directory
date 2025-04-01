/**
 * Examine Practice Resources Again
 * 
 * This script examines practice resources after schema changes to understand why
 * the migration script didn't make any changes.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function examinePracticesAgain() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    console.log('Examining practice resources again...');
    
    // Find all practice resources
    const practices = await Resource.find({ type: 'practice' }).lean();
    console.log(`Found ${practices.length} practices in the database`);
    
    if (practices.length === 0) {
      console.log('No practices found. Nothing to examine.');
      return;
    }
    
    // Analyze the structure of practices
    console.log('\nAnalyzing practice structure:');
    
    for (const practice of practices) {
      console.log(`\nPractice: ${practice.title}`);
      
      // Check top-level fields
      console.log(`  Top-level creator: ${practice.creator ? (Array.isArray(practice.creator) ? practice.creator.join(', ') : practice.creator) : 'Not set'}`);
      console.log(`  dateRange: ${practice.dateRange ? JSON.stringify(practice.dateRange) : 'Not set'}`);
      
      // Check practiceDetails fields
      console.log(`  practiceDetails.name: ${practice.practiceDetails?.name || 'Not set'}`);
      console.log(`  practiceDetails.originator: ${practice.practiceDetails?.originator ? (Array.isArray(practice.practiceDetails.originator) ? practice.practiceDetails.originator.join(', ') : practice.practiceDetails.originator) : 'Not set'}`);
      console.log(`  practiceDetails.source: ${practice.practiceDetails?.source || 'Not set'}`);
      console.log(`  practiceDetails.duration: ${practice.practiceDetails?.duration || 'Not set'}`);
      
      // Check for fields that should be removed
      console.log(`  practiceDetails.difficulty: ${practice.practiceDetails?.difficulty || 'Not set'}`);
      console.log(`  practiceDetails.technique: ${practice.practiceDetails?.technique || 'Not set'}`);
      console.log(`  practiceDetails.benefits: ${practice.practiceDetails?.benefits ? practice.practiceDetails.benefits.join(', ') : 'Not set'}`);
      console.log(`  practiceDetails.instructions: ${practice.practiceDetails?.instructions ? (practice.practiceDetails.instructions.length > 100 ? practice.practiceDetails.instructions.substring(0, 100) + '...' : practice.practiceDetails.instructions) : 'Not set'}`);
      
      // Print all fields for the practice
      console.log('  All fields:');
      console.log(JSON.stringify(practice, null, 2).split('\n').map(line => `    ${line}`).join('\n'));
    }
  } catch (error) {
    console.error('Error examining practices:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the examination
examinePracticesAgain();
