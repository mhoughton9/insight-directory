import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heading, Text } from '../ui/Typography';
import { getTypographyClasses } from '../../utils/fontUtils';
import { getTeacherImageContainerStyles } from '../../utils/teacher-utils';

/**
 * TeacherCard component
 * Displays a preview of a teacher in a card format for the teachers listing page
 */
export default function TeacherCard({ teacher }) {
  if (!teacher) return null;
  
  const {
    _id,
    name,
    slug,
    biography,
    imageUrl,
    traditions = []
  } = teacher;
  
  // Use biography as description, or fallback to a placeholder
  const description = biography ? biography.substring(0, 120) + (biography.length > 120 ? '...' : '') : '';
  
  // Create a URL-friendly slug from the name if no slug exists
  const teacherSlug = slug || (name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') : _id);
  
  return (
    <Link href={`/teachers/${teacherSlug}`} className="block h-full">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm overflow-hidden h-full transition-all duration-200 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700">
        {/* Card Header with Image */}
        <div className="relative aspect-square w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
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
              priority={false}
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
          <Heading as="h3" size="lg" className={`${getTypographyClasses('lg', 'font-serif')} mb-1`}>
            {name}
          </Heading>
          
          {description && (
            <Text size="sm" className={`${getTypographyClasses('sm', 'font-sans')} mb-3`}>
              {description}
            </Text>
          )}
          
          {/* Traditions */}
          {traditions && traditions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto">
              {traditions.map(tradition => (
                <Text 
                  key={tradition._id || tradition}
                  as="span" 
                  size="xs"
                  className={`${getTypographyClasses('xs', 'font-sans')} inline-block px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md`}
                >
                  {tradition.name || tradition}
                </Text>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
