import React, { useState } from 'react';

/**
 * ResourceActions component
 * Displays action buttons like share and favorite
 * @param {Object} props - Component props
 * @param {Object} props.resource - Resource data object
 */
const ResourceActions = ({ resource }) => {
  if (!resource) return null;
  
  // State for favorite button
  const [isFavorited, setIsFavorited] = useState(false);
  
  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
    // Would implement API call to save favorite status
    alert(isFavorited ? 'Removed from favorites!' : 'Added to favorites!');
  };
  
  return (
    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200">Actions</h3>
      <div className="flex gap-3">
        {/* Share button */}
        <button 
          onClick={() => {
            if (typeof navigator !== 'undefined' && navigator.share) {
              navigator.share({
                title: resource.title,
                text: `Check out ${resource.title} on Insight Directory`,
                url: window.location.href
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              // Would implement a toast notification here
              alert('Link copied to clipboard!');
            }
          }}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-purple text-white hover:bg-opacity-90 transition-all"
          aria-label="Share resource"
          title="Share"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
        </button>
        
        {/* Favorite button */}
        <button
          onClick={handleFavoriteToggle}
          className={`flex items-center justify-center w-10 h-10 rounded-full ${isFavorited ? 'bg-brand-pink text-white' : 'bg-white text-neutral-400 border border-neutral-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'} hover:bg-opacity-90 transition-all`}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ResourceActions;
