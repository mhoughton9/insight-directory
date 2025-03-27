import React from 'react';
import { Text } from '../../ui/Typography';

/**
 * ArraySection component
 * Renders an array of items as a bulleted list
 * @param {Object} props - Component props
 * @param {Array} props.content - Array of items to display
 */
const ArraySection = ({ content }) => {
  if (!content || !Array.isArray(content) || content.length === 0) return null;
  
  return (
    <ul className="list-disc pl-5 space-y-2">
      {content.map((item, index) => (
        <li key={index} className="text-neutral-800 dark:text-neutral-200">
          <Text>{item}</Text>
        </li>
      ))}
    </ul>
  );
};

export default ArraySection;
