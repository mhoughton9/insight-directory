import React from 'react';
import Link from 'next/link';

/**
 * ResourceTags component
 * Displays resource tags in a consistent format
 * @param {Object} props - Component props
 * @param {Array} props.tags - Array of tag strings
 */
const ResourceTags = ({ tags }) => {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Link 
            key={tag} 
            href={`/resources?tags=${encodeURIComponent(tag)}`}
            className="px-3 py-1 bg-white dark:bg-neutral-700 rounded-full text-sm hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors border border-neutral-200 dark:border-neutral-600 hover:text-brand-purple hover:border-brand-purple dark:hover:border-brand-purple"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ResourceTags;
