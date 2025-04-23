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
      {/* Use inline styles with CSS variables for base, custom class for hover */}
      <div 
        className="book-list-item-card border rounded-lg overflow-hidden h-full transition-colors duration-200" 
        style={{
          backgroundColor: 'var(--surface)', // Use root variable --surface for card background
          borderColor: 'var(--border-color)' // Use root variable for card border
        }}
      >
        <div className="flex flex-col md:flex-row">
          {/* Book Cover (left side on desktop, top on mobile) */}
          {/* Use bg-surface for the image container background */}
          <div 
            className="w-full md:w-48 flex-shrink-0"
            style={{ 
              backgroundColor: 'var(--surface)' // Use root variable --surface for card background
            }}
          >
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
                  {/* Use text-text-muted for placeholder icon */}
                  <ResourceTypeIcon type="book" size={48} className="text-text-muted" />
                </div>
              )}
            </div>
          </div>
          
          {/* Book Details (right side on desktop, bottom on mobile) */}
          <div className="p-4 md:p-5 flex-grow">
            <Heading 
              as="h3" 
              size="lg" 
              className="mb-1 text-text-heading" // Explicitly use text-heading
            >
              {searchTerm ? highlightSearchTerms(title, searchTerm) : title}
            </Heading>
            
            {subtitle && subtitle.length > 0 && (
              <Text 
                size="sm" 
                className="text-text-muted mb-1" // Use text-text-muted
              >
                {subtitle}
              </Text>
            )}
            
            {/* Additional book metadata */}
            <div className="flex flex-wrap items-center gap-x-4 mb-3">
              {pages && (
                <Text size="xs" className="text-text-muted"> {/* Use text-text-muted */}
                  {pages} pages
                </Text>
              )}
            </div>
            
            {/* Brighter divider for better visibility */}
            <div 
              className="h-px w-full mb-3" 
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }} // Lighter color for better visibility
            ></div>
            
            {description && (
              <Text 
                size="md"
                className="text-text-body" // Use text-text-body for main description
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
