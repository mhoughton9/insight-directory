/**
 * Script to update existing resources with type-specific details
 * Run with: node update-resources.js
 */

const mongoose = require('mongoose');
const Resource = require('../models/resource');
require('dotenv').config();

// MongoDB connection string - using localhost for development
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/awakening-resources';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log(`MongoDB Connected: ${MONGODB_URI}`))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Function to update resources
async function updateResources() {
  try {
    // Update "Be As You Are" book
    await Resource.findOneAndUpdate(
      { slug: 'be-as-you-are' },
      { 
        bookDetails: {
          publisher: 'Sri Ramanasramam',
          pages: 251,
          language: 'English',
          isbn: '978-8188018123'
        }
      },
      { new: true }
    );
    console.log('Updated "Be As You Are" book');
    
    // Update "The Power of Now" book
    await Resource.findOneAndUpdate(
      { slug: 'power-of-now' },
      { 
        bookDetails: {
          publisher: 'New World Library',
          pages: 236,
          language: 'English',
          isbn: '978-1577314806'
        }
      },
      { new: true }
    );
    console.log('Updated "The Power of Now" book');
    
    // Update "The Transparency of Things" book
    await Resource.findOneAndUpdate(
      { slug: 'transparency-of-things' },
      { 
        bookDetails: {
          publisher: 'Non-Duality Press',
          pages: 144,
          language: 'English',
          isbn: '978-0956309150'
        }
      },
      { new: true }
    );
    console.log('Updated "The Transparency of Things" book');
    
    // Update "Who Am I?" video
    await Resource.findOneAndUpdate(
      { slug: 'who-am-i-video' },
      { 
        videoDetails: {
          duration: '1:15:30',
          platform: 'YouTube'
        }
      },
      { new: true }
    );
    console.log('Updated "Who Am I?" video');
    
    // Update "Awareness Podcast" podcast
    await Resource.findOneAndUpdate(
      { slug: 'awareness-podcast' },
      { 
        podcastDetails: {
          episode: 248,
          series: 'Awareness Podcast Series',
          duration: '45:30'
        }
      },
      { new: true }
    );
    console.log('Updated "Awareness Podcast" podcast');
    
    console.log('All resources updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating resources:', error);
    process.exit(1);
  }
}

// Run the function
updateResources();
