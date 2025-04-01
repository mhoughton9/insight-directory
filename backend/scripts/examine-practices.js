/**
 * Examine Practice Resources
 * 
 * This script examines practice resources to understand their current structure
 * and identify standardization opportunities.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function examinePractices() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    console.log('Examining practice resources...');
    
    // Find all practice resources
    const practices = await Resource.find({ type: 'practice' }).lean();
    console.log(`Found ${practices.length} practices in the database`);
    
    if (practices.length === 0) {
      console.log('No practices found. Nothing to examine.');
      return;
    }
    
    // Analyze the structure of practices
    console.log('\nAnalyzing practice structure:');
    
    // Check for key fields
    let creatorCount = 0;
    let practiceNameCount = 0;
    let practiceOriginatorCount = 0;
    let publishedDateCount = 0;
    let dateRangeCount = 0;
    
    for (const practice of practices) {
      console.log(`\nPractice: ${practice.title}`);
      
      // Check top-level fields
      console.log(`  Top-level creator: ${practice.creator ? (Array.isArray(practice.creator) ? practice.creator.join(', ') : practice.creator) : 'Not set'}`);
      console.log(`  publishedDate: ${practice.publishedDate || 'Not set'}`);
      console.log(`  dateRange: ${practice.dateRange ? JSON.stringify(practice.dateRange) : 'Not set'}`);
      
      // Check practiceDetails fields
      console.log(`  practiceDetails.name: ${practice.practiceDetails?.name || 'Not set'}`);
      console.log(`  practiceDetails.originator: ${practice.practiceDetails?.originator ? (Array.isArray(practice.practiceDetails.originator) ? practice.practiceDetails.originator.join(', ') : practice.practiceDetails.originator) : 'Not set'}`);
      console.log(`  practiceDetails.difficulty: ${practice.practiceDetails?.difficulty || 'Not set'}`);
      console.log(`  practiceDetails.timeCommitment: ${practice.practiceDetails?.timeCommitment || 'Not set'}`);
      console.log(`  practiceDetails.benefits: ${practice.practiceDetails?.benefits ? practice.practiceDetails.benefits.join(', ') : 'Not set'}`);
      
      // Check links format
      if (practice.practiceDetails?.links && practice.practiceDetails.links.length > 0) {
        console.log(`  Links:`);
        for (const link of practice.practiceDetails.links) {
          if (typeof link === 'object' && link.url && link.label) {
            console.log(`    - ${link.label}: ${link.url}`);
          } else if (typeof link === 'object' && link.url) {
            console.log(`    - ${link.url} (missing label)`);
          } else if (typeof link === 'string') {
            console.log(`    - ${link} (string format, not object)`);
          } else {
            console.log(`    - Invalid link format: ${JSON.stringify(link)}`);
          }
        }
      } else {
        console.log(`  No links found`);
      }
      
      // Count occurrences of fields
      if (practice.creator && (Array.isArray(practice.creator) ? practice.creator.length > 0 : true)) creatorCount++;
      if (practice.practiceDetails?.name) practiceNameCount++;
      if (practice.practiceDetails?.originator) practiceOriginatorCount++;
      if (practice.publishedDate) publishedDateCount++;
      if (practice.dateRange && (practice.dateRange.start || practice.dateRange.end)) dateRangeCount++;
      
      // Print all fields for the first few practices
      if (practices.indexOf(practice) < 2) {
        console.log('  All fields:');
        console.log(JSON.stringify(practice, null, 2).split('\n').map(line => `    ${line}`).join('\n'));
      }
    }
    
    console.log('\nSummary:');
    console.log(`Total practices: ${practices.length}`);
    console.log(`Practices with top-level creator: ${creatorCount}`);
    console.log(`Practices with name: ${practiceNameCount}`);
    console.log(`Practices with practiceDetails.originator: ${practiceOriginatorCount}`);
    console.log(`Practices with publishedDate: ${publishedDateCount}`);
    console.log(`Practices with dateRange: ${dateRangeCount}`);
    
    // Identify standardization opportunities
    console.log('\nStandardization Opportunities:');
    
    if (practiceNameCount > 0 && practiceNameCount < practices.length) {
      console.log('- Need to ensure all practices have name synchronized with title');
    }
    
    if (practiceOriginatorCount > 0 && creatorCount !== practiceOriginatorCount) {
      console.log('- Need to synchronize top-level creator with practiceDetails.originator');
    }
    
    if (publishedDateCount === 0 && dateRangeCount === 0) {
      console.log('- Consider adding date information to practices');
    }
    
    // Check for non-standard links
    let nonStandardLinksCount = 0;
    for (const practice of practices) {
      if (practice.practiceDetails?.links && practice.practiceDetails.links.length > 0) {
        for (const link of practice.practiceDetails.links) {
          if (typeof link === 'string' || (typeof link === 'object' && (!link.url || !link.label))) {
            nonStandardLinksCount++;
            break;
          }
        }
      }
    }
    
    if (nonStandardLinksCount > 0) {
      console.log(`- Need to standardize links format for ${nonStandardLinksCount} practices`);
    }
    
    // Check if practiceDetails.originator is an array
    let stringOriginatorCount = 0;
    for (const practice of practices) {
      if (practice.practiceDetails?.originator && !Array.isArray(practice.practiceDetails.originator)) {
        stringOriginatorCount++;
      }
    }
    
    if (stringOriginatorCount > 0) {
      console.log(`- Need to convert practiceDetails.originator from string to array for ${stringOriginatorCount} practices`);
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
examinePractices();
