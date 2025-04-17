import Link from 'next/link';
import Image from 'next/image';
import ResourceTypeIcon from './ResourceTypeIcon';
import { highlightSearchTerms, truncateText } from '../../utils/text-utils';
import { getResourceSubtitle } from '../../utils/resource-utils';
import { Heading, Text } from '../ui/Typography';

/**
 * BookListItem component
 * Displays a book resource in a horizontal layout optimized for book listings
 * @param {Object} props - Component props
 * @param {Object} props.resource - Resource data object
 * @param {string} props.searchTerm - Optional search term for highlighting
 */
export default function BookListItem({ resource, searchTerm = '' }) {
  if (!resource) return null;
  
  const {
    _id,
    slug,
    title,
    description,
    imageUrl,
    traditions = [],
  } = resource;
  
  // Get subtitle (author, year) using the centralized utility
  const subtitle = getResourceSubtitle(resource);
  
  // Extract book-specific details
  const pages = resource.bookDetails?.pages;
  
  // Get truncated description
  const truncatedDescription = truncateText(description, 180); // Slightly longer description for horizontal layout
  
  return (
    <Link href={`/resources/${slug}`} className="block w-full">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm overflow-hidden h-full transition-all duration-200 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700">
        <div className="flex flex-col md:flex-row">
          {/* Book Cover (left side on desktop, top on mobile) */}
          <div className="w-full md:w-48 flex-shrink-0 bg-neutral-100 dark:bg-neutral-800">
            <div className="relative aspect-[2/3] w-full h-full">
              {imageUrl ? (
                <Image 
                  src={imageUrl} 
                  alt={title} 
                  fill
                  sizes="(max-width: 768px) 100vw, 192px"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3C/svg%3E"
                  className="object-contain transition-opacity duration-300"
                  style={{ objectFit: 'contain' }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ResourceTypeIcon type="book" size={48} className="text-neutral-400 dark:text-neutral-600" />
                </div>
              )}
            </div>
          </div>
          
          {/* Book Details (right side on desktop, bottom on mobile) */}
          <div className="p-4 md:p-5 flex-grow">
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
                className="text-neutral-600 dark:text-neutral-400 mb-1"
              >
                {subtitle}
              </Text>
            )}
            
            {/* Additional book metadata */}
            <div className="flex flex-wrap items-center gap-x-4 mb-3">
              {pages && (
                <Text size="xs" className="text-neutral-500 dark:text-neutral-500">
                  {pages} pages
                </Text>
              )}
            </div>
            
            {/* Subtle divider */}
            <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800 mb-3"></div>
            
            {description && (
              <Text 
                size="sm"
              >
                {searchTerm ? highlightSearchTerms(truncatedDescription, searchTerm) : truncatedDescription}
              </Text>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
