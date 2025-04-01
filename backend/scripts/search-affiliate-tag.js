/**
 * Search for Amazon Affiliate Tag
 * 
 * This script searches for the 'craftandgifts-20' affiliate tag in all book resources
 * to identify where the correct affiliate links are stored.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function searchAffiliateTag() {
  try {
    console.log('Searching for affiliate tag "craftandgifts-20"...');
    
    // Get all book resources
    const books = await Resource.find({ type: 'book' });
    console.log(`Found ${books.length} books to search`);
    
    let foundCount = 0;
    const foundLocations = new Set();
    
    for (const book of books) {
      console.log(`\nSearching in book: ${book.title}`);
      
      // Convert the book to a plain object for easier searching
      const bookObj = book.toObject();
      
      // Search function to recursively look through all object properties
      function searchInObject(obj, path = '') {
        if (!obj || typeof obj !== 'object') return;
        
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key;
          
          // Check if the value is a string and contains the affiliate tag
          if (typeof value === 'string' && value.includes('craftandgifts-20')) {
            console.log(`  Found affiliate tag in ${currentPath}: ${value}`);
            foundCount++;
            foundLocations.add(currentPath);
          }
          // If the value is an array or object, search recursively
          else if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
              // For arrays, include the index in the path
              value.forEach((item, index) => {
                if (typeof item === 'string' && item.includes('craftandgifts-20')) {
                  console.log(`  Found affiliate tag in ${currentPath}[${index}]: ${item}`);
                  foundCount++;
                  foundLocations.add(`${currentPath}[index]`);
                } else if (typeof item === 'object' && item !== null) {
                  searchInObject(item, `${currentPath}[${index}]`);
                }
              });
            } else {
              // For objects, continue searching recursively
              searchInObject(value, currentPath);
            }
          }
        }
      }
      
      // Start the search
      searchInObject(bookObj);
    }
    
    console.log('\nSearch complete.');
    console.log(`Found ${foundCount} instances of the affiliate tag.`);
    console.log(`Locations where the tag was found: ${Array.from(foundLocations).join(', ') || 'None'}`);
    
    // If no instances were found, search for any Amazon links
    if (foundCount === 0) {
      console.log('\nNo affiliate tags found. Searching for any Amazon links...');
      
      const amazonLocations = new Set();
      let amazonCount = 0;
      
      for (const book of books) {
        const bookObj = book.toObject();
        
        function searchForAmazon(obj, path = '') {
          if (!obj || typeof obj !== 'object') return;
          
          for (const [key, value] of Object.entries(obj)) {
            const currentPath = path ? `${path}.${key}` : key;
            
            if (typeof value === 'string' && value.includes('amazon.com')) {
              console.log(`  Found Amazon link in ${currentPath}: ${value}`);
              amazonCount++;
              amazonLocations.add(currentPath);
            }
            else if (typeof value === 'object' && value !== null) {
              if (Array.isArray(value)) {
                value.forEach((item, index) => {
                  if (typeof item === 'string' && item.includes('amazon.com')) {
                    console.log(`  Found Amazon link in ${currentPath}[${index}]: ${item}`);
                    amazonCount++;
                    amazonLocations.add(`${currentPath}[index]`);
                  } else if (typeof item === 'object' && item !== null) {
                    searchForAmazon(item, `${currentPath}[${index}]`);
                  }
                });
              } else {
                searchForAmazon(value, currentPath);
              }
            }
          }
        }
        
        searchForAmazon(bookObj);
      }
      
      console.log(`\nFound ${amazonCount} Amazon links.`);
      console.log(`Locations where Amazon links were found: ${Array.from(amazonLocations).join(', ') || 'None'}`);
    }
    
  } catch (error) {
    console.error('Error during search:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Run the search
searchAffiliateTag();
