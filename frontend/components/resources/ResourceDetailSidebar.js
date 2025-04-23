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
  
  // Check if the resource has any links in its type-specific details
  const hasLinks = () => {
    const type = resource.type;
    if (!type) return false;
    
    // Helper function to check if an array has valid links
    const hasValidLinks = (linksArray) => {
      if (!linksArray) return false;
      
      // If it's an empty array, there are no links
      if (Array.isArray(linksArray) && linksArray.length === 0) return false;
      
      // Check if at least one item in the array has a url property or is a valid link object
      return Array.isArray(linksArray) && linksArray.some(link => {
        // Check for standard link objects with url property
        if (link && link.url) return true;
        
        // Check for objects with numeric keys (character arrays)
        if (link && typeof link === 'object') {
          const keys = Object.keys(link);
          return keys.some(key => !isNaN(parseInt(key)));
        }
        
        return false;
      });
    };
    
    switch (type) {
      case 'book':
        return hasValidLinks(resource.bookDetails?.links);
      case 'videoChannel':
        return hasValidLinks(resource.videoChannelDetails?.links);
      case 'website':
        return hasValidLinks(resource.websiteDetails?.links);
      case 'blog':
        return hasValidLinks(resource.blogDetails?.links);
      case 'podcast':
        return hasValidLinks(resource.podcastDetails?.links);
      case 'retreatCenter':
        return hasValidLinks(resource.retreatCenterDetails?.links);
      case 'practice':
        return hasValidLinks(resource.practiceDetails?.links);
      case 'app':
        return hasValidLinks(resource.appDetails?.links);
      default:
        return false;
    }
  };
  
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Resource Details */}
      <div className={Typography.cardContainer} style={Typography.cardContainerStyle}>
        <h2 className={Typography.sidebarHeading}>Details</h2>
        <ResourceDetailSidebarDetails resource={resource} />
      </div>
      
      {/* Resource Links */}
      {hasLinks() && (
        <div className={Typography.cardContainer} style={Typography.cardContainerStyle}>
          <h2 className={Typography.sidebarHeading}>Links</h2>
          <ResourceDetailSidebarLinks resource={resource} />
        </div>
      )}
      
      {/* Actions */}
      <div className={Typography.cardContainer} style={Typography.cardContainerStyle}>
        <h2 className={Typography.sidebarHeading}>Actions</h2>
        <ResourceDetailSidebarActions resource={resource} />
      </div>
    </div>
  );
};

export default ResourceDetailSidebar;
