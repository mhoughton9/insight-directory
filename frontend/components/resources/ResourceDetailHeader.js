import React from 'react';
import Link from 'next/link';
import ResourceTypeIcon from './ResourceTypeIcon';
import { formatResourceType, normalizeResourceType } from '../../utils/resource-utils';

/**
 * ResourceDetailHeader component
 * Displays the resource title, type, and basic metadata in a header section
 * @param {Object} props - Component props
 * @param {Object} props.resource - Resource data object
 */
const ResourceDetailHeader = ({ resource }) => {
  if (!resource) return null;
  
  // Format published date if available
  const formattedDate = resource.publishedDate 
    ? new Date(resource.publishedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;
  
  return (
    <header className="w-full bg-gradient-to-r from-brand-start via-brand-mid to-brand-end bg-opacity-10 dark:bg-opacity-5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-2">
          <Link href="/" className="hover:text-brand-purple transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link 
            href={`/resources?type=${normalizeResourceType(resource.type)}`}
            className="hover:text-brand-purple transition-colors"
          >
            {formatResourceType(resource.type)}s
          </Link>
          <span>/</span>
          <span className="text-neutral-500 dark:text-neutral-500 truncate">
            {resource.title}
          </span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-light text-neutral-800 dark:text-neutral-100 mb-2 tracking-tight">
          {resource.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <div className="flex items-center text-brand-purple">
            <ResourceTypeIcon type={resource.type} size={18} color="currentColor" />
            <span className="ml-1 capitalize">{formatResourceType(resource.type)}</span>
          </div>
          
          {formattedDate && (
            <div className="text-neutral-600 dark:text-neutral-400">
              <span>{formattedDate}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ResourceDetailHeader;
