/**
 * Configuration file for resource description sections
 * Maps each resource type to its specific section structure
 */

// Section configurations for each resource type
export const RESOURCE_SECTIONS = {
  book: [
    { key: 'in_a_nutshell', label: 'In a Nutshell', type: 'text' },
    { key: 'practitioner_perspective', label: 'Practitioner\'s Perspective', type: 'text' },
    { key: 'quotes_worth_reflecting', label: 'Quotes Worth Reflecting On', type: 'array' },
    { key: 'most_interesting_idea', label: 'Most Interesting Idea', type: 'text' },
    { key: 'most_common_criticism', label: 'Most Common Criticism', type: 'text' }
  ],
  
  video_channel: [
    { key: 'in_a_nutshell', label: 'In a Nutshell', type: 'text' },
    { key: 'style', label: 'Style', type: 'text' },
    { key: 'best_videos_to_start', label: 'Best Videos to Start With', type: 'array' },
    { key: 'unique_strength', label: 'Unique Strength', type: 'text' },
    { key: 'most_common_criticism', label: 'Most Common Criticism', type: 'text' }
  ],
  
  podcast: [
    { key: 'in_a_nutshell', label: 'In a Nutshell', type: 'text' },
    { key: 'notable_guests', label: 'Notable Guests', type: 'array' },
    { key: 'episodes_worth_the_hype', label: 'Episodes Worth the Hype', type: 'array' },
    { key: 'hidden_gems', label: 'Hidden Gems', type: 'array' },
    { key: 'most_common_criticism', label: 'Most Common Criticism', type: 'text' }
  ],
  
  website: [
    { key: 'in_a_nutshell', label: 'In a Nutshell', type: 'text' },
    { key: 'main_topics', label: 'Main Topics', type: 'array' },
    { key: 'design_and_usability', label: 'Design and Usability', type: 'text' },
    { key: 'how_to_get_the_most', label: 'How to Get the Most From It', type: 'text' },
    { key: 'most_common_criticism', label: 'Most Common Criticism', type: 'text' }
  ],
  
  blog: [
    { key: 'in_a_nutshell', label: 'In a Nutshell', type: 'text' },
    { key: 'main_topics', label: 'Main Topics', type: 'array' },
    { key: 'posts_worth_saving', label: 'Posts Worth Saving', type: 'array' },
    { key: 'biggest_takeaway', label: 'Biggest Takeaway', type: 'text' },
    { key: 'most_common_criticism', label: 'Most Common Criticism', type: 'text' }
  ],
  
  practice: [
    { key: 'in_a_nutshell', label: 'In a Nutshell', type: 'text' },
    { key: 'practitioners_perspective', label: 'Practitioner\'s Perspective', type: 'text' },
    { key: 'how_to_do_it_well', label: 'How to Do It Well', type: 'text' },
    { key: 'what_it_feels_like', label: 'What It Feels Like', type: 'text' },
    { key: 'most_common_criticism', label: 'Most Common Criticism', type: 'text' }
  ],
  
  app: [
    { key: 'in_a_nutshell', label: 'In a Nutshell', type: 'text' },
    { key: 'ease_of_use', label: 'Ease of Use', type: 'text' },
    { key: 'most_helpful_features', label: 'Most Helpful Features', type: 'array' },
    { key: 'who_its_best_for', label: 'Who It\'s Best For', type: 'text' },
    { key: 'most_common_criticism', label: 'Most Common Criticism', type: 'text' }
  ],
  
  retreat_center: [
    { key: 'in_a_nutshell', label: 'In a Nutshell', type: 'text' },
    { key: 'what_visitors_say', label: 'What Visitors Say', type: 'array' },
    { key: 'location_and_atmosphere', label: 'Location/Atmosphere', type: 'text' },
    { key: 'teacher_facilitator_spotlight', label: 'Teacher/Facilitator Spotlight', type: 'text' },
    { key: 'most_common_criticism', label: 'Most Common Criticism', type: 'text' }
  ]
};

// Normalize resource type to match the keys in RESOURCE_SECTIONS
export const normalizeResourceTypeForSections = (type) => {
  if (!type) return '';
  
  // Convert to lowercase and handle special cases
  const normalizedType = type.toLowerCase();
  
  // Handle multi-word types
  if (normalizedType === 'video channel') return 'video_channel';
  if (normalizedType === 'retreat center') return 'retreat_center';
  
  // Handle camelCase types
  if (normalizedType === 'videochannel') return 'video_channel';
  if (normalizedType === 'retreatcenter') return 'retreat_center';
  
  // For single word types, just return the lowercase version
  return normalizedType.replace(/\s+/g, '_');
};

// Default sections for any type not explicitly defined
export const DEFAULT_SECTIONS = [
  { key: 'in_a_nutshell', label: 'In a Nutshell', type: 'text' },
  { key: 'highlights', label: 'Highlights', type: 'array' },
  { key: 'unique_aspects', label: 'Unique Aspects', type: 'text' },
  { key: 'best_for', label: 'Best For', type: 'text' },
  { key: 'considerations', label: 'Considerations', type: 'text' }
];

/**
 * Get the appropriate sections for a given resource type
 * @param {string} type - The resource type
 * @returns {Array} - Array of section definitions
 */
export const getSectionsForResourceType = (type) => {
  if (!type) return DEFAULT_SECTIONS;
  
  const normalizedType = normalizeResourceTypeForSections(type);
  return RESOURCE_SECTIONS[normalizedType] || DEFAULT_SECTIONS;
};
