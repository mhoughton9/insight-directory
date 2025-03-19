import React from 'react';
import { getResourceLinks, getLinkLabel } from '../../../utils/resource-helpers';

/**
 * ResourceLinks component
 * Displays resource links in a consistent format
 * @param {Object} props - Component props
 * @param {Object} props.resource - Resource data object
 */
const ResourceLinks = ({ resource }) => {
  if (!resource) return null;
  
  const links = getResourceLinks(resource);
  
  if (links.length === 0) return null;
  
  return (
    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200">Links</h3>
      <div className="space-y-3">
        {links.map((link, index) => (
          <a 
            key={index}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-white dark:bg-neutral-700 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors border border-neutral-200 dark:border-neutral-600 group"
          >
            <span className="text-neutral-800 dark:text-neutral-200 group-hover:text-brand-purple transition-colors">{getLinkLabel(link)}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500 dark:text-neutral-400 group-hover:text-brand-purple transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ResourceLinks;
