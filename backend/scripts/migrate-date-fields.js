/**
 * Migration Script: Standardize date fields
 * 
 * This script populates the dateRange field from existing date-related fields
 * in type-specific details objects.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB with hardcoded connection string for this one-time migration
const MONGODB_URI = 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function migrateDateFields() {
  try {
    console.log('Starting date fields migration...');
    
    // Get all resources
    const resources = await Resource.find({});
    console.log(`Found ${resources.length} resources to process`);
    
    let updatedCount = 0;
    let alreadySetCount = 0;
    let noDateCount = 0;
    
    for (const resource of resources) {
      const type = resource.type;
      let needsUpdate = false;
      let dateRange = {};
      
      // Skip if dateRange is already populated
      if (resource.dateRange && resource.dateRange.start) {
        alreadySetCount++;
        continue;
      }
      
      // Process based on resource type
      switch (type) {
        case 'book':
          // For books, use yearPublished to set publishedDate if not already set
          if (resource.bookDetails?.yearPublished && !resource.publishedDate) {
            const year = resource.bookDetails.yearPublished;
            resource.publishedDate = new Date(year, 0, 1); // January 1st of the year
            needsUpdate = true;
          }
          break;
          
        case 'podcast':
          // For podcasts, parse datesActive string to set dateRange
          if (resource.podcastDetails?.datesActive) {
            const datesActive = resource.podcastDetails.datesActive;
            // Try to parse patterns like "2010", "2010 - 2020", "2010 - Present"
            const match = datesActive.match(/^(\d{4})(?:\s*-\s*(\d{4}|Present))?$/);
            
            if (match) {
              const startYear = parseInt(match[1]);
              if (!isNaN(startYear)) {
                dateRange.start = new Date(startYear, 0, 1);
                
                if (match[2]) {
                  if (match[2].toLowerCase() === 'present') {
                    dateRange.active = true;
                  } else {
                    const endYear = parseInt(match[2]);
                    if (!isNaN(endYear)) {
                      dateRange.end = new Date(endYear, 11, 31); // December 31st
                      dateRange.active = false;
                    }
                  }
                } else {
                  // If only one year is specified, assume it's still active
                  dateRange.active = true;
                }
                
                resource.dateRange = dateRange;
                needsUpdate = true;
              }
            }
          }
          break;
      }
      
      // Update the resource if needed
      if (needsUpdate) {
        await resource.save();
        updatedCount++;
        console.log(`Updated date fields for ${resource.title} (${resource.type})`);
      } else if (!resource.publishedDate && !resource.dateRange?.start) {
        noDateCount++;
      }
    }
    
    console.log(`Migration complete.`);
    console.log(`Updated ${updatedCount} resources with standardized date fields.`);
    console.log(`${alreadySetCount} resources already had correct date fields.`);
    console.log(`${noDateCount} resources have no date information.`);
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Run the migration
migrateDateFields();
