import React from 'react';
import FavoriteButton from '@/components/ui/FavoriteButton';

/**
 * ResourceDetailSidebarActions component
 * Displays action buttons for a resource (favorite, share, etc.)
 * @param {Object} props - Component props
 * @param {Object} props.resource - Resource data object
 */
const ResourceDetailSidebarActions = ({ resource }) => {
  if (!resource) return null;
  
  return (
    <div className="space-y-3">
      <button 
        className="w-full py-2 px-4 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center font-inter"
      >
        <FavoriteButton 
          type="resource"
          id={resource._id}
          size="default"
          showText={true}
          className="flex items-center justify-center w-full"
        />
      </button>
    </div>
  );
};

export default ResourceDetailSidebarActions;
