import Link from 'next/link';
import Image from 'next/image';
import ResourceTypeIcon from './ResourceTypeIcon';
import { highlightSearchTerms, truncateText } from '../../utils/text-utils';
import { formatResourceType, getResourceSubtitle } from '../../utils/resource-utils';

/**
 * ResourceCard component
 * Displays a preview of a resource in a card format for the resource listing pages
 * Enhanced with search term highlighting
 */
export default function ResourceCard({ resource, searchTerm = '' }) {
  if (!resource) return null;
  
  const {
    _id,
    slug,
    title,
    type,
    description,
    imageUrl,
    traditions = [],
    tags = [],
    yearPublished,
    author,
    hosts,
    creator
  } = resource;
  
  // Get subtitle using the centralized utility
  const subtitle = getResourceSubtitle(resource);
  
  // Get truncated description
  const truncatedDescription = truncateText(description, 120);
  
  return (
    <Link href={`/resources/${slug}`} className="block h-full">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm overflow-hidden h-full transition-all duration-200 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700">
        {/* Card Header with Image */}
        <div className="relative h-40 bg-neutral-100 dark:bg-neutral-800">
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={title} 
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ResourceTypeIcon type={type} size={48} className="text-neutral-400 dark:text-neutral-600" />
            </div>
          )}
          <div className="absolute top-2 left-2">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white rounded-md shadow-sm">
              {formatResourceType(type)}
            </span>
          </div>
        </div>
        
        {/* Card Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
            {searchTerm ? highlightSearchTerms(title, searchTerm) : title}
          </h3>
          
          {subtitle && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              {subtitle}
            </p>
          )}
          
          {description && (
            <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">
              {searchTerm ? highlightSearchTerms(truncatedDescription, searchTerm) : truncatedDescription}
            </p>
          )}
          
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto">
              {tags.slice(0, 3).map(tag => (
                <span 
                  key={tag} 
                  className="inline-block px-2 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md"
                >
                  {searchTerm ? highlightSearchTerms(tag, searchTerm) : tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="inline-block px-2 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
