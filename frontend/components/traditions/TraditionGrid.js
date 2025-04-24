import React from 'react';
import TraditionCard from './TraditionCard';
import { Heading, Text } from '../ui/Typography';

/**
 * TraditionGrid component
 * Displays a responsive grid of tradition cards
 */
const TraditionGrid = React.memo(function TraditionGrid({ traditions = [], isLoading = false }) {
  if (isLoading && traditions.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <TraditionCardSkeleton key={index} />
        ))}
      </div>
    );
  }
  
  if (!traditions.length && !isLoading) {
    return (
      <div className="py-12 text-center bg-card-bg border border-card-border rounded-lg">
        <Heading as="h3" size="md" className="mb-2 text-text-heading">
          No traditions found
        </Heading>
        <Text className="text-text-muted">
          Try adjusting your search terms
        </Text>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {traditions.map(tradition => (
        <TraditionCard 
          key={tradition._id} 
          tradition={tradition} 
        />
      ))}
    </div>
  );
});

export default TraditionGrid;

/**
 * TraditionCardSkeleton component
 * Displays a loading placeholder for tradition cards
 */
function TraditionCardSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm overflow-hidden h-full animate-pulse">
      {/* Card Header with Image */}
      <div className="h-48 bg-neutral-200 dark:bg-neutral-700"></div>
      
      {/* Card Content */}
      <div className="p-4">
        <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6 mb-4"></div>
        
        {/* Teachers */}
        <div className="mt-4">
          <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4 mb-2"></div>
          <div className="flex flex-wrap gap-1">
            <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded-full w-16"></div>
            <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded-full w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
