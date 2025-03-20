import React from 'react';

/**
 * ResourceDetailSkeleton component
 * Displays a loading skeleton UI for the resource detail page
 */
const ResourceDetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header skeleton */}
      <div className="w-full bg-gradient-to-r from-brand-start via-brand-mid to-brand-end bg-opacity-10 dark:bg-opacity-5 py-8 md:py-12 mb-8 rounded-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0 md:mr-8 md:flex-1">
              {/* Resource type badge skeleton */}
              <div className="flex items-center mb-3">
                <div className="h-5 w-5 bg-neutral-200 dark:bg-neutral-700 rounded-full mr-2 animate-pulse"></div>
                <div className="h-5 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
              </div>
              
              {/* Title skeleton */}
              <div className="h-10 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded mb-3 animate-pulse"></div>
              
              {/* Description preview skeleton */}
              <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded mb-2 animate-pulse"></div>
              <div className="h-4 w-2/3 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            </div>
            
            {/* Image skeleton */}
            <div className="relative rounded-lg overflow-hidden w-full md:w-64 h-48 md:h-36 bg-neutral-200 dark:bg-neutral-700 animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Main content layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content skeleton */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-sm">
            {/* About section skeleton */}
            <div className="mb-8">
              <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-700 rounded mb-4 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
              </div>
            </div>
            
            {/* Details section skeleton */}
            <div className="mt-8 bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-lg">
              <div className="h-7 w-40 bg-neutral-200 dark:bg-neutral-700 rounded mb-4 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded mb-2 animate-pulse"></div>
                    <div className="h-5 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* External link skeleton */}
            <div className="mt-8 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-2 animate-pulse"></div>
              <div className="h-5 w-48 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Sidebar skeleton */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white dark:bg-neutral-900 rounded-lg overflow-hidden shadow-sm border border-neutral-100 dark:border-neutral-800">
            {/* Actions skeleton */}
            <div className="p-5 border-b border-neutral-100 dark:border-neutral-800">
              <div className="h-6 w-24 bg-neutral-200 dark:bg-neutral-700 rounded mb-4 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
              </div>
            </div>
            
            {/* Tags skeleton */}
            <div className="p-5 border-b border-neutral-100 dark:border-neutral-800">
              <div className="h-6 w-16 bg-neutral-200 dark:bg-neutral-700 rounded mb-3 animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className="h-6 w-16 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
            
            {/* Traditions skeleton */}
            <div className="p-5 border-b border-neutral-100 dark:border-neutral-800">
              <div className="h-6 w-28 bg-neutral-200 dark:bg-neutral-700 rounded mb-3 animate-pulse"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-5 w-40 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            
            {/* Teachers skeleton */}
            <div className="p-5 border-b border-neutral-100 dark:border-neutral-800">
              <div className="h-6 w-24 bg-neutral-200 dark:bg-neutral-700 rounded mb-3 animate-pulse"></div>
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-5 w-36 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            
            {/* Similar resources skeleton */}
            <div className="p-5">
              <div className="h-6 w-40 bg-neutral-200 dark:bg-neutral-700 rounded mb-3 animate-pulse"></div>
              <div className="h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailSkeleton;
