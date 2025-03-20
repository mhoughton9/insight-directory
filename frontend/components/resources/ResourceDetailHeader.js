import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    <header className="w-full bg-gradient-to-r from-brand-start via-brand-mid to-brand-end bg-opacity-10 dark:bg-opacity-5 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-4 font-inter">
          <Link href="/" className="hover:text-brand-purple transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link 
            href={`/resources/type/${normalizeResourceType(resource.type)}`}
            className="hover:text-brand-purple transition-colors"
          >
            {formatResourceType(resource.type)}s
          </Link>
          <span>/</span>
          <span className="text-neutral-500 dark:text-neutral-500 truncate max-w-[150px] md:max-w-xs">
            {resource.title}
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Resource image (if available) */}
          {resource.imageUrl && (
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden relative flex-shrink-0 border border-neutral-200 dark:border-neutral-700 shadow-sm transition-transform hover:scale-105">
              <Image 
                src={resource.imageUrl} 
                alt={resource.title}
                fill
                sizes="(max-width: 768px) 96px, 128px"
                className="object-cover"
              />
            </div>
          )}
          
          {/* Resource title and metadata */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-purple bg-opacity-10 text-brand-purple dark:bg-opacity-20">
                <ResourceTypeIcon type={resource.type} className="w-4 h-4 mr-1" />
                {formatResourceType(resource.type)}
              </span>
              {formattedDate && (
                <span className="text-sm text-neutral-500 dark:text-neutral-400 font-inter">
                  {formattedDate}
                </span>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium text-neutral-800 dark:text-neutral-200 font-lora">
              {resource.title}
            </h1>
            
            {resource.description && (
              <p className="mt-2 text-neutral-600 dark:text-neutral-400 line-clamp-2 font-inter">
                {resource.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ResourceDetailHeader;
