/**
 * Generic script to import resources from JSON files
 * Run with: node scripts/migrations/import-resources.js <resource-type> [filename]
 * Example: node scripts/migrations/import-resources.js books
 * Example with specific file: node scripts/migrations/import-resources.js books book-resources-batch-2-part1.json
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Resource = require('../../models/resource');
require('dotenv').config();

// Get resource type from command line arguments
const resourceType = process.argv[2];
const specificFile = process.argv[3]; // Optional specific filename

if (!resourceType) {
  console.error('Please specify a resource type');
  console.error('Usage: node scripts/migrations/import-resources.js <resource-type> [filename]');
  console.error('Example: node scripts/migrations/import-resources.js books');
  console.error('Example with specific file: node scripts/migrations/import-resources.js books book-resources-batch-2-part1.json');
  process.exit(1);
}

// Map folder names to resource types in the database
const resourceTypeMap = {
  'books': 'book',
  'video_channel': 'videoChannel',
  'podcast': 'podcast',
  'website': 'website',
  'blog': 'blog',
  'practice': 'practice',
  'app': 'app',
  'retreat_center': 'retreatCenter'
};

// Get the correct resource type for the database
const dbResourceType = resourceTypeMap[resourceType] || resourceType;

// Path to the JSON file - try different filename patterns
let JSON_FILE_PATH = '';

// If a specific file was provided, use it directly
if (specificFile) {
  JSON_FILE_PATH = path.join(__dirname, `../../data/resources/${resourceType}/${specificFile}`);
  
  if (!fs.existsSync(JSON_FILE_PATH)) {
    console.error(`Specified file not found: ${JSON_FILE_PATH}`);
    process.exit(1);
  }
} else {
  // Otherwise try different filename patterns
  const possiblePaths = [
    path.join(__dirname, `../../data/resources/${resourceType}/updated-${resourceType}-resources.json`),
    path.join(__dirname, `../../data/resources/${resourceType}/updated-book-resources.json`), // For books specifically
    path.join(__dirname, `../../data/resources/${resourceType}/${resourceType}-resources-sample.json`),
    path.join(__dirname, `../../data/resources/${resourceType}/book-resources-sample.json`) // For books specifically
  ];

  // Find the first file that exists
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      JSON_FILE_PATH = filePath;
      break;
    }
  }

  // Check if any file was found
  if (!JSON_FILE_PATH) {
    console.error(`No resource file found in ${path.join(__dirname, `../../data/resources/${resourceType}/`)}`);
    console.error('Please make sure one of these files exists:');
    possiblePaths.forEach(p => console.error(`- ${p}`));
    process.exit(1);
  }
}

console.log(`Using resource file: ${JSON_FILE_PATH}`);

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
 * Map resource data to the correct schema based on type
 * @param {Object} resource - The resource data from JSON
 * @param {string} type - The resource type
 * @param {string} slug - The generated slug
 * @returns {Object} - The mapped resource data
 */
