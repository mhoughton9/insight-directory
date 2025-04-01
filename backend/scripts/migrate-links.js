/**
 * Migration Script: Convert URL fields to standardized links arrays
 * 
 * This script migrates resources from using various URL fields (url, websiteUrl, link)
 * to using standardized links arrays in each type-specific details object.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/resource');

// Connect to MongoDB with hardcoded connection string for this one-time migration
const MONGODB_URI = 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function migrateLinks() {
  try {
    console.log('Starting links migration...');
    
    // Get all resources
    const resources = await Resource.find({});
    console.log(`Found ${resources.length} resources to process`);
    
    let updatedCount = 0;
    
    for (const resource of resources) {
      let updated = false;
      
      // Handle top-level URL field
      if (resource.url) {
        // Determine which type-specific details to update
        const detailsField = `${resource.type}Details`;
        
        // Initialize details object if it doesn't exist
        if (!resource[detailsField]) {
          resource[detailsField] = {};
        }
        
        // Initialize links array if it doesn't exist
        if (!resource[detailsField].links) {
          resource[detailsField].links = [];
        }
        
        // Add URL to links array if it doesn't already exist
        const urlExists = resource[detailsField].links.some(link => 
          (typeof link === 'object' && link.url === resource.url) || 
          (typeof link === 'string' && link === resource.url)
        );
        
        if (!urlExists) {
          // Format depends on whether links is already an array of objects or strings
          if (resource[detailsField].links.length > 0 && typeof resource[detailsField].links[0] === 'object') {
            resource[detailsField].links.push({
              url: resource.url,
              label: 'Website'
            });
          } else if (resource[detailsField].links.length > 0 && typeof resource[detailsField].links[0] === 'string') {
            // Convert existing string links to objects
            const oldLinks = [...resource[detailsField].links];
            resource[detailsField].links = oldLinks.map(link => ({
              url: link,
              label: 'Link'
            }));
            
            // Add the new link
            resource[detailsField].links.push({
              url: resource.url,
              label: 'Website'
            });
          } else {
            // Empty array, just add the new link
            resource[detailsField].links.push({
              url: resource.url,
              label: 'Website'
            });
          }
          
          updated = true;
        }
        
        // Remove the top-level URL field
        resource.url = undefined;
        updated = true;
      }
      
      // Handle type-specific link fields
      if (resource.type === 'website' && resource.websiteDetails?.link) {
        // Initialize links array if it doesn't exist
        if (!resource.websiteDetails.links) {
          resource.websiteDetails.links = [];
        }
        
        // Add link to links array if it doesn't already exist
        const linkExists = resource.websiteDetails.links.some(link => 
          (typeof link === 'object' && link.url === resource.websiteDetails.link) || 
          (typeof link === 'string' && link === resource.websiteDetails.link)
        );
        
        if (!linkExists) {
          // Format depends on whether links is already an array of objects or strings
          if (resource.websiteDetails.links.length > 0 && typeof resource.websiteDetails.links[0] === 'object') {
            resource.websiteDetails.links.push({
              url: resource.websiteDetails.link,
              label: 'Website'
            });
          } else if (resource.websiteDetails.links.length > 0 && typeof resource.websiteDetails.links[0] === 'string') {
            // Convert existing string links to objects
            const oldLinks = [...resource.websiteDetails.links];
            resource.websiteDetails.links = oldLinks.map(link => ({
              url: link,
              label: 'Link'
            }));
            
            // Add the new link
            resource.websiteDetails.links.push({
              url: resource.websiteDetails.link,
              label: 'Website'
            });
          } else {
            // Empty array, just add the new link
            resource.websiteDetails.links.push({
              url: resource.websiteDetails.link,
              label: 'Website'
            });
          }
          
          updated = true;
        }
        
        // Remove the old link field
        resource.websiteDetails.link = undefined;
        updated = true;
      }
      
      // Handle blog link field
      if (resource.type === 'blog' && resource.blogDetails?.link) {
        // Initialize links array if it doesn't exist
        if (!resource.blogDetails.links) {
          resource.blogDetails.links = [];
        }
        
        // Add link to links array if it doesn't already exist
        const linkExists = resource.blogDetails.links.some(link => 
          (typeof link === 'object' && link.url === resource.blogDetails.link) || 
          (typeof link === 'string' && link === resource.blogDetails.link)
        );
        
        if (!linkExists) {
          // Format depends on whether links is already an array of objects or strings
          if (resource.blogDetails.links.length > 0 && typeof resource.blogDetails.links[0] === 'object') {
            resource.blogDetails.links.push({
              url: resource.blogDetails.link,
              label: 'Blog'
            });
          } else if (resource.blogDetails.links.length > 0 && typeof resource.blogDetails.links[0] === 'string') {
            // Convert existing string links to objects
            const oldLinks = [...resource.blogDetails.links];
            resource.blogDetails.links = oldLinks.map(link => ({
              url: link,
              label: 'Link'
            }));
            
            // Add the new link
            resource.blogDetails.links.push({
              url: resource.blogDetails.link,
              label: 'Blog'
            });
          } else {
            // Empty array, just add the new link
            resource.blogDetails.links.push({
              url: resource.blogDetails.link,
              label: 'Blog'
            });
          }
          
          updated = true;
        }
        
        // Remove the old link field
        resource.blogDetails.link = undefined;
        updated = true;
      }
      
      // Convert string links to object links for all resource types
      const detailsField = `${resource.type}Details`;
      if (resource[detailsField]?.links && Array.isArray(resource[detailsField].links)) {
        // Check if links contains string values
        const hasStringLinks = resource[detailsField].links.some(link => typeof link === 'string');
        
        if (hasStringLinks) {
          // Convert all string links to objects
          resource[detailsField].links = resource[detailsField].links.map(link => {
            if (typeof link === 'string') {
              return {
                url: link,
                label: 'Link'
              };
            }
            return link;
          });
          
          updated = true;
        }
      }
      
      // Save the resource if it was updated
      if (updated) {
        await resource.save();
        updatedCount++;
      }
    }
    
    console.log(`Migration complete. Updated ${updatedCount} resources.`);
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Run the migration
migrateLinks();
