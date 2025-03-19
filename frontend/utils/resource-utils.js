/**
 * Resource Utilities
 * Centralized utilities for handling resource types and formatting
 */

/**
 * Normalizes a resource type to a standard format
 * @param {string} type - The resource type to normalize
 * @returns {string} Normalized resource type
 */
export const normalizeResourceType = (type) => {
  if (!type) return '';
  
  // Convert to lowercase and trim
  const lowercaseType = type.toLowerCase().trim();
  
  // Handle plural forms and variations
  switch (lowercaseType) {
    case 'books':
      return 'book';
    case 'blogs':
    case 'blogarticle':
    case 'blogarticles':
      return 'blog';
    case 'videochannels':
    case 'videochannel':
    case 'videos':
    case 'video':
    case 'videochannel':
      return 'videoChannel'; 
    case 'podcasts':
      return 'podcast';
    case 'practices':
      return 'practice';
    case 'retreatcenters':
    case 'retreatcenter':
    case 'retreat':
    case 'retreats':
    case 'retreatcenter':
      return 'retreatCenter'; 
    case 'websites':
      return 'website';
    case 'apps':
      return 'app';
    default:
      return lowercaseType;
  }
};

/**
 * Formats a resource type for display
 * @param {string} type - The resource type to format
 * @returns {string} Formatted resource type for display
 */
export const formatResourceType = (type) => {
  if (!type) return '';
  
  // First normalize the type
  const normalizedType = normalizeResourceType(type);
  
  // Format for display
  switch (normalizedType) {
    case 'book':
      return 'Book';
    case 'blog':
      return 'Blog';
    case 'videoChannel':
      return 'Video Channel';
    case 'podcast':
      return 'Podcast';
    case 'practice':
      return 'Practice';
    case 'retreatCenter':
      return 'Retreat Center';
    case 'website':
      return 'Website';
    case 'app':
      return 'App';
    default:
      // Capitalize first letter of each word for unknown types
      return normalizedType.split(/(?=[A-Z])/).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
  }
};

/**
 * Gets the appropriate subtitle for a resource based on its type
 * @param {Object} resource - The resource object
 * @returns {string} Formatted subtitle
 */
export const getResourceSubtitle = (resource) => {
  if (!resource || !resource.type) return '';
  
  // Normalize type
  const normalizedType = normalizeResourceType(resource.type);
  
  switch (normalizedType) {
    case 'book':
      return resource.bookDetails?.author ? 
        `by ${Array.isArray(resource.bookDetails.author) ? resource.bookDetails.author.join(', ') : resource.bookDetails.author}${resource.bookDetails.yearPublished ? ` (${resource.bookDetails.yearPublished})` : ''}` : '';
    
    case 'podcast':
      return resource.podcastDetails?.hosts ? 
        `hosted by ${Array.isArray(resource.podcastDetails.hosts) ? resource.podcastDetails.hosts.join(', ') : resource.podcastDetails.hosts}` : '';
    
    case 'videoChannel':
      return resource.videoChannelDetails?.creator ? 
        `by ${resource.videoChannelDetails.creator}` : '';
    
    case 'website':
      return resource.websiteDetails?.creator ? 
        `by ${resource.websiteDetails.creator}` : '';
    
    case 'blog':
      return resource.blogDetails?.author ? 
        `by ${resource.blogDetails.author}` : '';
    
    case 'practice':
      return resource.practiceDetails?.source ? 
        `Source: ${resource.practiceDetails.source}` : '';
    
    case 'retreatCenter':
      return resource.retreatCenterDetails?.location ? 
        `Location: ${resource.retreatCenterDetails.location}` : '';
    
    case 'app':
      return resource.appDetails?.creator ? 
        `by ${resource.appDetails.creator}${resource.appDetails.price ? ` • ${resource.appDetails.price}` : ''}` : 
        (resource.appDetails?.price ? `${resource.appDetails.price}` : '');
    
    default:
      return '';
  }
};

/**
 * Gets the list of all valid resource types
 * @returns {Array<string>} Array of valid resource types
 */
export const getResourceTypes = () => [
  'book',
  'blog',
  'videoChannel',
  'podcast',
  'practice',
  'retreatCenter',
  'website',
  'app'
];

/**
 * Checks if a resource type is valid
 * @param {string} type - The resource type to check
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidResourceType = (type) => {
  if (!type) return false;
  return getResourceTypes().includes(normalizeResourceType(type));
};
