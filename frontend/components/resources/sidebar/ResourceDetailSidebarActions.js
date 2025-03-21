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
    <>
      <h2 className="text-2xl font-medium mb-4 text-neutral-800 dark:text-neutral-200 font-lora">
        Actions
      </h2>
      <div className="space-y-2">
        <FavoriteButton 
          itemId={resource._id}
          itemType="resource"
          className="w-full"
        />
        
        <button 
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-inter"
          aria-label="Share resource"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="font-inter">Share</span>
        </button>
      </div>
    </>
  );
};

export default ResourceDetailSidebarActions;
