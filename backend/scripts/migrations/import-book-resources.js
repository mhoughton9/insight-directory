/**
 * Script to import book resources from JSON file
 * Run with: node scripts/migrations/import-book-resources.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Resource = require('../../models/resource');
require('dotenv').config();

// Path to the JSON file
const JSON_FILE_PATH = path.join(__dirname, '../../data/resources/books/updated-book-resources.json');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

/**
 * Generate a slug from a title
 * @param {string} title - The title to convert to a slug
 * @returns {string} - The generated slug
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Import books from JSON file
 */
async function importBookResources() {
  try {
    // Read and parse the JSON file
    const jsonData = fs.readFileSync(JSON_FILE_PATH, 'utf8');
    const books = JSON.parse(jsonData);
    
    console.log(`Found ${books.length} books to import`);
    
    // Track results
    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: []
    };
    
    // Process each book
    for (const book of books) {
      try {
        // Generate slug from title
        const slug = generateSlug(book.title);
        
        // Check if book already exists by slug
        const existingBook = await Resource.findOne({ 
          slug: slug,
          type: 'book'
        });
        
        if (existingBook) {
          console.log(`Book "${book.title}" already exists, skipping...`);
          results.skipped++;
          continue;
        }
        
        // Map book data to Resource schema
        const resourceData = {
          title: book.title,
          description: book.description,
          type: book.type,
          url: book.url,
          publishedDate: new Date(book.bookDetails.publishedDate),
          tags: book.tags || [],
          slug: slug, // Explicitly set the slug
          
          // Map book-specific details
          bookDetails: {
            author: book.bookDetails.authors,
            yearPublished: new Date(book.bookDetails.publishedDate).getFullYear(),
            pages: book.bookDetails.pages,
            publisher: book.bookDetails.publisher,
            links: book.url ? [book.url] : []
          }
        };
        
        // Create and save the new resource
        const newResource = new Resource(resourceData);
        await newResource.save();
        
        console.log(`Successfully imported: ${book.title}`);
        results.success++;
        
      } catch (err) {
        console.error(`Error importing book "${book.title}": ${err.message}`);
        results.failed++;
        results.errors.push({
          title: book.title,
          error: err.message
        });
      }
    }
    
    // Log final results
    console.log('\nImport completed!');
    console.log(`Successfully imported: ${results.success}`);
    console.log(`Skipped (already exists): ${results.skipped}`);
    console.log(`Failed: ${results.failed}`);
    
    if (results.errors.length > 0) {
      console.log('\nErrors:');
      results.errors.forEach(err => {
        console.log(`- ${err.title}: ${err.error}`);
      });
    }
    
  } catch (err) {
    console.error('Failed to import books:', err);
  } finally {
    // Close the database connection
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the import function
importBookResources();
