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
 * @returns {Array<{url: string, label: string}>} Array of link objects
 */
export const getResourceLinks = (resource) => {
  if (!resource) return [];

  const resourceType = normalizeResourceType(resource.type || 'unknown');
  const detailsKey = `${resourceType}Details`;

  // Consolidate potential link sources
  let rawLinks = [];
  if (resource.links && Array.isArray(resource.links)) {
    rawLinks = [...resource.links];
  } else if (resource[detailsKey]?.links && Array.isArray(resource[detailsKey].links)) {
    rawLinks = [...resource[detailsKey].links];
  } else if (
    (resourceType === 'website' || resourceType === 'blog') &&
    resource[detailsKey]?.link &&
    typeof resource[detailsKey].link === 'string'
  ) {
    rawLinks = [resource[detailsKey].link]; // Keep as string for now
  } else if (resource.url && typeof resource.url === 'string') {
    rawLinks = [resource.url]; // Keep as string for now
  }

  // Ensure all elements in links are objects with url and label
  let links = rawLinks.map(link => {
    if (typeof link === 'string') {
      return { url: link, label: getLinkLabel(link) };
    } else if (typeof link === 'object' && link !== null && typeof link.url === 'string') {
      // Ensure label exists, generate if not
      return { url: link.url, label: typeof link.label === 'string' ? link.label : getLinkLabel(link.url) };
    }
    console.warn('Skipping invalid link format:', link);
    return null; // Skip invalid formats
  }).filter(link => link !== null && link.url); // Filter out nulls and ensure URL exists

  // Sort links based on resource type and common platforms
  if (links.length > 1) {
    const sortOrder = {
      // Books
      amazon: 1,
      // Podcasts
      spotify: 10,
      apple_podcast: 11,
      // Apps
      apple_app: 20,
      google_play: 21,
      // Video
      youtube: 30,
      // General/Other
      website: 50, // Prioritize official website if identifiable
      other: 99,
    };

    const getSortValue = (linkUrl) => {
      if (!linkUrl) return sortOrder.other;
      try {
        const url = new URL(linkUrl);
        const domain = url.hostname.replace(/^www\./i, '');

        // Type-specific overrides first
        if (resourceType === 'book' && domain.includes('amazon.')) return sortOrder.amazon;
        if (resourceType === 'podcast') {
          if (domain.includes('spotify.')) return sortOrder.spotify;
          if (domain.includes('apple.') && url.pathname.includes('/podcast')) return sortOrder.apple_podcast;
        }
        if (resourceType === 'app') {
          if (domain.includes('apple.') && url.pathname.includes('/app')) return sortOrder.apple_app;
          if (domain.includes('play.google.')) return sortOrder.google_play;
        }
        // General platform checks
        if (domain.includes('youtube.')) return sortOrder.youtube;
        if (domain.includes('spotify.')) return sortOrder.spotify; // Catch spotify if not podcast
        if (domain.includes('apple.') && url.pathname.includes('/podcast')) return sortOrder.apple_podcast; // Catch apple podcast if not podcast type
        if (domain.includes('apple.') && url.pathname.includes('/app')) return sortOrder.apple_app; // Catch apple app if not app type
        if (domain.includes('play.google.')) return sortOrder.google_play; // Catch google play if not app type
        if (domain.includes('amazon.')) return sortOrder.amazon; // Catch amazon if not book

        // Check if it matches websiteDetails.link for website/blog types
        if ((resourceType === 'website' || resourceType === 'blog') && resource[detailsKey]?.link === linkUrl) {
            return sortOrder.website;
        }

      } catch (e) {
          // ignore url parsing errors for sorting
      }
      return sortOrder.other;
    };

    links.sort((a, b) => getSortValue(a.url) - getSortValue(b.url));
  }

  return links;
};

/**
 * Get a user-friendly label for a link
 * @param {String} link - The URL
 * @returns {String} A user-friendly label
 */
