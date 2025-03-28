/**
 * Amazon Book Cover and Affiliate Link Import Script
 * 
 * This script fetches book covers, ISBNs, and affiliate links from Amazon's Product Advertising API
 * for all book resources in the database that don't have images yet.
 * 
 * It uses the amazon-paapi package to interact with Amazon's PA API.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');
const cloudinary = require('cloudinary').v2;
const fetch = require('node-fetch');
const amazonPaapi = require('amazon-paapi');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Amazon PA API
const amazonConfig = {
  AccessKey: process.env.AMAZON_ACCESS_KEY,
  SecretKey: process.env.AMAZON_SECRET_KEY,
  PartnerTag: process.env.AMAZON_PARTNER_TAG,
  PartnerType: 'Associates',
  Marketplace: 'www.amazon.com'
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    processBooks();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

/**
 * Sleep for a specified number of milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Main function to process all books
 */
async function processBooks() {
  try {
    // Get all book resources that need image processing
    const books = await Resource.find({ type: 'book' });
    
    console.log(`Found ${books.length} books to process`);
    
    // Process one book at a time with sufficient delay to avoid rate limiting
    let processedCount = 0;
    let successCount = 0;
    
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      console.log(`\nProcessing book ${i + 1} of ${books.length}: ${book.title}`);
      
      try {
        // Process the book
        const success = await processBook(book);
        processedCount++;
        
        if (success) {
          successCount++;
        }
        
        // Wait 2 seconds between books to avoid rate limiting
        if (i < books.length - 1) {
          console.log('Waiting 2 seconds before next book...');
          await sleep(2000);
        }
      } catch (err) {
        console.error(`Error processing book ${book.title}:`, err.message);
        processedCount++;
        
        // If we hit a rate limit, wait longer before continuing
        if (err.status === 429) {
          const waitTime = 10000; // 10 seconds
          console.log(`Rate limited! Waiting ${waitTime/1000} seconds before continuing...`);
          await sleep(waitTime);
        }
      }
    }
    
    console.log(`\nProcessing complete!`);
    console.log(`Processed ${processedCount} of ${books.length} books`);
    console.log(`Successfully updated ${successCount} books`);
    
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (err) {
    console.error('Error processing books:', err);
    mongoose.connection.close();
    process.exit(1);
  }
}

/**
 * Process a single book
 * @param {Object} book - The book resource document
 * @returns {Promise<boolean>} - Whether the processing was successful
 */
async function processBook(book) {
  try {
    console.log(`Processing: ${book.title}`);
    
    // Get author information if available
    let author = '';
    if (book.bookDetails && book.bookDetails.author) {
      if (Array.isArray(book.bookDetails.author)) {
        author = book.bookDetails.author[0]; // Use the first author
      } else {
        author = book.bookDetails.author;
      }
    }
    
    if (author) {
      console.log(`Author: ${author}`);
    }
    
    // Search for the book on Amazon
    const amazonData = await searchAmazonForBook(book.title, author);
    
    if (!amazonData) {
      console.log(`No Amazon data found for: ${book.title}`);
      return false;
    }
    
    // Extract the data we need
    const { imageUrl, isbn, affiliateUrl } = amazonData;
    
    // Update fields to track
    let fieldsUpdated = [];
    let updateData = {};
    
    // Process image if we found one and the book doesn't have an image yet
    if (imageUrl && (!book.imageUrl || book.imageUrl.includes('no-image-available'))) {
      try {
        // Upload to Cloudinary
        const cloudinaryUrl = await uploadImageToCloudinary(imageUrl, book.slug);
        
        if (cloudinaryUrl) {
          updateData.imageUrl = cloudinaryUrl;
          updateData.imageProcessed = true;
          fieldsUpdated.push('imageUrl');
          console.log(` Image uploaded to Cloudinary: ${cloudinaryUrl}`);
        }
      } catch (err) {
        console.error(`Error uploading image to Cloudinary: ${err.message}`);
      }
    } else if (imageUrl) {
      console.log(`Book already has an image, skipping image upload`);
    } else {
      console.log(`No image found on Amazon`);
    }
    
    // Add ISBN if found and not already present
    if (isbn && !book.isbn) {
      updateData.isbn = isbn;
      fieldsUpdated.push('isbn');
      console.log(` Added ISBN: ${isbn}`);
    } else if (isbn) {
      console.log(`Book already has ISBN: ${book.isbn}`);
    }
    
    // Add affiliate URL if found
    if (affiliateUrl) {
      // Initialize bookDetails if it doesn't exist
      if (!book.bookDetails) {
        updateData.bookDetails = { links: [affiliateUrl] };
      } else if (!book.bookDetails.links) {
        // Add links array if it doesn't exist
        updateData.bookDetails = { ...book.bookDetails, links: [affiliateUrl] };
      } else if (!book.bookDetails.links.includes(affiliateUrl)) {
        // Add to existing links array if not already there
        const links = [...book.bookDetails.links, affiliateUrl];
        updateData.bookDetails = { ...book.bookDetails, links };
      }
      
      if (updateData.bookDetails) {
        fieldsUpdated.push('bookDetails.links');
        console.log(` Added Amazon affiliate URL to bookDetails.links`);
      } else {
        console.log(`Book already has Amazon URL in links`);
      }
    }
    
    // Update the book in the database if we have changes
    if (fieldsUpdated.length > 0) {
      await Resource.findByIdAndUpdate(book._id, updateData);
      console.log(`Updated book with: ${fieldsUpdated.join(', ')}`);
      return true;
    } else {
      console.log(`No updates needed for this book`);
      return false;
    }
    
  } catch (err) {
    console.error(`Error processing book ${book.title}:`, err.message);
    throw err; // Rethrow to handle rate limiting in the main function
  }
}

