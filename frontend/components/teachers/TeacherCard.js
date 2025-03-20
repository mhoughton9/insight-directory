import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * TeacherCard component
 * Displays a preview of a teacher in a card format for the teachers listing page
 */
export default function TeacherCard({ teacher }) {
  if (!teacher) return null;
  
  const {
    _id,
    name,
    biography,
    imageUrl,
    traditions = []
  } = teacher;
  
  // Use biography as description, or fallback to a placeholder
  const description = biography ? biography.substring(0, 120) + (biography.length > 120 ? '...' : '') : '';
  
  return (
    <Link href={`/teachers/${_id}`} className="block h-full">
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
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          )}
        </div>
        
        {/* Card Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1" style={{ fontFamily: 'Lora, serif' }}>
            {name}
          </h3>
          
          {description && (
            <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              {description}
            </p>
          )}
          
          {/* Traditions */}
          {traditions && traditions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto">
              {traditions.map(tradition => (
                <span 
                  key={tradition._id || tradition} 
                  className="inline-block px-2 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {tradition.name || tradition}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
