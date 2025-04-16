import Link from 'next/link';
import Image from 'next/image';
import ResourceTypeIcon from './ResourceTypeIcon';
import { highlightSearchTerms, truncateText } from '../../utils/text-utils';
import { formatResourceType, getResourceSubtitle } from '../../utils/resource-utils';
import { Heading, Text } from '../ui/Typography';

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
    case 'video-channel':
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
  
  // Get optimal image container styles based on resource type
  const imageContainerStyles = getImageContainerStyles(type);
  
  return (
    <Link href={`/resources/${slug}`} className="block h-full">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm overflow-hidden h-full transition-all duration-200 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 max-w-xs mx-auto">
        {/* Card Header with Image */}
        <div 
          className="relative bg-neutral-100 dark:bg-neutral-800 w-full overflow-hidden"
          style={imageContainerStyles}
        >
          {imageUrl ? (
            <div className="w-full h-full flex justify-center items-center">
              <Image 
                src={imageUrl} 
                alt={title} 
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3C/svg%3E"
                className="object-contain transition-opacity duration-300"
                style={{ objectFit: 'contain' }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <ResourceTypeIcon type={type} size={48} className="text-neutral-400 dark:text-neutral-600" />
            </div>
          )}
        </div>
        
        {/* Card Content */}
        <div className="p-4">
          <Heading 
            as="h3" 
            size="lg" 
            className="mb-1"
          >
            {searchTerm ? highlightSearchTerms(title, searchTerm) : title}
          </Heading>
          
          {subtitle && subtitle.length > 0 && (
            <Text 
              size="sm" 
              className="text-neutral-600 dark:text-neutral-400 mb-2"
            >
              {subtitle}
            </Text>
          )}
          
          {description && (
            <Text 
              size="sm"
            >
              {searchTerm ? highlightSearchTerms(truncatedDescription, searchTerm) : truncatedDescription}
            </Text>
          )}
        </div>
      </div>
    </Link>
  );
}
