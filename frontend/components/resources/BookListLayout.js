import React from 'react';
import BookListItem from './BookListItem';
import { Text, Heading } from '../ui/Typography';

/**
 * BookListLayout component
 * Displays a responsive list of book resources optimized for book browsing
 * Two columns on extra large screens, one column on smaller screens
 */
const BookListLayout = React.memo(function BookListLayout({ resources = [], isLoading = false, searchTerm = '' }) {
  if (isLoading && resources.length === 0) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-9 gap-y-16">
        {[...Array(4)].map((_, index) => (
          <BookListItemSkeleton key={index} />
        ))}
      </div>
    );
  }
  
  if (!resources.length && !isLoading) {
    return (
      <div className="py-12 text-center bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
        <Heading as="h3" size="lg" className="mb-2">
          No books found
        </Heading>
        <Text size="md">
          Try adjusting your filters or search terms
        </Text>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-9 gap-y-16">
      {resources.map(resource => (
        <BookListItem 
          key={resource._id || resource.slug} 
          resource={resource} 
          searchTerm={searchTerm}
        />
      ))}
    </div>
  );
});

export default BookListLayout;

/**
 * BookListItemSkeleton component
 * Displays a loading placeholder for book list items
 */
function BookListItemSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm overflow-hidden h-full animate-pulse">
      <div className="flex flex-col md:flex-row">
        {/* Book Cover Skeleton */}
        <div className="w-full md:w-48 flex-shrink-0 bg-neutral-200 dark:bg-neutral-700 aspect-[2/3] md:aspect-auto"></div>
        
        {/* Book Details Skeleton */}
        <div className="p-4 md:p-5 flex-grow">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
}
