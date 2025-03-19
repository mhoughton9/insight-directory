/**
 * Utility functions for extracting and formatting resource data
 */
import { normalizeResourceType } from './resource-utils';

/**
 * Get type-specific details from a resource
 * @param {Object} resource - The resource object
 * @param {String} type - The resource type
 * @param {String} field - The field to extract
 * @returns {*} The extracted value or null
 */
export const getResourceDetail = (resource, type, field) => {
  if (!resource) return null;
  
  const detailsKey = `${type}Details`;
  
  if (resource[detailsKey] && resource[detailsKey][field] !== undefined) {
    return resource[detailsKey][field];
  }
  
  return null;
};

/**
 * Get links from a resource based on its type
 * @param {Object} resource - The resource object
 * @returns {Array} Array of links
 */
export const getResourceLinks = (resource) => {
  if (!resource) return [];
  
  const resourceType = normalizeResourceType(resource.type || 'unknown');
  const detailsKey = `${resourceType}Details`;
  
  // Default to resource.links if available
  let links = [];
  
  if (resource.links && Array.isArray(resource.links)) {
    links = [...resource.links];
  } else if (resource[detailsKey]?.links) {
    links = [...resource[detailsKey].links];
  } else if (resourceType === 'website' && resource[detailsKey]?.link) {
    links = [resource[detailsKey].link];
  } else if (resourceType === 'blog' && resource[detailsKey]?.link) {
    links = [resource[detailsKey].link];
  } else if (resource.url) {
    links = [resource.url];
  }
  
  // Sort links based on resource type
  if (links.length > 1) {
    if (resourceType === 'book') {
      // For books, prioritize Amazon links
      links.sort((a, b) => {
        if (a.includes('amazon')) return -1;
        if (b.includes('amazon')) return 1;
        return 0;
      });
    } else if (resourceType === 'podcast') {
      // For podcasts, prioritize Spotify and Apple Podcasts
      links.sort((a, b) => {
        if (a.includes('spotify')) return -1;
        if (b.includes('spotify')) return 1;
        if (a.includes('apple')) return -1;
        if (b.includes('apple')) return 1;
        return 0;
      });
    } else if (resourceType === 'app') {
      // For apps, prioritize App Store and Google Play
      links.sort((a, b) => {
        if (a.includes('apple')) return -1;
        if (b.includes('apple')) return 1;
        if (a.includes('play.google')) return -1;
        if (b.includes('play.google')) return 1;
        return 0;
      });
    }
  }
  
  return links;
};

/**
 * Get a user-friendly label for a link
 * @param {String} link - The URL
 * @returns {String} A user-friendly label
 */
