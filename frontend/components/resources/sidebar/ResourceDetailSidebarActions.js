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
      <FavoriteButton 
        type="resource"
        id={resource._id}
        size="default"
        showText={true}
        className="flex items-center justify-center w-full py-2 px-4 rounded-md transition-colors font-inter"
        style={{ 
          backgroundColor: 'var(--surface)', 
          color: 'var(--text-primary)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        }}
      />
    </div>
  );
};

export default ResourceDetailSidebarActions;