function mapResourceData(resource, type, slug) {
  // Base resource data common to all types
  const baseData = {
    title: resource.title,
    description: resource.description,
    type: type,
    url: resource.url,
    tags: resource.tags || [],
    slug: slug
  };
  
  // Add publishedDate if available
  if (resource[`${type}Details`] && resource[`${type}Details`].publishedDate) {
    baseData.publishedDate = new Date(resource[`${type}Details`].publishedDate);
  }
  
  // Add type-specific details
  switch (type) {
    case 'book':
      baseData.bookDetails = {
        author: resource.bookDetails.authors,
        yearPublished: resource.bookDetails.publishedDate ? 
          new Date(resource.bookDetails.publishedDate).getFullYear() : null,
        pages: resource.bookDetails.pages,
        publisher: resource.bookDetails.publisher,
        links: resource.url ? [resource.url] : []
      };
      break;
      
    case 'videoChannel':
      baseData.videoChannelDetails = {
        channelName: resource.videoChannelDetails?.channelName,
        creator: resource.videoChannelDetails?.creator,
        keyTopics: resource.videoChannelDetails?.keyTopics || [],
        links: resource.videoChannelDetails?.links || []
      };
      break;
      
    case 'podcast':
      baseData.podcastDetails = {
        podcastName: resource.podcastDetails?.podcastName,
        hosts: resource.podcastDetails?.hosts || [],
        datesActive: resource.podcastDetails?.datesActive,
        episodeCount: resource.podcastDetails?.episodeCount,
        notableGuests: resource.podcastDetails?.notableGuests || [],
        links: resource.podcastDetails?.links || []
      };
      break;
      
    case 'website':
      baseData.websiteDetails = {
        websiteName: resource.websiteDetails?.websiteName,
        creator: resource.websiteDetails?.creator,
        primaryContentTypes: resource.websiteDetails?.primaryContentTypes || [],
        link: resource.websiteDetails?.link
      };
      break;
      
    case 'blog':
      baseData.blogDetails = {
        name: resource.blogDetails?.name,
        author: resource.blogDetails?.author,
        frequency: resource.blogDetails?.frequency,
        link: resource.blogDetails?.link
      };
      break;
      
    case 'practice':
      baseData.practiceDetails = {
        name: resource.practiceDetails?.name,
        instructions: resource.practiceDetails?.instructions,
        source: resource.practiceDetails?.source,
        duration: resource.practiceDetails?.duration,
        difficulty: resource.practiceDetails?.difficulty,
        technique: resource.practiceDetails?.technique,
        benefits: resource.practiceDetails?.benefits || []
      };
      break;
      
    case 'app':
      baseData.appDetails = {
        appName: resource.appDetails?.appName,
        creator: resource.appDetails?.creator,
        platforms: resource.appDetails?.platforms || [],
        price: resource.appDetails?.price,
        teachers: resource.appDetails?.teachers || [],
        features: resource.appDetails?.features || [],
        links: resource.appDetails?.links || []
      };
      break;
      
    case 'retreatCenter':
      baseData.retreatCenterDetails = {
        name: resource.retreatCenterDetails?.name,
        location: resource.retreatCenterDetails?.location,
        retreatTypes: resource.retreatCenterDetails?.retreatTypes || [],
        links: resource.retreatCenterDetails?.links || [],
        upcomingDates: resource.retreatCenterDetails?.upcomingDates || []
      };
      break;
  }
  
  return baseData;
}

/**
 * Import resources from JSON file
 */
async function importResources() {
  try {
    // Read and parse the JSON file
    const jsonData = fs.readFileSync(JSON_FILE_PATH, 'utf8');
    const resources = JSON.parse(jsonData);
    
    console.log(`Found ${resources.length} ${resourceType} to import`);
    
    // Track results
    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: []
    };
    
    // Process each resource
    for (const resource of resources) {
      try {
        // Generate the basic slug from title
        const baseSlug = generateSlug(resource.title);
        
        // Check if any resource with this slug exists (regardless of type)
        const existingResource = await Resource.findOne({ slug: baseSlug });
        
        let slug = baseSlug;
        
        // If a resource with this slug exists and it's not the same type,
        // create a type-prefixed slug to avoid conflicts
        if (existingResource && existingResource.type !== dbResourceType) {
          slug = `${dbResourceType}-${baseSlug}`;
          console.log(`Slug conflict detected for "${resource.title}". Using prefixed slug: ${slug}`);
          
          // Check if even the prefixed slug exists
          const existingPrefixedResource = await Resource.findOne({ slug: slug });
          if (existingPrefixedResource) {
            console.log(`Resource with prefixed slug "${slug}" already exists, skipping...`);
            results.skipped++;
            continue;
          }
        } else if (existingResource && existingResource.type === dbResourceType) {
          // If a resource with same slug and same type exists, it's a duplicate
          console.log(`Resource "${resource.title}" already exists with same type, skipping...`);
          results.skipped++;
          continue;
        }
        
        // Map resource data to Resource schema
        const resourceData = mapResourceData(resource, dbResourceType, slug);
        
        // Create and save the new resource
        const newResource = new Resource(resourceData);
        await newResource.save();
        
        console.log(`Successfully imported: ${resource.title}`);
        results.success++;
        
      } catch (err) {
        console.error(`Error importing resource "${resource.title}": ${err.message}`);
        results.failed++;
        results.errors.push({
          title: resource.title,
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
    console.error('Failed to import resources:', err);
  } finally {
    // Close the database connection
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the import function
importResources();
