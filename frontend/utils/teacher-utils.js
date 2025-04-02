/**
 * Utility functions and constants for teacher-related components
 */

/**
 * Description sections for teachers
 * These sections will be displayed on the teacher detail page
 */
export const TEACHER_SECTIONS = [
  {
    key: 'in_a_nutshell',
    label: 'In a Nutshell',
    type: 'text',
    description: 'Brief summary of the teacher\'s approach and teachings.'
  },
  {
    key: 'key_contributions',
    label: 'Key Contributions',
    type: 'text',
    description: 'Major contributions to spiritual teachings and understanding.'
  },
  {
    key: 'teaching_style',
    label: 'Teaching Style',
    type: 'text',
    description: 'Description of their teaching approach and methodology.'
  },
  {
    key: 'notable_quotes',
    label: 'Notable Quotes',
    type: 'text',
    description: 'Significant or representative quotes from this teacher.'
  },
  {
    key: 'historical_context',
    label: 'Historical Context',
    type: 'text',
    description: 'Their place in the broader spiritual landscape and influence on traditions.'
  }
];

/**
 * Default initial form data for creating a new teacher
 */
export const DEFAULT_TEACHER_FORM_DATA = {
  name: '',
  slug: '',
  biography: '',
  birthYear: '',
  deathYear: '',
  country: '',
  imageUrl: '',
  links: [],
  traditions: [],
  relatedTeachers: [],
  descriptionSections: {},
  processed: false // Default to Pending status
};

/**
 * Prepares teacher data for form display
 * @param {Object} teacher - Teacher data from the API
 * @returns {Object} Formatted teacher data for the form
 */
export const prepareTeacherForForm = (teacher) => {
  if (!teacher) return { ...DEFAULT_TEACHER_FORM_DATA };
  
  // Create a new object without the website, keyTeachings, and notableTeachings fields
  const { website, keyTeachings, notableTeachings, ...teacherData } = teacher;
  
  return {
    ...teacherData,
    // Ensure arrays exist even if they're not in the original data
    links: teacherData.links || [],
    traditions: teacherData.traditions || [],
    relatedTeachers: teacherData.relatedTeachers || [],
    // Ensure descriptionSections is an object
    descriptionSections: teacherData.descriptionSections || {}
  };
};

/**
 * Validates teacher form data
 * @param {Object} formData - The form data to validate
 * @returns {Object} Object with isValid flag and errors object
 */
export const validateTeacherForm = (formData) => {
  const errors = {};
  
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Name is required';
  }
  
  // Add more validations as needed
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Get optimal image container styles for teacher images
 * @returns {object} - Style object with appropriate aspect ratio and background
 */
export const getTeacherImageContainerStyles = () => {
  return {
    aspectRatio: '1/1', // Square for teacher images
    background: 'linear-gradient(to bottom, #f3f4f6, #e5e7eb)',
  };
};
