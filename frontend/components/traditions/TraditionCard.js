import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1" style={{ fontFamily: 'Lora, serif' }}>
            {name}
          </h3>
          
          {shortDescription && (
            <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              {shortDescription}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
