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
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm overflow-hidden h-full transition-all duration-200 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700">
        {/* Card Header with Image */}
        <div className="relative h-48 bg-neutral-100 dark:bg-neutral-800">
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={name} 
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3C/svg%3E"
              className="object-cover transition-opacity duration-300"
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
