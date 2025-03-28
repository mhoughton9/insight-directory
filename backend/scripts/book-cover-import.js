/**
 * Book Cover Import Script
 * 
 * This script searches for book covers using Google Books API and Open Library,
 * uploads them to Cloudinary, and updates the database with the image URLs.
 */

const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Resource = require('../models/resource');
require('dotenv').config();

// Cloudinary configuration
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error('Missing Cloudinary credentials. Please check your .env file.');
  process.exit(1);
}

/**
 * Clean and normalize text for better search results
 * @param {string} text - Text to clean
 * @returns {string} - Cleaned text
 */
function cleanText(text) {
  if (!text) return '';
  
  // Remove special characters, extra spaces, and normalize
  return text
    .replace(/[^\w\s]/gi, ' ') // Replace special chars with space
    .replace(/\s+/g, ' ')      // Replace multiple spaces with single space
    .trim();
}

/**
 * Extract the main title (before any subtitle)
 * @param {string} title - Full title
 * @returns {string} - Main title
 */
function extractMainTitle(title) {
  if (!title) return '';
  
  // Extract text before colon or dash (common subtitle separators)
  const mainTitle = title.split(/[:\-]/)[0].trim();
  return mainTitle;
}

/**
 * Generate multiple search variations for a book
 * @param {string} title - Book title
 * @param {string} author - Book author
 * @returns {Array} - Array of search variations
 */
function generateSearchVariations(title, author) {
  if (!title) return [];
  
  const cleanedTitle = cleanText(title);
  const mainTitle = extractMainTitle(title);
  const cleanedAuthor = cleanText(author);
  
  const variations = [
    // Most specific search with quotes
    { 
      query: `intitle:"${cleanedTitle}" ${cleanedAuthor ? `inauthor:"${cleanedAuthor}"` : ''}`,
      description: 'Exact title and author with quotes'
    },
    // Specific search without quotes
    { 
      query: `intitle:${cleanedTitle} ${cleanedAuthor ? `inauthor:${cleanedAuthor}` : ''}`,
      description: 'Exact title and author without quotes'
    },
    // Main title only (if different from full title)
    ...(mainTitle !== cleanedTitle ? [
      { 
        query: `intitle:"${mainTitle}" ${cleanedAuthor ? `inauthor:"${cleanedAuthor}"` : ''}`,
        description: 'Main title and author with quotes'
      }
    ] : []),
    // Title only with quotes
    { 
      query: `intitle:"${cleanedTitle}"`,
      description: 'Title only with quotes'
    },
    // Title only without quotes
    { 
      query: `intitle:${cleanedTitle}`,
      description: 'Title only without quotes'
    },
    // Main title only without quotes (if different)
    ...(mainTitle !== cleanedTitle ? [
      { 
        query: `intitle:${mainTitle}`,
        description: 'Main title only without quotes'
      }
    ] : []),
    // General search (most permissive)
    { 
      query: `${cleanedTitle} ${cleanedAuthor}`,
      description: 'General search with title and author'
    },
  ];
  
  return variations.filter(v => v.query.trim() !== '');
}

/**
 * Search for a book using Google Books API
 * @param {string} title - Book title
 * @param {string} author - Book author
 * @returns {Promise<Object>} - Book data including image URL and ISBN
 */
