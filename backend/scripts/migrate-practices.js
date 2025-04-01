/**
 * Migrate Practice Resources
 * 
 * This script updates existing practice resources to match the standardized schema:
 * 1. Moves source field to originator array
 * 2. Removes specialized fields (difficulty, benefits, technique, instructions)
 * 3. Sets up dateRange for practices
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function migratePractices() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all practice resources
    const practices = await Resource.find({ type: 'practice' });
    console.log(`Found ${practices.length} practices to migrate`);
    
    if (practices.length === 0) {
      console.log('No practices found. Nothing to migrate.');
      return;
    }
    
    let updatedCount = 0;
    
    for (const practice of practices) {
      console.log(`\nProcessing: ${practice.title}`);
      let modified = false;
      
      // 1. Handle source field migration to originator array
      if (practice.practiceDetails && practice.practiceDetails.source) {
        const source = practice.practiceDetails.source;
        console.log(`  Moving source to originator array: "${source}"`);
        
        // Initialize originator array if it doesn't exist
        if (!practice.practiceDetails.originator) {
          practice.practiceDetails.originator = [];
        }
        
        // Add source to originator array if not already there
        if (!practice.practiceDetails.originator.includes(source)) {
          practice.practiceDetails.originator.push(source);
          console.log(`  ✓ Added source to originator array`);
          modified = true;
        }
        
        // Update creator array to match
        practice.creator = [...practice.practiceDetails.originator];
      }
      
      // 2. Remove specialized fields
      const fieldsToRemove = ['difficulty', 'benefits', 'technique', 'instructions', 'source'];
      let removedFields = [];
      
      for (const field of fieldsToRemove) {
        if (practice.practiceDetails && practice.practiceDetails[field] !== undefined) {
          // Store the field value for logging
          const fieldValue = practice.practiceDetails[field];
          
          // Remove the field
          delete practice.practiceDetails[field];
          removedFields.push(field);
          modified = true;
        }
      }
      
      if (removedFields.length > 0) {
        console.log(`  ✓ Removed fields: ${removedFields.join(', ')}`);
      }
      
      // 3. Set up dateRange if it doesn't exist
      if (!practice.dateRange) {
        console.log(`  Setting up dateRange`);
        practice.dateRange = { active: true };
        console.log(`  ✓ Added dateRange with active: true`);
        modified = true;
      }
      
      // Save changes if modified
      if (modified) {
        await practice.save();
        console.log(`  ✓ Saved changes to ${practice.title}`);
        updatedCount++;
      } else {
        console.log(`  No changes needed for ${practice.title}`);
      }
    }
    
    console.log(`\nMigration complete. Updated ${updatedCount} of ${practices.length} practices.`);
  } catch (error) {
    console.error('Error migrating practices:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the migration
migratePractices();
