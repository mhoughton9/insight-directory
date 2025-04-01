/**
 * Migrate Blog Resources
 * 
 * This script updates existing blog resources to match the standardized schema:
 * 1. Converts blogDetails.author from string to array
 * 2. Moves blogDetails.link to blogDetails.links array
 * 3. Sets up dateRange for blogs
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

// Helper function to split author string into array
function splitAuthorString(authorString) {
  if (!authorString) return [];
  
  // Split by common separators (and, &, comma)
  return authorString
    .split(/(?:,\s*|\s+and\s+|\s*&\s*)/)
    .map(name => name.trim())
    .filter(name => name.length > 0);
}

async function migrateBlogs() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all blog resources
    const blogs = await Resource.find({ type: 'blog' });
    console.log(`Found ${blogs.length} blogs to migrate`);
    
    if (blogs.length === 0) {
      console.log('No blogs found. Nothing to migrate.');
      return;
    }
    
    let updatedCount = 0;
    
    for (const blog of blogs) {
      console.log(`\nProcessing: ${blog.title}`);
      let modified = false;
      
      // 1. Handle author field conversion
      if (blog.blogDetails && typeof blog.blogDetails.author === 'string') {
        const authorString = blog.blogDetails.author;
        console.log(`  Converting author string to array: "${authorString}"`);
        
        const authorArray = splitAuthorString(authorString);
        blog.blogDetails.author = authorArray;
        blog.creator = authorArray;
        
        console.log(`  u2713 Author converted to: ${JSON.stringify(authorArray)}`);
        modified = true;
      }
      
      // 2. Handle link field migration
      if (blog.blogDetails && blog.blogDetails.link) {
        const link = blog.blogDetails.link;
        console.log(`  Moving link to links array: ${link}`);
        
        // Initialize links array if it doesn't exist
        if (!blog.blogDetails.links) {
          blog.blogDetails.links = [];
        }
        
        // Check if the link already exists in the links array
        const linkExists = blog.blogDetails.links.some(l => l.url === link);
        
        if (!linkExists) {
          blog.blogDetails.links.push({
            url: link,
            label: 'Blog'
          });
          console.log(`  u2713 Added link to links array`);
          modified = true;
        } else {
          console.log(`  Link already exists in links array`);
        }
      }
      
      // 3. Set up dateRange if it doesn't exist
      if (!blog.dateRange) {
        console.log(`  Setting up dateRange`);
        blog.dateRange = { active: true };
        console.log(`  u2713 Added dateRange with active: true`);
        modified = true;
      }
      
      // Save changes if modified
      if (modified) {
        await blog.save();
        console.log(`  u2713 Saved changes to ${blog.title}`);
        updatedCount++;
      } else {
        console.log(`  No changes needed for ${blog.title}`);
      }
    }
    
    console.log(`\nMigration complete. Updated ${updatedCount} of ${blogs.length} blogs.`);
  } catch (error) {
    console.error('Error migrating blogs:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the migration
migrateBlogs();