async function searchGoogleBooks(title, author) {
  const variations = generateSearchVariations(title, author);
  let bookData = null;
  
  // Try each search variation until we find a result
  for (const variation of variations) {
    try {
      console.log(`Trying search: ${variation.description}`);
      const query = encodeURIComponent(variation.query);
      const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=5`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        // Find the first item with an image link
        const bookWithImage = data.items.find(item => 
          item.volumeInfo && 
          item.volumeInfo.imageLinks && 
          (item.volumeInfo.imageLinks.thumbnail || item.volumeInfo.imageLinks.smallThumbnail)
        );
        
        if (bookWithImage) {
          const volumeInfo = bookWithImage.volumeInfo;
          let imageUrl = volumeInfo.imageLinks.thumbnail || volumeInfo.imageLinks.smallThumbnail;
          
          // Fix image URL - replace http with https and remove edge=curl
          imageUrl = imageUrl.replace('http://', 'https://');
          imageUrl = imageUrl.replace('&edge=curl', '');
          
          // Get high quality image URL by modifying the zoom parameter
          const highQualityImageUrl = imageUrl.replace('zoom=1', 'zoom=3');
          
          // Extract ISBN information
          let isbn = null;
          if (volumeInfo.industryIdentifiers) {
            // Prefer ISBN_13, fall back to ISBN_10
            const isbn13 = volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_13');
            const isbn10 = volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_10');
            isbn = isbn13 ? isbn13.identifier : (isbn10 ? isbn10.identifier : null);
          }
          
          bookData = {
            title: volumeInfo.title,
            authors: volumeInfo.authors,
            publisher: volumeInfo.publisher,
            imageUrl: highQualityImageUrl,
            isbn: isbn,
            source: 'Google Books'
          };
          
          console.log(`Found book: ${volumeInfo.title} by ${volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown'}`);
          break; // Exit the loop once we find a good result
        }
      } else {
        console.log(`No books found for: ${variation.query}`);
      }
    } catch (error) {
      console.error(`Error searching Google Books with variation "${variation.description}":`, error.message);
    }
  }
  
  return bookData;
}

/**
 * Search for a book using Open Library API
 * @param {string} title - Book title
 * @param {string} author - Book author
 * @param {string} isbn - ISBN (optional)
 * @returns {Promise<Object>} - Book data including image URL
 */
async function searchOpenLibrary(title, author, isbn) {
  try {
    let url;
    
    // If we have ISBN, use it for more precise search
    if (isbn) {
      url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
      console.log(`Searching Open Library with ISBN: ${isbn}`);
    } else {
      // Otherwise use title and author
      const cleanedTitle = encodeURIComponent(cleanText(title));
      const cleanedAuthor = author ? encodeURIComponent(cleanText(author)) : '';
      url = `https://openlibrary.org/search.json?title=${cleanedTitle}${cleanedAuthor ? `&author=${cleanedAuthor}` : ''}`;
      console.log(`Searching Open Library with title and author`);
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    // Handle ISBN-based response
    if (isbn && data[`ISBN:${isbn}`]) {
      const bookData = data[`ISBN:${isbn}`];
      if (bookData.cover) {
        const imageUrl = bookData.cover.large || bookData.cover.medium || bookData.cover.small;
        if (imageUrl) {
          return {
            title: bookData.title,
            authors: bookData.authors ? bookData.authors.map(a => a.name) : [],
            publisher: bookData.publishers ? bookData.publishers[0].name : null,
            imageUrl,
            isbn,
            source: 'Open Library'
          };
        }
      }
    }
    // Handle search-based response
    else if (data.docs && data.docs.length > 0) {
      // Find the first result with a cover ID
      const bookWithCover = data.docs.find(doc => doc.cover_i);
      
      if (bookWithCover) {
        const coverId = bookWithCover.cover_i;
        const imageUrl = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
        
        return {
          title: bookWithCover.title,
          authors: bookWithCover.author_name || [],
          publisher: bookWithCover.publisher ? bookWithCover.publisher[0] : null,
          imageUrl,
          isbn: bookWithCover.isbn ? bookWithCover.isbn[0] : null,
          source: 'Open Library'
        };
      }
    }
    
    console.log('No results found in Open Library');
    return null;
  } catch (error) {
    console.error('Error searching Open Library:', error.message);
    return null;
  }
}

/**
 * Fetch book cover image
 * @param {string} title - Book title
 * @param {string} author - Book author
 * @returns {Promise<Object>} - Image buffer and metadata
 */
async function fetchBookCover(title, author) {
  try {
    // First try Google Books
    const googleBooksData = await searchGoogleBooks(title, author);
    
    if (googleBooksData && googleBooksData.imageUrl) {
      // Fetch the image
      const imageResponse = await fetch(googleBooksData.imageUrl);
      if (imageResponse.ok) {
        const imageBuffer = await imageResponse.buffer();
        return {
          buffer: imageBuffer,
          metadata: googleBooksData,
          success: true
        };
      }
    }
    
    // If Google Books fails, try Open Library
    const openLibraryData = await searchOpenLibrary(
      title, 
      author, 
      googleBooksData ? googleBooksData.isbn : null
    );
    
    if (openLibraryData && openLibraryData.imageUrl) {
      // Fetch the image
      const imageResponse = await fetch(openLibraryData.imageUrl);
      if (imageResponse.ok) {
        const imageBuffer = await imageResponse.buffer();
        return {
          buffer: imageBuffer,
          metadata: openLibraryData,
          success: true
        };
      }
    }
    
    console.log(`No image found for: ${title}`);
    return { success: false };
  } catch (error) {
    console.error(`Error fetching book cover for ${title}:`, error.message);
    return { success: false };
  }
}

/**
 * Generate a safe filename from title
 * @param {string} title - Book title
 * @returns {string} - Safe filename
 */
function generateSafeFilename(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '')     // Remove leading/trailing hyphens
    .substring(0, 100);        // Limit length
}

