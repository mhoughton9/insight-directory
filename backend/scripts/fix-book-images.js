/**
 * Fix Book Image URLs
 * 
 * This script:
 * 1. Marks all books with Cloudinary URLs as processed
 * 2. Updates any books with placeholder URLs to be unprocessed
 * 3. Fixes folder paths if needed
 */

const mongoose = require('mongoose');
const Resource = require('../models/resource');
require('dotenv').config();

async function fixBookImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // 1. Mark all books with Cloudinary URLs as processed
    const cloudinaryResult = await Resource.updateMany(
      { 
        type: 'book',
        imageUrl: /cloudinary\.com/
      },
      { 
        $set: { imageProcessed: true } 
      }
    );
    
    console.log(`Marked ${cloudinaryResult.modifiedCount} books with Cloudinary URLs as processed`);
    
    // 2. Update books with placeholder URLs to be unprocessed
    const placeholderResult = await Resource.updateMany(
      {
        type: 'book',
        imageUrl: /example\.com/
      },
      {
        $set: { imageProcessed: false },
        $unset: { imageUrl: "" }
      }
    );
    
    console.log(`Reset ${placeholderResult.modifiedCount} books with placeholder URLs`);
    
    // 3. Update folder path if needed (from book-covers to books)
    // This is optional and only needed if you want to standardize the folder structure
    // Uncomment if you want to run this
    /*
    const folderResult = await Resource.updateMany(
      {
        type: 'book',
        imageUrl: /\/book-covers\//
      },
      [
        { 
          $set: { 
            imageUrl: {
              $replaceAll: {
                input: "$imageUrl",
                find: "/book-covers/",
                replacement: "/books/"
              }
            }
          }
        }
      ]
    );
    
    console.log(`Updated folder path for ${folderResult.modifiedCount} books`);
    */
    
    // Count remaining books to process
    const remainingCount = await Resource.countDocuments({
      type: 'book',
      $or: [
        { imageUrl: { $exists: false } },
        { imageUrl: null },
        { imageUrl: '' }
      ],
      imageProcessed: { $ne: true }
    });
    
    console.log(`\nRemaining books to process: ${remainingCount}`);
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the database connection
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the function
fixBookImages();
