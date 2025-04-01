/**
 * Fix Video Channel Links
 * 
 * This script fixes the links in video channel resources to ensure they use the correct
 * {url, label} format instead of the character-by-character format.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function fixVideoChannelLinks() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    console.log('Fixing video channel links...');
    
    // Find all video channel resources using the Mongoose model
    const videoChannels = await Resource.find({ type: 'videoChannel' });
    console.log(`Found ${videoChannels.length} video channels`);
    
    if (videoChannels.length === 0) {
      console.log('No video channels found. Nothing to fix.');
      return;
    }
    
    for (const channel of videoChannels) {
      console.log(`\nProcessing: ${channel.title}`);
      
      // Check if links exist and need fixing
      if (channel.videoChannelDetails && 
          Array.isArray(channel.videoChannelDetails.links) && 
          channel.videoChannelDetails.links.length > 0) {
        
        const oldLinks = channel.videoChannelDetails.links;
        const newLinks = [];
        
        console.log(`  Found ${oldLinks.length} links to process`);
        
        for (const link of oldLinks) {
          // Check if the link is in the character-by-character format
          if (typeof link === 'object' && !link.url && !link.label) {
            // Try to reconstruct the URL from the character-by-character format
            let url = '';
            let isValidLink = false;
            
            // Iterate through numeric properties to reconstruct the URL
            for (let i = 0; i < 100; i++) { // Reasonable upper limit
              if (link[i] !== undefined) {
                url += link[i];
                isValidLink = true;
              } else {
                break;
              }
            }
            
            if (isValidLink) {
              console.log(`  Reconstructed URL: ${url}`);
              
              // Create a proper link object
              const label = getLabelFromUrl(url);
              newLinks.push({ url, label });
            }
          } else if (typeof link === 'string') {
            // Convert string URL to {url, label} format
            const label = getLabelFromUrl(link);
            newLinks.push({ url: link, label });
          } else if (typeof link === 'object' && link.url) {
            // Already in correct format or close to it
            if (!link.label) {
              link.label = getLabelFromUrl(link.url);
            }
            newLinks.push(link);
          }
        }
        
        if (newLinks.length > 0) {
          console.log(`  Created ${newLinks.length} properly formatted links`);
          
          // Update the links in the channel object
          channel.videoChannelDetails.links = newLinks;
          
          // Save the updated channel
          await channel.save();
          console.log(`  Successfully updated links for ${channel.title}`);
        } else {
          console.log(`  No valid links could be reconstructed`);
        }
      } else {
        console.log(`  No links found or links are already in correct format`);
      }
    }
    
    console.log('\nLink fixing complete.');
  } catch (error) {
    console.error('Error fixing video channel links:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Helper function to extract a label from a URL
function getLabelFromUrl(url) {
  try {
    // Try to extract domain name from URL
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Convert hostname to a readable label
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return 'YouTube';
    } else if (hostname.includes('vimeo.com')) {
      return 'Vimeo';
    } else if (hostname.includes('batgap.com')) {
      return 'BATGAP Website';
    } else {
      // Extract domain without TLD as a fallback
      const parts = hostname.split('.');
      if (parts.length >= 2) {
        // Get the main domain name (e.g., 'example' from 'www.example.com')
        const domainName = parts[parts.length - 2];
        return domainName.charAt(0).toUpperCase() + domainName.slice(1);
      } else {
        return hostname;
      }
    }
  } catch (e) {
    // If URL parsing fails, use a generic label
    return 'Website';
  }
}

// Run the fix
fixVideoChannelLinks();