/**
 * Upload image to Cloudinary
 * @param {Buffer} imageBuffer - Image buffer
 * @param {string} fileName - File name
 * @returns {Promise<string>} - Cloudinary URL
 */
async function uploadToCloudinary(imageBuffer, fileName) {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = `books/${fileName}`; // Store in 'books' folder
    
    // Generate signature for authentication
    const signature = crypto
      .createHash('sha1')
      .update(`public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`)
      .digest('hex');
    
    // Create form data for upload
    const formData = new FormData();
    formData.append('file', imageBuffer, { filename: `${fileName}.jpg` });
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', API_KEY);
    formData.append('signature', signature);
    formData.append('public_id', publicId);
    
    // Upload to Cloudinary
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error(data.error ? data.error.message : 'Unknown error');
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error.message);
    throw error;
  }
}

/**
 * Process a book to find and upload its cover
 * @param {Object} book - Book document from MongoDB
 * @returns {Promise<boolean>} - Success status
 */
async function processBook(book) {
  try {
    console.log(`Processing: ${book.title} by ${book.author || ''}`);
    
    // Fetch book cover
    const result = await fetchBookCover(book.title, book.author);
    
    if (result.success && result.buffer) {
      // Generate safe filename
      const fileName = generateSafeFilename(book.title);
      
      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(result.buffer, fileName);
      
      // Update book in database
      const updateData = {
        imageUrl: cloudinaryUrl,
        imageProcessed: true
      };
      
      // If we found ISBN, add it to the database
      if (result.metadata && result.metadata.isbn) {
        updateData.isbn = result.metadata.isbn;
      }
      
      await Resource.findByIdAndUpdate(book._id, updateData);
      
      console.log(`✅ Uploaded image for: ${book.title}`);
      return true;
    } else {
      // Mark as processed even if no image found to avoid repeated attempts
      await Resource.findByIdAndUpdate(book._id, { imageProcessed: true });
      console.log(`❌ No image found for: ${book.title}`);
      return false;
    }
  } catch (error) {
    console.error(`Error processing book ${book.title}:`, error.message);
    // Mark as processed to avoid repeated failures
    await Resource.findByIdAndUpdate(book._id, { imageProcessed: true });
    return false;
  }
}

/**
 * Main function to process all books without images
 */
async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find books without images that haven't been processed yet
    const books = await Resource.find({
      type: 'book',
      $or: [
        { imageUrl: { $exists: false } },
        { imageUrl: null },
        { imageUrl: '' }
      ],
      imageProcessed: { $ne: true }
    }).limit(50); // Process 50 at a time to avoid rate limits
    
    console.log(`Found ${books.length} books without images`);
    
    if (books.length === 0) {
      console.log('No books to process');
      return;
    }
    
    // Process each book
    let successCount = 0;
    let failureCount = 0;
    
    for (const book of books) {
      const success = await processBook(book);
      if (success) {
        successCount++;
      } else {
        failureCount++;
      }
    }
    
    // Count remaining unprocessed books
    const remainingCount = await Resource.countDocuments({
      type: 'book',
      $or: [
        { imageUrl: { $exists: false } },
        { imageUrl: null },
        { imageUrl: '' }
      ],
      imageProcessed: { $ne: true }
    });
    
    console.log('\nProcess completed!');
    console.log(`Successfully processed: ${successCount}`);
    console.log(`Failed: ${failureCount}`);
    console.log(`Remaining unprocessed books: ${remainingCount}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the main function
main();
