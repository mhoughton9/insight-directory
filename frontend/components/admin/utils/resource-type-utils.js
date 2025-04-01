/**
 * Utility functions for handling resource types and their specific fields
 */

// List of all resource types
export const RESOURCE_TYPES = [
  'book',
  'videoChannel',
  'podcast',
  'website',
  'blog',
  'practice',
  'app',
  'retreatCenter'
];

/**
 * Format a resource type for display
 * @param {string} type - The resource type
 * @returns {string} - Formatted resource type
 */
export const formatResourceType = (type) => {
  if (!type) return '';
  
  // Handle camelCase to title case conversion
  return type
    // Insert a space before all capital letters
    .replace(/([A-Z])/g, ' $1')
    // Capitalize the first letter and join the string
    .replace(/^./, (str) => str.toUpperCase())
    // Trim any leading spaces
    .trim();
};

/**
 * Get the title label for a resource type
 * @param {string} type - The resource type
 * @returns {string} - The appropriate title label
 */
export const getTitleLabel = (type) => {
  if (!type) return 'Title';
  
  switch (type) {
    case 'book':
      return 'Book Title';
    case 'videoChannel':
      return 'Channel Name';
    case 'podcast':
      return 'Podcast Name';
    case 'website':
      return 'Website Name';
    case 'blog':
      return 'Blog Name';
    case 'practice':
      return 'Practice Name';
    case 'app':
      return 'App Name';
    case 'retreatCenter':
      return 'Retreat Center Name';
    default:
      return 'Title';
  }
};

/**
 * Get the details path for a resource type
 * @param {string} type - The resource type
 * @returns {string} - The path to the details object
 */
export const getDetailsPath = (type) => {
  if (!type) return '';
  
  // Special cases for multi-word types
  if (type === 'videoChannel') return 'videoChannelDetails';
  if (type === 'retreatCenter') return 'retreatCenterDetails';
  
  // For single word types, just append 'Details'
  return `${type}Details`;
};

/**
 * Get configuration for a specific resource type
 * @param {string} type - The resource type
 * @returns {Object} - Configuration for the resource type
 */
export const getResourceTypeConfig = (type) => {
  const detailsPath = getDetailsPath(type);
  
  // Define field configurations for each resource type
  const configs = {
    book: {
      detailsPath,
      fields: [
        { name: 'yearPublished', label: 'Year Published', type: 'number' },
        { name: 'pages', label: 'Pages', type: 'number' },
        { name: 'publisher', label: 'Publisher', type: 'text' },
        { name: 'isbn', label: 'ISBN', type: 'text' }
      ]
    },
    videoChannel: {
      detailsPath,
      fields: [
        { name: 'keyTopics', label: 'Key Topics', type: 'text', isArray: true }
      ]
    },
    podcast: {
      detailsPath,
      fields: [
        { name: 'datesActive', label: 'Dates Active', type: 'text' },
        { name: 'episodeCount', label: 'Episode Count', type: 'number' },
        { name: 'notableGuests', label: 'Notable Guests', type: 'text', isArray: true }
      ]
    },
    website: {
      detailsPath,
      fields: [
        { name: 'primaryContentTypes', label: 'Primary Content Types', type: 'text', isArray: true }
      ]
    },
    blog: {
      detailsPath,
      fields: [
        { name: 'platform', label: 'Platform', type: 'text' },
        { name: 'frequency', label: 'Update Frequency', type: 'text' }
      ]
    },
    practice: {
      detailsPath,
      fields: [
        { name: 'duration', label: 'Duration', type: 'text' }
      ]
    },
    app: {
      detailsPath,
      fields: [
        { name: 'platforms', label: 'Platforms', type: 'text', isArray: true },
        { name: 'cost', label: 'Cost', type: 'text' }
      ]
    },
    retreatCenter: {
      detailsPath,
      fields: [
        { name: 'location', label: 'Location', type: 'text', required: true },
        { name: 'retreatTypes', label: 'Retreat Types', type: 'text', isArray: true },
        { name: 'upcomingDates', label: 'Upcoming Dates', type: 'text', isArray: true }
      ]
    }
  };
  
  // Return the config for the requested type, or a default if not found
  return configs[type] || {
    detailsPath,
    fields: []
  };
};
