/**
 * Verify Blog Standardization
 * 
 * This script verifies that the blog standardization changes are working correctly.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

async function verifyBlogStandardization() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all blog resources
    const blogs = await Resource.find({ type: 'blog' });
    console.log(`Found ${blogs.length} blogs`);
    
    if (blogs.length === 0) {
      console.log('No blogs found. Nothing to verify.');
      return;
    }
    
    // Test the middleware by updating one blog
    const testBlog = blogs[0];
    console.log(`\nTesting middleware on: ${testBlog.title}`);
    
    // Print current values
    console.log(`  Current creator: ${JSON.stringify(testBlog.creator)}`);
    console.log(`  Current blogDetails.author: ${JSON.stringify(testBlog.blogDetails?.author)}`);
    console.log(`  Current blogDetails.frequency: ${testBlog.blogDetails?.frequency}`);
    console.log(`  Current blogDetails.links: ${JSON.stringify(testBlog.blogDetails?.links)}`);
    
    // Update the creator field
    const newCreator = ['Test Author 1', 'Test Author 2'];
    testBlog.creator = newCreator;
    
    // Save the blog to trigger middleware
    await testBlog.save();
    
    // Reload the blog
    const updatedBlog = await Resource.findById(testBlog._id);
    
    // Check if the blogDetails.author field was updated
    console.log(`  Updated creator: ${JSON.stringify(updatedBlog.creator)}`);
    console.log(`  Updated blogDetails.author: ${JSON.stringify(updatedBlog.blogDetails?.author)}`);
    
    if (JSON.stringify(updatedBlog.creator) === JSON.stringify(updatedBlog.blogDetails?.author)) {
      console.log(`  u2713 Middleware successfully synchronized creator fields`);
    } else {
      console.log(`  u2717 Middleware failed to synchronize creator fields`);
    }
    
    // Test link to links array conversion
    console.log('\nTesting link to links array conversion:');
    console.log(`  blogDetails.link: ${updatedBlog.blogDetails?.link}`);
    console.log(`  blogDetails.links: ${JSON.stringify(updatedBlog.blogDetails?.links)}`);
    
    const linkUrl = updatedBlog.blogDetails?.link;
    if (linkUrl && updatedBlog.blogDetails?.links?.some(link => link.url === linkUrl)) {
      console.log(`  u2713 Link successfully added to links array`);
    } else if (!linkUrl) {
      console.log(`  No link field to convert`);
    } else {
      console.log(`  u2717 Link not added to links array`);
    }
    
    // Check dateRange
    console.log('\nChecking dateRange:');
    console.log(`  dateRange: ${JSON.stringify(updatedBlog.dateRange)}`);
    
    if (updatedBlog.dateRange && updatedBlog.dateRange.active === true) {
      console.log(`  u2713 dateRange properly set with active: true`);
    } else {
      console.log(`  u2717 dateRange not properly set`);
    }
    
    // Check frequency field
    console.log('\nChecking frequency field:');
    console.log(`  frequency: ${updatedBlog.blogDetails?.frequency}`);
    
    if (updatedBlog.blogDetails?.frequency) {
      console.log(`  u2713 frequency field is set to: ${updatedBlog.blogDetails.frequency}`);
    } else {
      console.log(`  u2717 frequency field not set`);
    }
    
    // Restore original values
    updatedBlog.creator = testBlog.creator;
    await updatedBlog.save();
    console.log(`  Restored original values`);
    
    // Examine all blogs
    console.log('\nExamining all blogs:');
    
    for (const blog of blogs) {
      console.log(`\nBlog: ${blog.title}`);
      console.log(`  Creator: ${JSON.stringify(blog.creator)}`);
      console.log(`  blogDetails.author: ${JSON.stringify(blog.blogDetails?.author)}`);
      console.log(`  blogDetails.name: ${blog.blogDetails?.name}`);
      console.log(`  Title: ${blog.title}`);
      console.log(`  blogDetails.frequency: ${blog.blogDetails?.frequency}`);
      console.log(`  dateRange: ${JSON.stringify(blog.dateRange)}`);
      
      // Check links format
      if (blog.blogDetails?.links && blog.blogDetails.links.length > 0) {
        console.log(`  Links: ${JSON.stringify(blog.blogDetails.links)}`);
      } else {
        console.log(`  No links found`);
      }
    }
    
    console.log('\nVerification complete.');
  } catch (error) {
    console.error('Error verifying blog standardization:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the verification
verifyBlogStandardization();
