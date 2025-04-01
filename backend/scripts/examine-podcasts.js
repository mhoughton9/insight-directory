/**
 * Examine Podcast Resources
 * 
 * This script examines podcast resources to understand their current structure
 * and identify standardization opportunities.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function examinePodcasts() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    console.log('Examining podcast resources...');
    
    // Find all podcast resources
    const podcasts = await Resource.find({ type: 'podcast' }).lean();
    console.log(`Found ${podcasts.length} podcasts in the database`);
    
    if (podcasts.length === 0) {
      console.log('No podcasts found. Nothing to examine.');
      return;
    }
    
    // Analyze the structure of podcasts
    console.log('\nAnalyzing podcast structure:');
    
    // Check for key fields
    let creatorCount = 0;
    let podcastNameCount = 0;
    let hostsCount = 0;
    let publishedDateCount = 0;
    let dateRangeCount = 0;
    let datesActiveCount = 0;
    
    for (const podcast of podcasts) {
      console.log(`\nPodcast: ${podcast.title}`);
      
      // Check top-level fields
      console.log(`  Top-level creator: ${podcast.creator ? (Array.isArray(podcast.creator) ? podcast.creator.join(', ') : podcast.creator) : 'Not set'}`);
      console.log(`  publishedDate: ${podcast.publishedDate || 'Not set'}`);
      console.log(`  dateRange: ${podcast.dateRange ? JSON.stringify(podcast.dateRange) : 'Not set'}`);
      
      // Check podcastDetails fields
      console.log(`  podcastDetails.podcastName: ${podcast.podcastDetails?.podcastName || 'Not set'}`);
      console.log(`  podcastDetails.hosts: ${podcast.podcastDetails?.hosts ? podcast.podcastDetails.hosts.join(', ') : 'Not set'}`);
      console.log(`  podcastDetails.datesActive: ${podcast.podcastDetails?.datesActive || 'Not set'}`);
      
      // Count occurrences of fields
      if (podcast.creator && (Array.isArray(podcast.creator) ? podcast.creator.length > 0 : true)) creatorCount++;
      if (podcast.podcastDetails?.podcastName) podcastNameCount++;
      if (podcast.podcastDetails?.hosts && podcast.podcastDetails.hosts.length > 0) hostsCount++;
      if (podcast.publishedDate) publishedDateCount++;
      if (podcast.dateRange && (podcast.dateRange.start || podcast.dateRange.end)) dateRangeCount++;
      if (podcast.podcastDetails?.datesActive) datesActiveCount++;
      
      // Print all fields for the first few podcasts
      if (podcasts.indexOf(podcast) < 2) {
        console.log('  All fields:');
        console.log(JSON.stringify(podcast, null, 2).split('\n').map(line => `    ${line}`).join('\n'));
      }
    }
    
    console.log('\nSummary:');
    console.log(`Total podcasts: ${podcasts.length}`);
    console.log(`Podcasts with top-level creator: ${creatorCount}`);
    console.log(`Podcasts with podcastName: ${podcastNameCount}`);
    console.log(`Podcasts with hosts: ${hostsCount}`);
    console.log(`Podcasts with publishedDate: ${publishedDateCount}`);
    console.log(`Podcasts with dateRange: ${dateRangeCount}`);
    console.log(`Podcasts with datesActive: ${datesActiveCount}`);
    
    // Identify standardization opportunities
    console.log('\nStandardization Opportunities:');
    
    if (podcastNameCount > 0 && podcastNameCount < podcasts.length) {
      console.log('- Need to ensure all podcasts have podcastName synchronized with title');
    }
    
    if (hostsCount > 0 && creatorCount !== hostsCount) {
      console.log('- Need to synchronize top-level creator with podcastDetails.hosts');
    }
    
    if (datesActiveCount > 0 && dateRangeCount !== datesActiveCount) {
      console.log('- Need to synchronize dateRange with podcastDetails.datesActive');
    }
  } catch (error) {
    console.error('Error examining podcasts:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the examination
examinePodcasts();
