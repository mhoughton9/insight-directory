/**
 * Configuration file for teacher description sections
 * Maps teacher sections to their structure
 */

// Section configuration for teachers
export const TEACHER_SECTIONS = [
  { key: 'in_a_nutshell', label: 'In a Nutshell', type: 'text' },
  { key: 'what_students_say', label: 'What students say', type: 'text' },
  { key: 'common_misunderstanding_clarified', label: 'Common Misunderstanding clarified', type: 'text' },
  { key: 'if_you_only_read_watch_one_thing', label: 'If you only read/watch one thing', type: 'text' },
  { key: 'quotes_worth_remembering', label: 'Quotes worth remembering', type: 'array' }
];

/**
 * Get the sections for teachers
 * @returns {Array} - Array of section definitions
 */
export const getTeacherSections = () => {
  return TEACHER_SECTIONS;
};
