/**
 * Examine Blog Resources
 * 
 * This script examines blog resources to understand their current structure
 * and identify standardization opportunities.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function examineBlogs() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    console.log('Examining blog resources...');
    
    // Find all blog resources
    const blogs = await Resource.find({ type: 'blog' }).lean();
    console.log(`Found ${blogs.length} blogs in the database`);
    
    if (blogs.length === 0) {
      console.log('No blogs found. Nothing to examine.');
      return;
    }
    
    // Analyze the structure of blogs
    console.log('\nAnalyzing blog structure:');
    
    // Check for key fields
    let creatorCount = 0;
    let blogNameCount = 0;
    let blogCreatorCount = 0;
    let publishedDateCount = 0;
    let dateRangeCount = 0;
    
    for (const blog of blogs) {
      console.log(`\nBlog: ${blog.title}`);
      
      // Check top-level fields
      console.log(`  Top-level creator: ${blog.creator ? (Array.isArray(blog.creator) ? blog.creator.join(', ') : blog.creator) : 'Not set'}`);
      console.log(`  publishedDate: ${blog.publishedDate || 'Not set'}`);
      console.log(`  dateRange: ${blog.dateRange ? JSON.stringify(blog.dateRange) : 'Not set'}`);
      
      // Check blogDetails fields
      console.log(`  blogDetails.name: ${blog.blogDetails?.name || 'Not set'}`);
      console.log(`  blogDetails.author: ${blog.blogDetails?.author ? (Array.isArray(blog.blogDetails.author) ? blog.blogDetails.author.join(', ') : blog.blogDetails.author) : 'Not set'}`);
      console.log(`  blogDetails.platform: ${blog.blogDetails?.platform || 'Not set'}`);
      console.log(`  blogDetails.frequency: ${blog.blogDetails?.frequency || 'Not set'}`);
      
      // Check links format
      if (blog.blogDetails?.links && blog.blogDetails.links.length > 0) {
        console.log(`  Links:`);
        for (const link of blog.blogDetails.links) {
          if (typeof link === 'object' && link.url && link.label) {
            console.log(`    - ${link.label}: ${link.url}`);
          } else if (typeof link === 'object' && link.url) {
            console.log(`    - ${link.url} (missing label)`);
          } else if (typeof link === 'string') {
            console.log(`    - ${link} (string format, not object)`);
          } else {
            console.log(`    - Invalid link format: ${JSON.stringify(link)}`);
          }
        }
      } else {
        console.log(`  No links found`);
      }
      
      // Count occurrences of fields
      if (blog.creator && (Array.isArray(blog.creator) ? blog.creator.length > 0 : true)) creatorCount++;
      if (blog.blogDetails?.name) blogNameCount++;
      if (blog.blogDetails?.author) blogCreatorCount++;
      if (blog.publishedDate) publishedDateCount++;
      if (blog.dateRange && (blog.dateRange.start || blog.dateRange.end)) dateRangeCount++;
      
      // Print all fields for the first few blogs
      if (blogs.indexOf(blog) < 2) {
        console.log('  All fields:');
        console.log(JSON.stringify(blog, null, 2).split('\n').map(line => `    ${line}`).join('\n'));
      }
    }
    
    console.log('\nSummary:');
    console.log(`Total blogs: ${blogs.length}`);
    console.log(`Blogs with top-level creator: ${creatorCount}`);
    console.log(`Blogs with name: ${blogNameCount}`);
    console.log(`Blogs with blogDetails.author: ${blogCreatorCount}`);
    console.log(`Blogs with publishedDate: ${publishedDateCount}`);
    console.log(`Blogs with dateRange: ${dateRangeCount}`);
    
    // Identify standardization opportunities
    console.log('\nStandardization Opportunities:');
    
    if (blogNameCount > 0 && blogNameCount < blogs.length) {
      console.log('- Need to ensure all blogs have name synchronized with title');
    }
    
    if (blogCreatorCount > 0 && creatorCount !== blogCreatorCount) {
      console.log('- Need to synchronize top-level creator with blogDetails.author');
    }
    
    if (publishedDateCount === 0 && dateRangeCount === 0) {
      console.log('- Consider adding date information to blogs');
    }
    
    // Check for non-standard links
    let nonStandardLinksCount = 0;
    for (const blog of blogs) {
      if (blog.blogDetails?.links && blog.blogDetails.links.length > 0) {
        for (const link of blog.blogDetails.links) {
          if (typeof link === 'string' || (typeof link === 'object' && (!link.url || !link.label))) {
            nonStandardLinksCount++;
            break;
          }
        }
      }
    }
    
    if (nonStandardLinksCount > 0) {
      console.log(`- Need to standardize links format for ${nonStandardLinksCount} blogs`);
    }
    
    // Check if blogDetails.author is an array
    let stringAuthorCount = 0;
    for (const blog of blogs) {
      if (blog.blogDetails?.author && !Array.isArray(blog.blogDetails.author)) {
        stringAuthorCount++;
      }
    }
    
    if (stringAuthorCount > 0) {
      console.log(`- Need to convert blogDetails.author from string to array for ${stringAuthorCount} blogs`);
    }
  } catch (error) {
    console.error('Error examining blogs:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the examination
examineBlogs();
