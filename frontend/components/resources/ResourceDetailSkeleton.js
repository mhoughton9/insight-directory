import React from 'react';

/**
 * Loading skeleton for the resource detail page
 * Displays a placeholder UI while the resource data is being fetched
 */
const ResourceDetailSkeleton = () => {
  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen animate-pulse">
      {/* Header skeleton */}
      <div className="w-full bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-2/3 bg-neutral-300 dark:bg-neutral-600 rounded mb-4"></div>
          <div className="h-4 w-1/3 bg-neutral-300 dark:bg-neutral-600 rounded"></div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content skeleton */}
          <div className="lg:w-2/3">
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-6 mb-6">
              <div className="h-64 bg-neutral-200 dark:bg-neutral-700 rounded-lg mb-6"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar skeleton */}
          <div className="lg:w-1/3">
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-6 mb-6">
              <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded mb-4 w-1/2"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
                ))}
              </div>
            </div>
            
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-6">
              <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded mb-4 w-1/2"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Related resources skeleton */}
        <div className="mt-16">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded mb-6 w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4">
                <div className="h-40 bg-neutral-200 dark:bg-neutral-700 rounded-lg mb-4"></div>
                <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailSkeleton;
