/**
 * Utility functions for text manipulation and formatting
 */

/**
 * Highlights search terms within a text string by wrapping them in a span with a highlight class
 * @param {string} text - The original text to search within
 * @param {string} searchTerm - The search term to highlight
 * @param {string} highlightClass - CSS class to apply to the highlighted text
 * @returns {React.ReactNode[]} Array of text nodes and highlighted spans
 */
export const highlightSearchTerms = (text, searchTerm, highlightClass = 'bg-yellow-200 dark:bg-yellow-800 rounded px-0.5') => {
  if (!text || !searchTerm || searchTerm.trim() === '') {
    return text;
  }
  
  // Escape special regex characters in the search term
  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Create a regex that matches the search term (case insensitive)
  const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
  
  // Split the text by the regex matches
  const parts = text.split(regex);
  
  // Map the parts to either plain text or highlighted spans
  return parts.map((part, i) => {
    // Check if this part matches the search term (case insensitive)
    if (part.toLowerCase() === searchTerm.toLowerCase()) {
      return <span key={i} className={highlightClass}>{part}</span>;
    }
    return part;
  });
};

/**
 * Truncates text to a specified length and adds ellipsis if needed
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  // Find the last space before maxLength to avoid cutting words
  const lastSpace = text.substring(0, maxLength).lastIndexOf(' ');
  const truncatedText = text.substring(0, lastSpace > 0 ? lastSpace : maxLength);
  
  return `${truncatedText}...`;
};
