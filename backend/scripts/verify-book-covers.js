/**
 * Verify and fix book covers
 * This script checks if book covers are loading correctly and fixes any issues
 */

const fetch = require('node-fetch');
const mongoose = require('mongoose');
const Resource = require('../models/resource');
require('dotenv').config();

async function verifyBookCovers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all books with Cloudinary URLs
    const books = await Resource.find({
      type: 'book',
      imageUrl: /cloudinary\.com/
    });
    
    console.log(`Found ${books.length} books with Cloudinary URLs`);
    
    let validCount = 0;
    let invalidCount = 0;
    
    // Check each book's image URL
    for (const book of books) {
      try {
        // Try to fetch the image to verify it exists
        const response = await fetch(book.imageUrl, { method: 'HEAD' });
        
        if (response.ok) {
          console.log(`✅ Valid image for: ${book.title}`);
          validCount++;
          
          // Update the imageProcessed flag
          await Resource.updateOne(
            { _id: book._id },
            { $set: { imageProcessed: true } }
          );
        } else {
          console.log(`❌ Invalid image for: ${book.title} (Status: ${response.status})`);
          invalidCount++;
          
          // Reset the image URL for invalid images
          await Resource.updateOne(
            { _id: book._id },
            { 
              $unset: { imageUrl: "" },
              $set: { imageProcessed: false }
            }
          );
        }
      } catch (error) {
        console.error(`Error checking image for ${book.title}:`, error.message);
        invalidCount++;
        
        // Reset the image URL for error cases
        await Resource.updateOne(
          { _id: book._id },
          { 
            $unset: { imageUrl: "" },
            $set: { imageProcessed: false }
          }
        );
      }
    }
    
    console.log('\nVerification completed!');
    console.log(`Valid images: ${validCount}`);
    console.log(`Invalid images: ${invalidCount}`);
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the database connection
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the function
verifyBookCovers();
