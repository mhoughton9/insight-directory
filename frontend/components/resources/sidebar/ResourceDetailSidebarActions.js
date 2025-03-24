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
    <div className="space-y-2">
      <FavoriteButton 
        type="resource"
        id={resource._id}
        className="w-full"
        showText={true}
      />
    </div>
  );
};

export default ResourceDetailSidebarActions;