export const getLinkLabel = (link) => {
  if (!link || typeof link !== 'string') {
      return 'Invalid Link';
  }
  try {
    // Handle potential mailto links gracefully
    if (link.toLowerCase().startsWith('mailto:')) {
        return link.substring(7); // Return email address
    }

    const url = new URL(link);
    const domain = url.hostname.replace(/^www\./i, ''); // Case-insensitive www removal

    // More specific checks
    if (domain.includes('amazon.')) return 'Amazon';
    if (domain === 'youtube.com' || domain.endsWith('.youtube.com')) return 'YouTube';
    if (domain === 'spotify.com' || domain.endsWith('.spotify.com')) return 'Spotify';
    // Check apple.com carefully
    if (domain === 'apple.com' || domain.endsWith('.apple.com') || domain === 'podcasts.apple.com' || domain === 'apps.apple.com') {
      if (url.pathname.includes('/podcast')) return 'Apple Podcasts';
      if (url.pathname.includes('/app')) return 'App Store';
      // Avoid generic 'Apple' if it's a specific subdomain like podcasts/apps
      if (domain === 'podcasts.apple.com') return 'Apple Podcasts';
      if (domain === 'apps.apple.com') return 'App Store';
      return 'Apple';
    }
    // Check google.com carefully
    if (domain.includes('google.')) {
      if (domain === 'play.google.com' || domain.endsWith('.play.google.com')) return 'Google Play';
      // Avoid generic 'Google' if it's play store
      return 'Google';
    }
    if (domain.includes('substack.com')) return 'Substack';
    if (domain.includes('medium.com')) return 'Medium';
    if (domain.includes('patreon.com')) return 'Patreon';

    // Generic domain label extraction
    const parts = domain.split('.');
    // Handle cases like 'co.uk', take the part before the TLD
    let mainDomain = domain;
    if (parts.length > 2 && parts[parts.length - 2].length <= 3 && parts[parts.length - 1].length <= 3) {
        // Likely a complex TLD like co.uk, co.jp - take the part before that
        mainDomain = parts[parts.length - 3];
    } else if (parts.length > 1) {
        mainDomain = parts[parts.length - 2];
    } // else, it might be just 'localhost' or similar

    return mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);

  } catch (e) {
    // Fallback for invalid URLs or unexpected formats
    console.warn(`Error creating link label for: ${link}`, e);
    // Try to extract something meaningful if possible, otherwise truncate
    const simpleMatch = link.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/i);
    const fallbackDomain = simpleMatch && simpleMatch[1] ? simpleMatch[1] : link;
    const cleanedFallback = fallbackDomain.split('/')[0]; // Remove path if any
    return cleanedFallback.length > 30 ? cleanedFallback.substring(0, 27) + '...' : cleanedFallback;
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

  // Helper function to format array values consistently
  const formatArrayValue = (value) => {
    // Ensure value is actually an array before joining
    return Array.isArray(value) ? value.join(', ') : value;
  };

  const typeSpecificFields = {
    book: [
      {
        label: 'Author',
        value: (resource) => formatArrayValue(getResourceDetail(resource, 'book', 'author'))
      },
      {
        label: 'Year',
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
        value: (resource) => formatArrayValue(getResourceDetail(resource, 'videoChannel', 'creator'))
      },
      {
        label: 'Key Topics',
        value: (resource) => formatArrayValue(getResourceDetail(resource, 'videoChannel', 'keyTopics'))
      }
    ],
    website: [
      {
        label: 'Creator',
        value: (resource) => formatArrayValue(getResourceDetail(resource, 'website', 'creator'))
      },
      {
        label: 'Content Types',
        value: (resource) => formatArrayValue(getResourceDetail(resource, 'website', 'primaryContentTypes'))
      }
    ],
    blog: [
      {
        label: 'Author',
        value: (resource) => formatArrayValue(getResourceDetail(resource, 'blog', 'author'))
      },
      {
        label: 'Frequency',
        value: (resource) => getResourceDetail(resource, 'blog', 'frequency')
      }
    ],
    podcast: [
      {
        label: 'Hosts',
        value: (resource) => formatArrayValue(getResourceDetail(resource, 'podcast', 'hosts'))
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
        value: (resource) => formatArrayValue(getResourceDetail(resource, 'podcast', 'notableGuests'))
      }
    ],
    retreatCenter: [
      {
        label: 'Location',
        value: (resource) => getResourceDetail(resource, 'retreatCenter', 'location')
      },
      {
        label: 'Retreat Types',
        value: (resource) => formatArrayValue(getResourceDetail(resource, 'retreatCenter', 'retreatTypes'))
      },
      {
        label: 'Upcoming Dates',
        value: (resource) => getResourceDetail(resource, 'retreatCenter', 'upcomingDates'),
        isArray: true // Keep flag if used elsewhere
      }
    ],
    practice: [
      {
        label: 'Originator', // Standardize field name if needed
        value: (resource) => formatArrayValue(getResourceDetail(resource, 'practice', 'originator'))
      },
      {
        label: 'Source', // Assuming 'source' is different from 'originator'
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
        value: (resource) => formatArrayValue(getResourceDetail(resource, 'app', 'creator'))
      },
      {
        label: 'Platforms',
        value: (resource) => formatArrayValue(getResourceDetail(resource, 'app', 'platforms'))
      },
      {
        label: 'Price',
        value: (resource) => getResourceDetail(resource, 'app', 'price')
      },
      {
        label: 'Features',
        value: (resource) => getResourceDetail(resource, 'app', 'features'),
        isArray: true // Keep flag if used elsewhere
      }
    ],
    article: [
    ]
  };

  // Return only fields that have a value extractor defined for the normalized type
  const fieldsForType = typeSpecificFields[normalizedType] || [];
  return [...fieldsForType, ...commonFields];
};
