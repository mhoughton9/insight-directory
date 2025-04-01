/**
 * Utility functions for handling resource names/titles consistently
 */

/**
 * Gets the appropriate display label for a resource title based on type
 * @param {string} resourceType - The type of resource
 * @returns {string} - The label to use for the title
 */
export function getTitleLabel(resourceType) {
  switch (resourceType) {
    case 'book':
      return 'Title';
    case 'podcast':
      return 'Podcast Name';
    case 'videoChannel':
      return 'Channel Name';
    case 'website':
      return 'Website Name';
    case 'blog':
      return 'Blog Name';
    case 'practice':
      return 'Practice Name';
    case 'retreatCenter':
      return 'Center Name';
    case 'app':
      return 'App Name';
    default:
      return 'Title';
  }
}

/**
 * Gets the resource title, ensuring backward compatibility with type-specific name fields
 * @param {Object} resource - The resource object
 * @returns {string} - The resource title
 */
export function getResourceTitle(resource) {
  // Always prefer the standardized title field
  if (resource.title) {
    return resource.title;
  }
  
  // Fallback to type-specific name fields for backward compatibility
  const type = resource.type;
  
  switch (type) {
    case 'podcast':
      return resource.podcastDetails?.podcastName || '';
    case 'website':
      return resource.websiteDetails?.websiteName || '';
    case 'blog':
      return resource.blogDetails?.name || '';
    case 'retreatCenter':
      return resource.retreatCenterDetails?.name || '';
    case 'practice':
      return resource.practiceDetails?.name || '';
    case 'app':
      return resource.appDetails?.appName || '';
    default:
      return '';
  }
}
