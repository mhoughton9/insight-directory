/**
 * Utility functions and constants for tradition-related components
 */

/**
 * Description sections for traditions
 * These sections will be displayed on the tradition detail page
 */
export const TRADITION_SECTIONS = [
  {
    key: 'in_a_nutshell',
    label: 'In a Nutshell',
    type: 'text',
    description: 'Brief summary of the tradition.'
  },
  {
    key: 'historical_context',
    label: 'Historical Context',
    type: 'text',
    description: 'Origins and development of the tradition.'
  },
  {
    key: 'key_teachings',
    label: 'Key Teachings',
    type: 'text',
    description: 'Core principles and concepts of the tradition.'
  },
  {
    key: 'practices',
    label: 'Practices',
    type: 'text',
    description: 'Common practices associated with the tradition.'
  },
  {
    key: 'modern_relevance',
    label: 'Modern Relevance',
    type: 'text',
    description: 'How the tradition is practiced or interpreted today.'
  }
];

/**
 * Default initial form data for creating a new tradition
 */
export const DEFAULT_TRADITION_FORM_DATA = {
  name: '',
  slug: '',
  description: '',
  descriptionFull: '',
  origin: '',
  foundingPeriod: '',
  keyTeachings: [],
  imageUrl: '',
  links: [],
  relatedTraditions: [],
  descriptionSections: {},
  processed: false // Default to Pending status
};

/**
 * Prepares tradition data for form display
 * @param {Object} tradition - Tradition data from the API
 * @returns {Object} Formatted tradition data for the form
 */
export const prepareTraditionForForm = (tradition) => {
  if (!tradition) return { ...DEFAULT_TRADITION_FORM_DATA };
  
  // Create a new object with the tradition data
  const traditionData = { ...tradition };
  
  return {
    ...traditionData,
    // Ensure arrays exist even if they're not in the original data
    keyTeachings: traditionData.keyTeachings || [],
    links: traditionData.links || [],
    relatedTraditions: traditionData.relatedTraditions || [],
    // Ensure descriptionSections is an object
    descriptionSections: traditionData.descriptionSections || {}
  };
};

/**
 * Validates tradition form data
 * @param {Object} formData - The form data to validate
 * @returns {Object} Object with isValid flag and errors object
 */
export const validateTraditionForm = (formData) => {
  const errors = {};
  
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Name is required';
  }
  
  if (!formData.description || formData.description.trim() === '') {
    errors.description = 'Description is required';
  }
  
  if (!formData.slug || formData.slug.trim() === '') {
    errors.slug = 'Slug is required';
  }
  
  // Add more validations as needed
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Get styles for tradition image container
 * @param {string} imageUrl - URL of the tradition image
 * @returns {Object} CSS styles object
 */
export const getTraditionImageContainerStyles = (imageUrl) => {
  return {
    backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: imageUrl ? 'transparent' : '#f0f0f0'
  };
};
