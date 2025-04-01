/**
 * Verify Website Standardization
 * 
 * This script verifies that the website standardization changes are working correctly.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function verifyWebsiteStandardization() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all website resources
    const websites = await Resource.find({ type: 'website' });
    console.log(`Found ${websites.length} websites`);
    
    if (websites.length === 0) {
      console.log('No websites found. Nothing to verify.');
      return;
    }
    
    // Test the middleware by updating one website
    const testWebsite = websites[0];
    console.log(`\nTesting middleware on: ${testWebsite.title}`);
    
    // Print current values
    console.log(`  Current creator: ${JSON.stringify(testWebsite.creator)}`);
    console.log(`  Current websiteDetails.creator: ${JSON.stringify(testWebsite.websiteDetails?.creator)}`);
    console.log(`  Current websiteDetails.links: ${JSON.stringify(testWebsite.websiteDetails?.links)}`);
    
    // Update the creator field
    const newCreator = ['Test Creator 1', 'Test Creator 2'];
    testWebsite.creator = newCreator;
    
    // Save the website to trigger middleware
    await testWebsite.save();
    
    // Reload the website
    const updatedWebsite = await Resource.findById(testWebsite._id);
    
    // Check if the websiteDetails.creator field was updated
    console.log(`  Updated creator: ${JSON.stringify(updatedWebsite.creator)}`);
    console.log(`  Updated websiteDetails.creator: ${JSON.stringify(updatedWebsite.websiteDetails?.creator)}`);
    
    if (JSON.stringify(updatedWebsite.creator) === JSON.stringify(updatedWebsite.websiteDetails?.creator)) {
      console.log(`  ✓ Middleware successfully synchronized creator fields`);
    } else {
      console.log(`  ✗ Middleware failed to synchronize creator fields`);
    }
    
    // Test link to links array conversion
    console.log('\nTesting link to links array conversion:');
    console.log(`  websiteDetails.link: ${updatedWebsite.websiteDetails?.link}`);
    console.log(`  websiteDetails.links: ${JSON.stringify(updatedWebsite.websiteDetails?.links)}`);
    
    const linkUrl = updatedWebsite.websiteDetails?.link;
    if (linkUrl && updatedWebsite.websiteDetails?.links?.some(link => link.url === linkUrl)) {
      console.log(`  ✓ Link successfully added to links array`);
    } else if (!linkUrl) {
      console.log(`  No link field to convert`);
    } else {
      console.log(`  ✗ Link not added to links array`);
    }
    
    // Check dateRange
    console.log('\nChecking dateRange:');
    console.log(`  dateRange: ${JSON.stringify(updatedWebsite.dateRange)}`);
    
    if (updatedWebsite.dateRange && updatedWebsite.dateRange.active === true) {
      console.log(`  ✓ dateRange properly set with active: true`);
    } else {
      console.log(`  ✗ dateRange not properly set`);
    }
    
    // Restore original values
    updatedWebsite.creator = testWebsite.creator;
    await updatedWebsite.save();
    console.log(`  Restored original values`);
    
    // Examine all websites
    console.log('\nExamining all websites:');
    
    for (const website of websites) {
      console.log(`\nWebsite: ${website.title}`);
      console.log(`  Creator: ${JSON.stringify(website.creator)}`);
      console.log(`  websiteDetails.creator: ${JSON.stringify(website.websiteDetails?.creator)}`);
      console.log(`  websiteDetails.websiteName: ${website.websiteDetails?.websiteName}`);
      console.log(`  Title: ${website.title}`);
      console.log(`  dateRange: ${JSON.stringify(website.dateRange)}`);
      
      // Check links format
      if (website.websiteDetails?.links && website.websiteDetails.links.length > 0) {
        console.log(`  Links: ${JSON.stringify(website.websiteDetails.links)}`);
      } else {
        console.log(`  No links found`);
      }
    }
    
    console.log('\nVerification complete.');
  } catch (error) {
    console.error('Error verifying website standardization:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the verification
verifyWebsiteStandardization();
