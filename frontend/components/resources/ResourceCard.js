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
  } = resource;
  
  // Get subtitle using the centralized utility
  const subtitle = getResourceSubtitle(resource);
  
  // Get truncated description
  const truncatedDescription = truncateText(description, 120);
  
  // Debug: Log the resource to see what fields are available
  console.log(`Resource Card: ${title}`, {
    resource: resource,
    type: type,
    subtitle: subtitle
  });
  
  return (
    <Link href={`/resources/${slug}`} className="block h-full">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm overflow-hidden h-full transition-all duration-200 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700">
        {/* Card Header with Image */}
        <div className="relative h-48 bg-neutral-100 dark:bg-neutral-800">
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
        </div>
        
        {/* Card Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1" style={{ fontFamily: 'Lora, serif' }}>
            {searchTerm ? highlightSearchTerms(title, searchTerm) : title}
          </h3>
          
          {subtitle && subtitle.length > 0 && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              {subtitle}
            </p>
          )}
          
          {description && (
            <p className="text-sm text-neutral-700 dark:text-neutral-300" style={{ fontFamily: 'Inter, sans-serif' }}>
              {searchTerm ? highlightSearchTerms(truncatedDescription, searchTerm) : truncatedDescription}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
