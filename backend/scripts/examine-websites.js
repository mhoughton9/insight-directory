/**
 * Examine Website Resources
 * 
 * This script examines website resources to understand their current structure
 * and identify standardization opportunities.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function examineWebsites() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    console.log('Examining website resources...');
    
    // Find all website resources
    const websites = await Resource.find({ type: 'website' }).lean();
    console.log(`Found ${websites.length} websites in the database`);
    
    if (websites.length === 0) {
      console.log('No websites found. Nothing to examine.');
      return;
    }
    
    // Analyze the structure of websites
    console.log('\nAnalyzing website structure:');
    
    // Check for key fields
    let creatorCount = 0;
    let websiteNameCount = 0;
    let websiteCreatorCount = 0;
    let publishedDateCount = 0;
    let dateRangeCount = 0;
    
    for (const website of websites) {
      console.log(`\nWebsite: ${website.title}`);
      
      // Check top-level fields
      console.log(`  Top-level creator: ${website.creator ? (Array.isArray(website.creator) ? website.creator.join(', ') : website.creator) : 'Not set'}`);
      console.log(`  publishedDate: ${website.publishedDate || 'Not set'}`);
      console.log(`  dateRange: ${website.dateRange ? JSON.stringify(website.dateRange) : 'Not set'}`);
      
      // Check websiteDetails fields
      console.log(`  websiteDetails.websiteName: ${website.websiteDetails?.websiteName || 'Not set'}`);
      console.log(`  websiteDetails.creator: ${website.websiteDetails?.creator || 'Not set'}`);
      console.log(`  websiteDetails.primaryContentTypes: ${website.websiteDetails?.primaryContentTypes ? website.websiteDetails.primaryContentTypes.join(', ') : 'Not set'}`);
      
      // Check links format
      if (website.websiteDetails?.links && website.websiteDetails.links.length > 0) {
        console.log(`  Links:`);
        for (const link of website.websiteDetails.links) {
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
      if (website.creator && (Array.isArray(website.creator) ? website.creator.length > 0 : true)) creatorCount++;
      if (website.websiteDetails?.websiteName) websiteNameCount++;
      if (website.websiteDetails?.creator) websiteCreatorCount++;
      if (website.publishedDate) publishedDateCount++;
      if (website.dateRange && (website.dateRange.start || website.dateRange.end)) dateRangeCount++;
      
      // Print all fields for the first few websites
      if (websites.indexOf(website) < 2) {
        console.log('  All fields:');
        console.log(JSON.stringify(website, null, 2).split('\n').map(line => `    ${line}`).join('\n'));
      }
    }
    
    console.log('\nSummary:');
    console.log(`Total websites: ${websites.length}`);
    console.log(`Websites with top-level creator: ${creatorCount}`);
    console.log(`Websites with websiteName: ${websiteNameCount}`);
    console.log(`Websites with websiteDetails.creator: ${websiteCreatorCount}`);
    console.log(`Websites with publishedDate: ${publishedDateCount}`);
    console.log(`Websites with dateRange: ${dateRangeCount}`);
    
    // Identify standardization opportunities
    console.log('\nStandardization Opportunities:');
    
    if (websiteNameCount > 0 && websiteNameCount < websites.length) {
      console.log('- Need to ensure all websites have websiteName synchronized with title');
    }
    
    if (websiteCreatorCount > 0 && creatorCount !== websiteCreatorCount) {
      console.log('- Need to synchronize top-level creator with websiteDetails.creator');
    }
    
    if (publishedDateCount === 0 && dateRangeCount === 0) {
      console.log('- Consider adding date information to websites');
    }
    
    // Check for non-standard links
    let nonStandardLinksCount = 0;
    for (const website of websites) {
      if (website.websiteDetails?.links && website.websiteDetails.links.length > 0) {
        for (const link of website.websiteDetails.links) {
          if (typeof link === 'string' || (typeof link === 'object' && (!link.url || !link.label))) {
            nonStandardLinksCount++;
            break;
          }
        }
      }
    }
    
    if (nonStandardLinksCount > 0) {
      console.log(`- Need to standardize links format for ${nonStandardLinksCount} websites`);
    }
  } catch (error) {
    console.error('Error examining websites:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the examination
examineWebsites();
