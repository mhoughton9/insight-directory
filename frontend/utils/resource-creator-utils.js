/**
 * Utility functions for handling resource creator display
 */

/**
 * Returns the appropriate label for the creator field based on resource type
 * @param {string} resourceType - The type of resource
 * @returns {string} - The display label for the creator field
 */
export const getCreatorLabel = (resourceType) => {
  if (!resourceType) return 'Creator';
  
  switch (resourceType.toLowerCase()) {
    case 'book':
      return 'Author';
    case 'podcast':
      return 'Host';
    case 'videochannel':
      return 'Creator';
    case 'app':
      return 'Developer';
    case 'website':
      return 'Creator';
    case 'blog':
      return 'Author';
    case 'practice':
      return 'Source';
    case 'retreatcenter':
      return 'Founded by';
    default:
      return 'Creator';
  }
};

/**
 * Returns the appropriate label for the creator field in plural form
 * @param {string} resourceType - The type of resource
 * @returns {string} - The plural display label for the creator field
 */
export const getCreatorLabelPlural = (resourceType) => {
  if (!resourceType) return 'Creators';
  
  switch (resourceType.toLowerCase()) {
    case 'book':
      return 'Authors';
    case 'podcast':
      return 'Hosts';
    case 'videochannel':
      return 'Creators';
    case 'app':
      return 'Developers';
    case 'website':
      return 'Creators';
    case 'blog':
      return 'Authors';
    case 'practice':
      return 'Sources';
    case 'retreatcenter':
      return 'Founded by';
    default:
      return 'Creators';
  }
};

/**
 * Gets the creator value from a resource, handling both the standardized top-level
 * creator field and legacy type-specific creator fields
 * @param {Object} resource - The resource object
 * @returns {Array<string>} - Array of creator names
 */
export const getResourceCreators = (resource) => {
  if (!resource) return [];
  
  // Use the standardized creator field if available
  if (resource.creator && Array.isArray(resource.creator) && resource.creator.length > 0) {
    return resource.creator;
  }
  
  // Fall back to type-specific fields for backward compatibility
  const type = resource.type?.toLowerCase();
  
  switch (type) {
    case 'book':
      return Array.isArray(resource.bookDetails?.author) 
        ? resource.bookDetails.author 
        : (resource.bookDetails?.author ? [resource.bookDetails.author] : []);
    case 'podcast':
      return Array.isArray(resource.podcastDetails?.hosts) 
        ? resource.podcastDetails.hosts 
        : (resource.podcastDetails?.hosts ? [resource.podcastDetails.hosts] : []);
    case 'videochannel':
      return resource.videoChannelDetails?.creator ? [resource.videoChannelDetails.creator] : [];
    case 'website':
      return resource.websiteDetails?.creator ? [resource.websiteDetails.creator] : [];
    case 'blog':
      return resource.blogDetails?.author ? [resource.blogDetails.author] : [];
    case 'practice':
      return resource.practiceDetails?.source ? [resource.practiceDetails.source] : [];
    case 'app':
      return resource.appDetails?.creator ? [resource.appDetails.creator] : [];
    default:
      return [];
  }
};
