import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ResourceTypeIcon from './ResourceTypeIcon';
import { formatResourceType, normalizeResourceType } from '../../utils/resource-utils';
import * as Typography from '../common/TypographyStyles';

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
    <header className="w-full bg-gradient-to-r from-brand-start via-brand-mid to-brand-end bg-opacity-10 dark:bg-opacity-5 py-6 md:py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-4 font-inter overflow-x-auto pb-1 scrollbar-hide">
          <Link href="/" className={Typography.breadcrumbItem}>
            Home
          </Link>
          <span>/</span>
          <Link 
            href={`/resources/type/${normalizeResourceType(resource.type)}`}
            className={Typography.breadcrumbItem}
          >
            {formatResourceType(resource.type)}s
          </Link>
          <span>/</span>
          <span className={Typography.breadcrumbText}>
            {resource.title}
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          {/* Resource image (if available) */}
          {resource.imageUrl && (
            <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-lg overflow-hidden relative flex-shrink-0 border border-neutral-200 dark:border-neutral-700 shadow-sm transition-transform hover:scale-105">
              <Image 
                src={resource.imageUrl} 
                alt={resource.title}
                fill
                sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                className="object-cover"
              />
            </div>
          )}
          
          {/* Resource title and metadata */}
          <div className="flex-1">
            <h1 className={Typography.pageTitle}>
              {resource.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-purple bg-opacity-10 text-brand-purple dark:bg-opacity-20">
                <ResourceTypeIcon type={resource.type} className="w-4 h-4 mr-1" />
                {formatResourceType(resource.type)}
              </span>
              {formattedDate && (
                <span className={Typography.metadataText}>
                  {formattedDate}
                </span>
              )}
            </div>
            
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
