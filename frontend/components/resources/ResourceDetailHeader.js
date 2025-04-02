import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ResourceTypeIcon from './ResourceTypeIcon';
import { formatResourceType, normalizeResourceType } from '../../utils/resource-utils';
import { Heading, Text, Caption } from '../ui/Typography';

/**
 * Get optimal image container styles based on resource type
 * @param {string} type - Resource type (book, video, podcast, etc.)
 * @returns {object} - Style object with appropriate aspect ratio and background
 */
function getImageContainerStyles(type) {
  switch (type) {
    case 'book':
      return {
        aspectRatio: '2/3',
        background: 'linear-gradient(to bottom, #f3f4f6, #e5e7eb)',
      };
    case 'video':
    case 'videoChannel':
      return {
        aspectRatio: '16/9',
        background: 'linear-gradient(to bottom, #f3f4f6, #e5e7eb)',
      };
    case 'podcast':
    case 'audio':
      return {
        aspectRatio: '1/1', // Square for podcast artwork
        background: 'linear-gradient(to bottom, #f3f4f6, #e5e7eb)',
      };
    default:
      return {
        aspectRatio: '4/3', // Default aspect ratio
        background: 'linear-gradient(to bottom, #f3f4f6, #e5e7eb)',
      };
  }
}

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
  
  // Get optimal image container styles based on resource type
  const imageContainerStyles = getImageContainerStyles(resource.type);
  
  return (
    <header className="w-full bg-gradient-to-r from-brand-start via-brand-mid to-brand-end bg-opacity-10 dark:bg-opacity-5 py-6 md:py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-4 font-inter overflow-x-auto pb-1 scrollbar-hide">
          <Link href="/" className="hover:text-brand-purple transition-colors whitespace-nowrap">
            Home
          </Link>
          <span>/</span>
          <Link 
            href={`/resources/type/${normalizeResourceType(resource.type)}`}
            className="hover:text-brand-purple transition-colors whitespace-nowrap"
          >
            {formatResourceType(resource.type)}s
          </Link>
          <span>/</span>
          <span className="text-neutral-500 dark:text-neutral-500 truncate max-w-[120px] sm:max-w-[150px] md:max-w-xs whitespace-nowrap">
            {resource.title}
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          {/* Resource image (if available) */}
          {resource.imageUrl && (
            <div 
              className="w-24 h-auto md:w-28 lg:w-32 rounded-lg overflow-hidden relative flex-shrink-0 border border-neutral-200 dark:border-neutral-700 shadow-sm transition-transform hover:scale-105"
              style={imageContainerStyles}
            >
              <Image 
                src={resource.imageUrl} 
                alt={resource.title}
                fill
                sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                className="object-contain"
              />
            </div>
          )}
          
          {/* Resource title and metadata */}
          <div className="flex-1">
            <Heading as="h1" size="3xl">
              {resource.title}
            </Heading>
            
            {resource.description && (
              <Text className="mt-2 line-clamp-2">
                {resource.description}
              </Text>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ResourceDetailHeader;
