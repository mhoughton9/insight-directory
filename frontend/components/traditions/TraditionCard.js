import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heading, Text } from '../ui/Typography';

/**
 * TraditionCard component
 * Displays a preview of a tradition in a card format for the traditions listing page
 */
export default function TraditionCard({ tradition }) {
  if (!tradition) return null;
  
  const {
    _id,
    name,
    description,
    imageUrl,
    slug
  } = tradition;
  
  // Truncate description if needed
  const shortDescription = description ? description.substring(0, 120) + (description.length > 120 ? '...' : '') : '';
  
  // Use slug if available, otherwise fallback to _id
  const linkPath = slug ? `/traditions/${slug}` : `/traditions/${_id}`;
  
  return (
    <Link href={linkPath} className="block h-full">
      <div 
        className="tradition-card-item border rounded-lg shadow-sm overflow-hidden h-full transition-all duration-200 hover:shadow-md" 
        style={{ 
          backgroundColor: 'var(--surface)', 
          borderColor: 'var(--border-color)' 
        }}
      >
        {/* Card Header with Image */}
        <div className="relative h-48 bg-neutral-100 dark:bg-neutral-800">
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={name} 
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 dark:text-neutral-600">
                <path d="M2 22h20"></path>
                <path d="M6.87 2h10.26L22 17H2L6.87 2z"></path>
              </svg>
            </div>
          )}
        </div>
        
        {/* Card Content */}
        <div className="p-4">
          <Heading as="h3" size="lg" className="mb-1">
            {name}
          </Heading>
          
          {shortDescription && (
            <Text size="sm" className="mb-3">
              {shortDescription}
            </Text>
          )}
        </div>
      </div>
    </Link>
  );
}
