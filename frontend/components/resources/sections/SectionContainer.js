import React from 'react';
import { Heading } from '../../ui/Typography';
import TextSection from './TextSection';
import ArraySection from './ArraySection';

/**
 * SectionContainer component
 * Container for individual description sections with appropriate title and content
 * @param {Object} props - Component props
 * @param {string} props.title - The section title
 * @param {string} props.type - The type of content ('text' or 'array')
 * @param {string|Array} props.content - The section content
 */
const SectionContainer = ({ title, type, content }) => {
  // Don't render anything if content is missing
  if (!content) return null;
  if (type === 'array' && (!Array.isArray(content) || content.length === 0)) return null;
  
  return (
    <div className="mb-8 last:mb-0">
      <Heading as="h3" size="lg" className="mb-3">
        {title}
      </Heading>
      
      {type === 'text' && <TextSection content={content} />}
      {type === 'array' && <ArraySection content={content} />}
    </div>
  );
};

export default SectionContainer;
