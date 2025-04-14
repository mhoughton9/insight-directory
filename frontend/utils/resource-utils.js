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
    case 'blog':
    case 'blogarticle':
    case 'blogarticles':
    case 'blogs':
      return 'blog';
    case 'video':
    case 'videochannel':
    case 'videochannels':
    case 'videos':
    case 'video channel':
    case 'video channels':
      return 'videoChannel'; 
    case 'podcasts':
      return 'podcast';
    case 'practices':
      return 'practice';
    case 'retreat':
    case 'retreatcenter':
    case 'retreatcenters':
    case 'retreats':
    case 'retreat center':
    case 'retreat centers':
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
 * Gets the plural form of a resource type for display
 * @param {string} type - The resource type to format in plural
 * @returns {string} Plural formatted resource type for display
 */
export const getPluralResourceType = (type) => {
  if (!type) return '';
  
  // First get the singular formatted type
  const formattedType = formatResourceType(type);
  
  // Convert to plural form
  switch (formattedType) {
    case 'Book':
      return 'Books';
    case 'Blog':
      return 'Blogs';
    case 'Video Channel':
      return 'Video Channels';
    case 'Podcast':
      return 'Podcasts';
    case 'Practice':
      return 'Practices';
    case 'Retreat Center':
      return 'Retreat Centers';
    case 'Website':
      return 'Websites';
    case 'App':
      return 'Apps';
    default:
      // Simple pluralization for unknown types (add 's')
      return `${formattedType}s`;
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
      // For Books: Author and Year published
      if (resource.bookDetails?.author) {
        const author = Array.isArray(resource.bookDetails.author) ? 
          resource.bookDetails.author.join(', ') : 
          resource.bookDetails.author;
        
        return resource.bookDetails.yearPublished ? 
          `${author}, ${resource.bookDetails.yearPublished}` : 
          author;
      }
      return '';
    
    case 'podcast':
      // For Podcast: Hosts
      if (resource.podcastDetails?.hosts) {
        return Array.isArray(resource.podcastDetails.hosts) ? 
          resource.podcastDetails.hosts.join(', ') : 
          resource.podcastDetails.hosts;
      }
      return '';
    
    case 'videoChannel':
      // For Video Channel: Creator
      return resource.videoChannelDetails?.creator || '';
    
    case 'website':
      // For Website: Leave as is (minimal info)
      return '';
    
    case 'blog':
      // For Blog: Author
      return resource.blogDetails?.author || '';
    
    case 'practice':
      // For Practice: Leave as is (minimal info)
      return '';
    
    case 'retreatCenter':
      // For Retreat Center: Location
      return resource.retreatCenterDetails?.location || '';
    
    case 'app':
      // For App: Creator
      return resource.appDetails?.creator || '';
    
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
