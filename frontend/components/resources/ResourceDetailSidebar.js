import React from 'react';
import Link from 'next/link';
import * as Typography from '../common/TypographyStyles';
import ResourceDetailSidebarDetails from './sidebar/ResourceDetailSidebarDetails';
import ResourceDetailSidebarLinks from './sidebar/ResourceDetailSidebarLinks';
import ResourceDetailSidebarActions from './sidebar/ResourceDetailSidebarActions';
import FavoriteButton from '../ui/FavoriteButton';

/**
 * ResourceDetailSidebar component
 * Displays additional information about the resource in a sidebar
 * @param {Object} props - Component props
 * @param {Object} props.resource - Resource data object
 */
const ResourceDetailSidebar = ({ resource }) => {
  if (!resource) return null;
  
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Resource Details */}
      <div className={Typography.cardContainer}>
        <h2 className={Typography.sidebarHeading}>Details</h2>
        <ResourceDetailSidebarDetails resource={resource} />
      </div>
      
      {/* Resource Links */}
      {(resource.links?.length > 0 || resource.url || resource.websiteUrl) && (
        <div className={Typography.cardContainer}>
          <h2 className={Typography.sidebarHeading}>Links</h2>
          <ResourceDetailSidebarLinks resource={resource} />
        </div>
      )}
      
      {/* Actions */}
      <div className={Typography.cardContainer}>
        <h2 className={Typography.sidebarHeading}>Actions</h2>
        <ResourceDetailSidebarActions resource={resource} />
      </div>
    </div>
  );
};

export default ResourceDetailSidebar;
