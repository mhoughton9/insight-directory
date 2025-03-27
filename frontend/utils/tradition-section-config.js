/**
 * Configuration file for tradition description sections
 * Maps tradition sections to their structure
 */

// Section configuration for traditions
export const TRADITION_SECTIONS = [
  { key: 'in_a_nutshell', label: 'In a Nutshell (description)', type: 'text' },
  { key: 'the_steel_man_case', label: 'The Steel-man case', type: 'text' },
  { key: 'if_you_only_read_one_book', label: 'If you only read one book', type: 'text' },
  { key: 'common_misunderstanding_clarified', label: 'Common misunderstanding clarified', type: 'text' },
  { key: 'practical_exercises', label: 'Practical Exercises', type: 'array' }
];

/**
 * Get the sections for traditions
 * @returns {Array} - Array of section definitions
 */
export const getTraditionSections = () => {
  return TRADITION_SECTIONS;
};
