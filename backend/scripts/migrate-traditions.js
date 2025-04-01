/**
 * Migrate Tradition Records
 * 
 * This script updates existing tradition records to match the standardized schema:
 * 1. Initializes the links array if it doesn't exist
 * 2. Sets up standardized description sections structure if needed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Tradition = require('../models/tradition');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function migrateTraditions() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all traditions
    const traditions = await Tradition.find({});
    console.log(`Found ${traditions.length} traditions to migrate`);
    
    if (traditions.length === 0) {
      console.log('No traditions found. Nothing to migrate.');
      return;
    }
    
    let updatedCount = 0;
    
    for (const tradition of traditions) {
      console.log(`\nProcessing: ${tradition.name}`);
      let modified = false;
      
      // 1. Initialize links array if it doesn't exist
      if (!tradition.links) {
        console.log(`  Initializing links array`);
        tradition.links = [];
        modified = true;
      }
      
      // 2. Ensure description sections have standardized structure
      if (!tradition.descriptionSections) {
        console.log(`  Initializing description sections`);
        tradition.descriptionSections = new Map();
        modified = true;
      }
      
      // Check for standard sections and initialize if missing
      const standardSections = [
        'in_a_nutshell',
        'historical_context',
        'key_teachings',
        'practices',
        'modern_relevance'
      ];
      
      let descriptionSectionsModified = false;
      
      for (const section of standardSections) {
        if (!tradition.descriptionSections.has(section)) {
          // Initialize with appropriate default value (empty string or array)
          if (section === 'key_teachings' || section === 'practices') {
            tradition.descriptionSections.set(section, []);
          } else {
            tradition.descriptionSections.set(section, '');
          }
          descriptionSectionsModified = true;
        }
      }
      
      if (descriptionSectionsModified) {
        console.log(`  Standardized description sections structure`);
        modified = true;
      }
      
      // Save changes if modified
      if (modified) {
        await tradition.save();
        console.log(`  u2713 Saved changes to ${tradition.name}`);
        updatedCount++;
      } else {
        console.log(`  No changes needed for ${tradition.name}`);
      }
    }
    
    console.log(`\nMigration complete. Updated ${updatedCount} of ${traditions.length} traditions.`);
  } catch (error) {
    console.error('Error migrating traditions:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the migration
migrateTraditions();
