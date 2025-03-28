/**
 * Check API Response for Book Resources
 * This script simulates an API call to check what data is being returned
 */

const express = require('express');
const mongoose = require('mongoose');
const Resource = require('../models/resource');
require('dotenv').config();

async function checkApiResponse() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Get the books that were shown in the screenshot
    const bookTitles = ['The Light That I Am', 'The Open Secret'];
    
    for (const title of bookTitles) {
      const book = await Resource.findOne({ title, type: 'book' });
      
      if (book) {
        console.log(`\nBook: ${book.title}`);
        console.log(`Image URL: ${book.imageUrl || 'None'}`);
        console.log(`Slug: ${book.slug}`);
        
        // Check if the image URL is valid
        if (book.imageUrl) {
          try {
            const fetch = require('node-fetch');
            const response = await fetch(book.imageUrl, { method: 'HEAD' });
            console.log(`Image status: ${response.status} ${response.statusText}`);
            
            // Check content type
            const contentType = response.headers.get('content-type');
            console.log(`Content type: ${contentType}`);
          } catch (error) {
            console.error(`Error checking image: ${error.message}`);
          }
        }
      } else {
        console.log(`Book not found: ${title}`);
      }
    }
    
    // Get a sample of the API response for books
    const books = await Resource.find({ type: 'book' })
      .limit(5)
      .select('title slug imageUrl type');
    
    console.log('\nSample API response:');
    console.log(JSON.stringify(books, null, 2));
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the database connection
    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the function
checkApiResponse();
