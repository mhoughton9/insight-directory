import React from 'react';
import { Text } from '../../ui/Typography';

/**
 * TextSection component
 * Renders a text-based section with proper formatting
 * @param {Object} props - Component props
 * @param {string|object} props.content - The text content to display
 */
const TextSection = ({ content }) => {
  if (!content) return null;
  
  // Handle different content types
  let textContent = content;
  
  // If content is an array, join the elements
  if (Array.isArray(content)) {
    textContent = content.join('\n\n');
  } 
  // If content is another type of object, convert to string
  else if (typeof content === 'object') {
    textContent = JSON.stringify(content, null, 2);
  }
  
  // Ensure content is a string
  if (typeof textContent !== 'string') {
    textContent = String(textContent);
  }
  
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none text-text-primary">
      {textContent.split('\n').map((paragraph, index) => (
        <Text key={index} className="mb-4 last:mb-0 text-text-primary">{paragraph}</Text>
      ))}
    </div>
  );
};

export default TextSection;
