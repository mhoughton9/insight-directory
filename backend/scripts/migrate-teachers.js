/**
 * Migrate Teacher Records
 * 
 * This script updates existing teacher records to match the standardized schema:
 * 1. Ensures website URLs are included in the links array
 * 2. Sets up standardized description sections structure if needed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Teacher = require('../models/teacher');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function migrateTeachers() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all teachers
    const teachers = await Teacher.find({});
    console.log(`Found ${teachers.length} teachers to migrate`);
    
    if (teachers.length === 0) {
      console.log('No teachers found. Nothing to migrate.');
      return;
    }
    
    let updatedCount = 0;
    
    for (const teacher of teachers) {
      console.log(`\nProcessing: ${teacher.name}`);
      let modified = false;
      
      // 1. Ensure website is in links array
      if (teacher.website) {
        // Initialize links array if it doesn't exist
        if (!teacher.links) {
          teacher.links = [];
          modified = true;
        }
        
        // Check if website is already in links
        const websiteInLinks = teacher.links.some(link => link.url === teacher.website);
        
        // If not, add it to links
        if (!websiteInLinks) {
          console.log(`  Adding website to links array: ${teacher.website}`);
          teacher.links.push({
            url: teacher.website,
            label: 'Website'
          });
          modified = true;
        }
      }
      
      // 2. Ensure description sections have standardized structure
      if (!teacher.descriptionSections) {
        console.log(`  Initializing description sections`);
        teacher.descriptionSections = new Map();
        modified = true;
      }
      
      // Check for standard sections and initialize if missing
      const standardSections = [
        'in_a_nutshell',
        'key_contributions',
        'teaching_style',
        'notable_quotes',
        'historical_context'
      ];
      
      let descriptionSectionsModified = false;
      
      for (const section of standardSections) {
        if (!teacher.descriptionSections.has(section)) {
          // Initialize with appropriate default value (empty string or array)
          if (section === 'notable_quotes') {
            teacher.descriptionSections.set(section, []);
          } else {
            teacher.descriptionSections.set(section, '');
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
        await teacher.save();
        console.log(`  ✓ Saved changes to ${teacher.name}`);
        updatedCount++;
      } else {
        console.log(`  No changes needed for ${teacher.name}`);
      }
    }
    
    console.log(`\nMigration complete. Updated ${updatedCount} of ${teachers.length} teachers.`);
  } catch (error) {
    console.error('Error migrating teachers:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the migration
migrateTeachers();
