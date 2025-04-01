/**
 * Verify Podcast Standardization
 * 
 * This script verifies that the podcast standardization changes are working correctly.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function verifyPodcastStandardization() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all podcast resources
    const podcasts = await Resource.find({ type: 'podcast' });
    console.log(`Found ${podcasts.length} podcasts`);
    
    if (podcasts.length === 0) {
      console.log('No podcasts found. Nothing to verify.');
      return;
    }
    
    // Test the middleware by updating one podcast
    const testPodcast = podcasts[0];
    console.log(`\nTesting middleware on: ${testPodcast.title}`);
    
    // Print current values
    console.log(`  Current creator: ${JSON.stringify(testPodcast.creator)}`);
    console.log(`  Current hosts: ${JSON.stringify(testPodcast.podcastDetails?.hosts)}`);
    
    // Update the creator field
    const newCreator = ['Test Host 1', 'Test Host 2'];
    testPodcast.creator = newCreator;
    
    // Save the podcast to trigger middleware
    await testPodcast.save();
    
    // Reload the podcast
    const updatedPodcast = await Resource.findById(testPodcast._id);
    
    // Check if the hosts field was updated
    console.log(`  Updated creator: ${JSON.stringify(updatedPodcast.creator)}`);
    console.log(`  Updated hosts: ${JSON.stringify(updatedPodcast.podcastDetails?.hosts)}`);
    
    if (JSON.stringify(updatedPodcast.creator) === JSON.stringify(updatedPodcast.podcastDetails?.hosts)) {
      console.log(`  ✓ Middleware successfully synchronized creator and hosts fields`);
    } else {
      console.log(`  ✗ Middleware failed to synchronize creator and hosts fields`);
    }
    
    // Restore original values
    updatedPodcast.creator = testPodcast.creator;
    await updatedPodcast.save();
    console.log(`  Restored original values`);
    
    // Examine all podcasts
    console.log('\nExamining all podcasts:');
    
    for (const podcast of podcasts) {
      console.log(`\nPodcast: ${podcast.title}`);
      console.log(`  Creator: ${JSON.stringify(podcast.creator)}`);
      console.log(`  Hosts: ${JSON.stringify(podcast.podcastDetails?.hosts)}`);
      console.log(`  podcastName: ${podcast.podcastDetails?.podcastName}`);
      console.log(`  Title: ${podcast.title}`);
      console.log(`  datesActive: ${podcast.podcastDetails?.datesActive}`);
      console.log(`  dateRange: ${JSON.stringify(podcast.dateRange)}`);
      
      // Check links format
      if (podcast.podcastDetails?.links && podcast.podcastDetails.links.length > 0) {
        console.log(`  Links: ${JSON.stringify(podcast.podcastDetails.links)}`);
      } else {
        console.log(`  No links found (expected after clearing non-standard links)`);
      }
    }
    
    console.log('\nVerification complete.');
  } catch (error) {
    console.error('Error verifying podcast standardization:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the verification
verifyPodcastStandardization();
