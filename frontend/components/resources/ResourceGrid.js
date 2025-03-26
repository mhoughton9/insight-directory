import React from 'react';
import ResourceCard from './ResourceCard';
import { Text, Heading } from '../ui/Typography';
import { getTypographyClasses } from '../../utils/fontUtils';

/**
 * ResourceGrid component
 * Displays a responsive grid of resource cards
 * Enhanced with search term highlighting and memoization to prevent excessive renders
 */
const ResourceGrid = React.memo(function ResourceGrid({ resources = [], isLoading = false, searchTerm = '' }) {
  // Removed console.log statement
  
  if (isLoading && resources.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <ResourceCardSkeleton key={index} />
        ))}
      </div>
    );
  }
  
  if (!resources.length && !isLoading) {
    return (
      <div className="py-12 text-center bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
        <Heading as="h3" size="lg" className="mb-2">
          No resources found
        </Heading>
        <Text size="md">
          Try adjusting your filters or search terms
        </Text>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {resources.map(resource => (
        <ResourceCard 
          key={resource._id || resource.slug} 
          resource={resource} 
          searchTerm={searchTerm}
        />
      ))}
    </div>
  );
});

export default ResourceGrid;

/**
 * ResourceCardSkeleton component
 * Displays a loading placeholder for resource cards
 */
function ResourceCardSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm overflow-hidden h-full animate-pulse">
      {/* Card Header with Image */}
      <div className="h-48 bg-neutral-200 dark:bg-neutral-700"></div>
      
      {/* Card Content */}
      <div className="p-4">
        <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6"></div>
      </div>
    </div>
  );
}