export const getLinkLabel = (link) => {
  try {
    const url = new URL(link);
    const domain = url.hostname.replace('www.', '');
    
    if (domain.includes('amazon')) return 'Amazon';
    if (domain.includes('youtube')) return 'YouTube';
    if (domain.includes('spotify')) return 'Spotify';
    if (domain.includes('apple')) {
      if (url.pathname.includes('podcast')) return 'Apple Podcasts';
      if (url.pathname.includes('app')) return 'App Store';
      return 'Apple';
    }
    if (domain.includes('google')) {
      if (url.pathname.includes('play')) return 'Google Play';
      return 'Google';
    }
    
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch (e) {
    return link.length > 30 ? link.substring(0, 30) + '...' : link;
  }
};

/**
 * Get metadata fields for a specific resource type
 * @param {String} resourceType - The resource type
 * @returns {Array} Array of metadata field configurations
 */
export const getMetadataFields = (resourceType) => {
  // Normalize the resource type for consistent handling
  const normalizedType = normalizeResourceType(resourceType);
  const commonFields = [];
  
  const typeSpecificFields = {
    book: [
      {
        label: 'Author',
        value: (resource) => {
          const authors = getResourceDetail(resource, 'book', 'author');
          return Array.isArray(authors) ? authors.join(', ') : authors;
        }
      },
      {
        label: 'Year Published',
        value: (resource) => getResourceDetail(resource, 'book', 'yearPublished')
      },
      {
        label: 'Pages',
        value: (resource) => getResourceDetail(resource, 'book', 'pages')
      },
      {
        label: 'Publisher',
        value: (resource) => getResourceDetail(resource, 'book', 'publisher')
      }
    ],
    videoChannel: [
      {
        label: 'Creator',
        value: (resource) => getResourceDetail(resource, 'videoChannel', 'creator')
      },
      {
        label: 'Key Topics',
        value: (resource) => {
          const topics = getResourceDetail(resource, 'videoChannel', 'keyTopics');
          return Array.isArray(topics) ? topics.join(', ') : topics;
        }
      }
    ],
    website: [
      {
        label: 'Creator',
        value: (resource) => getResourceDetail(resource, 'website', 'creator')
      },
      {
        label: 'Content Types',
        value: (resource) => {
          const types = getResourceDetail(resource, 'website', 'primaryContentTypes');
          return Array.isArray(types) ? types.join(', ') : types;
        }
      }
    ],
    blog: [
      {
        label: 'Author',
        value: (resource) => getResourceDetail(resource, 'blog', 'author')
      },
      {
        label: 'Frequency',
        value: (resource) => getResourceDetail(resource, 'blog', 'frequency')
      },
      {
        label: 'Word Count',
        value: (resource) => resource.wordCount
      }
    ],
    podcast: [
      {
        label: 'Hosts',
        value: (resource) => {
          const hosts = getResourceDetail(resource, 'podcast', 'hosts');
          return Array.isArray(hosts) ? hosts.join(', ') : hosts;
        }
      },
      {
        label: 'Active',
        value: (resource) => getResourceDetail(resource, 'podcast', 'datesActive')
      },
      {
        label: 'Episodes',
        value: (resource) => getResourceDetail(resource, 'podcast', 'episodeCount')
      },
      {
        label: 'Notable Guests',
        value: (resource) => {
          const guests = getResourceDetail(resource, 'podcast', 'notableGuests');
          return Array.isArray(guests) ? guests.join(', ') : guests;
        }
      }
    ],
    retreatCenter: [
      {
        label: 'Location',
        value: (resource) => getResourceDetail(resource, 'retreatCenter', 'location')
      },
      {
        label: 'Retreat Types',
        value: (resource) => {
          const types = getResourceDetail(resource, 'retreatCenter', 'retreatTypes');
          return Array.isArray(types) ? types.join(', ') : types;
        }
      },
      {
        label: 'Upcoming Dates',
        value: (resource) => getResourceDetail(resource, 'retreatCenter', 'upcomingDates'),
        isArray: true
      }
    ],
    practice: [
      {
        label: 'Source',
        value: (resource) => getResourceDetail(resource, 'practice', 'source')
      },
      {
        label: 'Duration',
        value: (resource) => getResourceDetail(resource, 'practice', 'duration')
      },
      {
        label: 'Technique',
        value: (resource) => getResourceDetail(resource, 'practice', 'technique')
      }
    ],
    app: [
      {
        label: 'Creator',
        value: (resource) => getResourceDetail(resource, 'app', 'creator')
      },
      {
        label: 'Platforms',
        value: (resource) => {
          const platforms = getResourceDetail(resource, 'app', 'platforms');
          return Array.isArray(platforms) ? platforms.join(', ') : platforms;
        }
      },
      {
        label: 'Price',
        value: (resource) => getResourceDetail(resource, 'app', 'price')
      },
      {
        label: 'Features',
        value: (resource) => getResourceDetail(resource, 'app', 'features'),
        isArray: true
      }
    ],
    video: [
      {
        label: 'Duration',
        value: (resource) => getResourceDetail(resource, 'video', 'duration')
      }
    ],
    article: [
      {
        label: 'Word Count',
        value: (resource) => resource.wordCount
      }
    ]
  };
  
  return [...(typeSpecificFields[normalizedType] || []), ...commonFields];
};
