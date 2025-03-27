import React from 'react';
import { Text } from '../../ui/Typography';

/**
 * TextSection component
 * Renders a text-based section with proper formatting
 * @param {Object} props - Component props
 * @param {string} props.content - The text content to display
 */
const TextSection = ({ content }) => {
  if (!content) return null;
  
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {content.split('\n').map((paragraph, index) => (
        <Text key={index} className="mb-4 last:mb-0">{paragraph}</Text>
      ))}
    </div>
  );
};

export default TextSection;