/**
 * Search Amazon for a book using PA API with retry logic
 * @param {string} title - Book title
 * @param {string} author - Book author (optional)
 * @returns {Promise<Object|null>} - Book data or null if not found
 */
async function searchAmazonForBook(title, author) {
  const maxRetries = 3;
  let retryCount = 0;
  let backoffTime = 1000; // Start with 1 second
  
  while (retryCount < maxRetries) {
    try {
      // Create search query
      let searchQuery = title;
      if (author) {
        searchQuery += ` ${author}`;
      }
      
      console.log(`Searching Amazon for: ${searchQuery}`);
      
      // Set up the search parameters
      const searchParams = {
        ...amazonConfig,
        Keywords: searchQuery,
        SearchIndex: 'Books',
        ItemCount: 5,
        Resources: [
          'ItemInfo.Title',
          'ItemInfo.ByLineInfo',
          'ItemInfo.ExternalIds',
          'Images.Primary.Large'
        ]
      };
      
      // Search Amazon using the amazon-paapi package
      const response = await amazonPaapi.SearchItems(searchParams);
      
      // Check if we got results
      if (!response.SearchResult || !response.SearchResult.Items || response.SearchResult.Items.length === 0) {
        console.log('No results found on Amazon');
        return null;
      }
      
      // Get the best match (first result is usually best)
      const items = response.SearchResult.Items;
      let bestMatch = items[0];
      
      // Try to find an exact match by author if provided
      if (author) {
        const authorMatch = items.find(item => {
          if (item.ItemInfo && item.ItemInfo.ByLineInfo && item.ItemInfo.ByLineInfo.Contributors) {
            return item.ItemInfo.ByLineInfo.Contributors.some(contributor => 
              contributor.Name.toLowerCase().includes(author.toLowerCase())
            );
          }
          return false;
        });
        
        if (authorMatch) {
          bestMatch = authorMatch;
        }
      }
      
      // Extract the data we need
      const imageUrl = bestMatch.Images && bestMatch.Images.Primary && bestMatch.Images.Primary.Large
        ? bestMatch.Images.Primary.Large.URL
        : null;
      
      // Get ISBN if available
      let isbn = null;
      if (bestMatch.ItemInfo && bestMatch.ItemInfo.ExternalIds && bestMatch.ItemInfo.ExternalIds.ISBNs) {
        const isbns = bestMatch.ItemInfo.ExternalIds.ISBNs;
        if (isbns.DisplayValues && isbns.DisplayValues.length > 0) {
          isbn = isbns.DisplayValues[0];
        }
      }
      
      // Get the affiliate URL
      const asin = bestMatch.ASIN;
      const affiliateUrl = `https://www.amazon.com/dp/${asin}?tag=${amazonConfig.PartnerTag}`;
      
      console.log(`Found book on Amazon: ${bestMatch.ItemInfo.Title.DisplayValue}`);
      if (imageUrl) console.log(`Image URL: ${imageUrl}`);
      if (isbn) console.log(`ISBN: ${isbn}`);
      console.log(`Affiliate URL: ${affiliateUrl}`);
      
      return {
        imageUrl,
        isbn,
        affiliateUrl
      };
      
    } catch (err) {
      // If we hit a rate limit, back off and retry
      if (err.status === 429) {
        retryCount++;
        
        if (retryCount < maxRetries) {
          console.log(`Rate limited! Retry ${retryCount} of ${maxRetries}. Waiting ${backoffTime/1000} seconds...`);
          await sleep(backoffTime);
          backoffTime *= 2; // Exponential backoff
        } else {
          console.error('Maximum retries reached. Giving up.');
          throw err;
        }
      } else {
        // For other errors, just fail
        console.error('Error searching Amazon:', err.message);
        return null;
      }
    }
  }
  
  return null;
}

/**
 * Upload an image from a URL to Cloudinary
 * @param {string} imageUrl - URL of the image to upload
 * @param {string} slug - Book slug for the filename
 * @returns {Promise<string|null>} - Cloudinary URL or null if failed
 */
async function uploadImageToCloudinary(imageUrl, slug) {
  try {
    console.log(`Downloading image from: ${imageUrl}`);
    
    // Download the image
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    
    // Create a safe filename from the slug
    const fileName = slug.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    
    // Upload to Cloudinary
    console.log(`Uploading to Cloudinary as: ${fileName}`);
    
    // Use cloudinary's upload method
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_buffer(
        buffer,
        {
          public_id: `books/${fileName}`,
          resource_type: 'image'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });
    
    // Return the secure URL
    return result.secure_url;
    
  } catch (err) {
    console.error('Error uploading to Cloudinary:', err.message);
    return null;
  }
}
