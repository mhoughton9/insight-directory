/**
 * Utility functions for handling resource dates consistently
 */

/**
 * Gets the appropriate display label for a resource date based on type
 * @param {string} resourceType - The type of resource
 * @returns {string} - The label to use for the date
 */
export function getDateLabel(resourceType) {
  switch (resourceType) {
    case 'book':
      return 'Published';
    case 'podcast':
      return 'Active';
    case 'videoChannel':
      return 'Started';
    case 'website':
      return 'Launched';
    case 'blog':
      return 'Started';
    case 'practice':
      return 'Originated';
    case 'retreatCenter':
      return 'Established';
    case 'app':
      return 'Released';
    default:
      return 'Published';
  }
}

/**
 * Formats a date range for display
 * @param {Object} dateRange - The date range object with start, end, and active properties
 * @returns {string} - Formatted date range string
 */
export function formatDateRange(dateRange) {
  if (!dateRange || !dateRange.start) return '';
  
  const startYear = dateRange.start.getFullYear();
  
  if (dateRange.end) {
    const endYear = dateRange.end.getFullYear();
    return `${startYear} - ${endYear}`;
  } else if (dateRange.active === false) {
    return `${startYear} (Inactive)`;
  } else {
    return `${startYear} - Present`;
  }
}

/**
 * Gets a formatted date string from a resource
 * @param {Object} resource - The resource object
 * @returns {string} - Formatted date string
 */
export function getResourceDateDisplay(resource) {
  if (!resource) return '';
  
  // For resources with date ranges (podcasts, etc.)
  if (resource.type === 'podcast' && resource.dateRange && resource.dateRange.start) {
    return formatDateRange(resource.dateRange);
  }
  
  // For resources with a specific published date
  if (resource.publishedDate) {
    // Use the virtual formattedDate if available
    if (resource.formattedDate) return resource.formattedDate;
    
    // Otherwise format the date
    const date = new Date(resource.publishedDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Fallbacks for type-specific date fields
  if (resource.type === 'book' && resource.bookDetails?.yearPublished) {
    return resource.bookDetails.yearPublished.toString();
  }
  
  if (resource.type === 'podcast' && resource.podcastDetails?.datesActive) {
    return resource.podcastDetails.datesActive;
  }
  
  return '';
}
