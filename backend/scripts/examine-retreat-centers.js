/**
 * Examine Retreat Center Resources
 * 
 * This script examines retreat center resources to understand their current structure
 * and identify standardization opportunities.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function examineRetreatCenters() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    console.log('Examining retreat center resources...');
    
    // Find all retreat center resources
    const retreatCenters = await Resource.find({ type: 'retreatCenter' }).lean();
    console.log(`Found ${retreatCenters.length} retreat centers in the database`);
    
    if (retreatCenters.length === 0) {
      console.log('No retreat centers found. Nothing to examine.');
      return;
    }
    
    // Analyze the structure of retreat centers
    console.log('\nAnalyzing retreat center structure:');
    
    // Check for key fields
    let creatorCount = 0;
    let nameCount = 0;
    let operatorCount = 0;
    let locationCount = 0;
    let retreatTypesCount = 0;
    let upcomingDatesCount = 0;
    
    for (const center of retreatCenters) {
      console.log(`\nRetreat Center: ${center.title}`);
      
      // Check top-level fields
      console.log(`  Top-level creator: ${center.creator ? (Array.isArray(center.creator) ? center.creator.join(', ') : center.creator) : 'Not set'}`);
      console.log(`  publishedDate: ${center.publishedDate || 'Not set'}`);
      console.log(`  dateRange: ${center.dateRange ? JSON.stringify(center.dateRange) : 'Not set'}`);
      
      // Check retreatCenterDetails fields
      console.log(`  retreatCenterDetails.name: ${center.retreatCenterDetails?.name || 'Not set'}`);
      console.log(`  retreatCenterDetails.operator: ${center.retreatCenterDetails?.operator ? (Array.isArray(center.retreatCenterDetails.operator) ? center.retreatCenterDetails.operator.join(', ') : center.retreatCenterDetails.operator) : 'Not set'}`);
      console.log(`  retreatCenterDetails.location: ${center.retreatCenterDetails?.location || 'Not set'}`);
      console.log(`  retreatCenterDetails.retreatTypes: ${center.retreatCenterDetails?.retreatTypes ? center.retreatCenterDetails.retreatTypes.join(', ') : 'Not set'}`);
      console.log(`  retreatCenterDetails.upcomingDates: ${center.retreatCenterDetails?.upcomingDates ? center.retreatCenterDetails.upcomingDates.join(', ') : 'Not set'}`);
      
      // Check links format
      if (center.retreatCenterDetails?.links && center.retreatCenterDetails.links.length > 0) {
        console.log(`  Links:`);
        for (const link of center.retreatCenterDetails.links) {
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
      if (center.creator && (Array.isArray(center.creator) ? center.creator.length > 0 : true)) creatorCount++;
      if (center.retreatCenterDetails?.name) nameCount++;
      if (center.retreatCenterDetails?.operator) operatorCount++;
      if (center.retreatCenterDetails?.location) locationCount++;
      if (center.retreatCenterDetails?.retreatTypes && center.retreatCenterDetails.retreatTypes.length > 0) retreatTypesCount++;
      if (center.retreatCenterDetails?.upcomingDates && center.retreatCenterDetails.upcomingDates.length > 0) upcomingDatesCount++;
      
      // Print all fields for the first few retreat centers
      if (retreatCenters.indexOf(center) < 2) {
        console.log('  All fields:');
        console.log(JSON.stringify(center, null, 2).split('\n').map(line => `    ${line}`).join('\n'));
      }
    }
    
    console.log('\nSummary:');
    console.log(`Total retreat centers: ${retreatCenters.length}`);
    console.log(`Retreat centers with top-level creator: ${creatorCount}`);
    console.log(`Retreat centers with name: ${nameCount}`);
    console.log(`Retreat centers with operator: ${operatorCount}`);
    console.log(`Retreat centers with location: ${locationCount}`);
    console.log(`Retreat centers with retreatTypes: ${retreatTypesCount}`);
    console.log(`Retreat centers with upcomingDates: ${upcomingDatesCount}`);
    
    // Identify standardization opportunities
    console.log('\nStandardization Opportunities:');
    
    if (nameCount > 0 && nameCount < retreatCenters.length) {
      console.log('- Need to ensure all retreat centers have name synchronized with title');
    }
    
    if (operatorCount > 0 && creatorCount !== operatorCount) {
      console.log('- Need to synchronize top-level creator with retreatCenterDetails.operator');
    }
    
    // Check for non-standard links
    let nonStandardLinksCount = 0;
    for (const center of retreatCenters) {
      if (center.retreatCenterDetails?.links && center.retreatCenterDetails.links.length > 0) {
        for (const link of center.retreatCenterDetails.links) {
          if (typeof link === 'string' || (typeof link === 'object' && (!link.url || !link.label))) {
            nonStandardLinksCount++;
            break;
          }
        }
      }
    }
    
    if (nonStandardLinksCount > 0) {
      console.log(`- Need to standardize links format for ${nonStandardLinksCount} retreat centers`);
    }
    
    // Check if retreatCenterDetails.operator is an array
    let stringOperatorCount = 0;
    for (const center of retreatCenters) {
      if (center.retreatCenterDetails?.operator && !Array.isArray(center.retreatCenterDetails.operator)) {
        stringOperatorCount++;
      }
    }
    
    if (stringOperatorCount > 0) {
      console.log(`- Need to convert retreatCenterDetails.operator from string to array for ${stringOperatorCount} retreat centers`);
    }
  } catch (error) {
    console.error('Error examining retreat centers:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the examination
examineRetreatCenters();
