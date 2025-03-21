import React from 'react';

/**
 * LoadingSkeleton component
 * Displays a standardized loading skeleton UI for detail pages
 * @param {Object} props - Component props
 * @param {string} props.type - Type of detail page ('resource', 'teacher', 'tradition')
 */
const LoadingSkeleton = ({ type = 'resource' }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          <span className="text-neutral-300 dark:text-neutral-600">/</span>
          <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          <span className="text-neutral-300 dark:text-neutral-600">/</span>
          <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
        </div>
        
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
          {/* Image skeleton */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-neutral-200 dark:bg-neutral-700"></div>
          
          <div className="flex-1">
            {/* Type badge skeleton (for resources) */}
            {type === 'resource' && (
              <div className="flex items-center mb-3">
                <div className="h-5 w-5 bg-neutral-200 dark:bg-neutral-700 rounded-full mr-2"></div>
                <div className="h-5 w-24 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
              </div>
            )}
            
            {/* Title skeleton */}
            <div className="h-8 w-64 bg-neutral-200 dark:bg-neutral-700 rounded mb-4"></div>
            
            {/* Description preview skeleton */}
            <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
            <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          </div>
        </div>
        
        {/* Main content layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content skeleton */}
          <div className="w-full lg:w-2/3">
            {/* Content section */}
            <div className="mb-8">
              <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                <div className="h-4 w-5/6 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
              </div>
            </div>
            
            {/* Items grid section (resources/teachers) */}
            <div className="mb-8">
              <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-700 rounded mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                ))}
              </div>
            </div>
            
            {/* Comments section */}
            <div className="mb-8 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
              <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-4"></div>
              <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
            </div>
          </div>
          
          {/* Sidebar skeleton */}
          <div className="w-full lg:w-1/3">
            {/* Sidebar section 1 */}
            <div className="mb-8 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
              <div className="h-6 w-24 bg-neutral-200 dark:bg-neutral-700 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
              </div>
            </div>
            
            {/* Sidebar section 2 */}
            <div className="mb-8 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
              <div className="h-6 w-24 bg-neutral-200 dark:bg-neutral-700 rounded mb-4"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-6 w-16 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
