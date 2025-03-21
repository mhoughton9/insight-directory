import React from 'react';
import Link from 'next/link';
import * as Typography from '../common/TypographyStyles';
import ResourceDetailSidebarDetails from './sidebar/ResourceDetailSidebarDetails';
import ResourceDetailSidebarLinks from './sidebar/ResourceDetailSidebarLinks';
import ResourceDetailSidebarTags from './sidebar/ResourceDetailSidebarTags';
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
      
      {/* Resource Tags */}
      {(resource.tags?.length > 0 || resource.traditions?.length > 0 || resource.teachers?.length > 0) && (
        <div className={Typography.cardContainer}>
          <h2 className={Typography.sidebarHeading}>Tags</h2>
          <ResourceDetailSidebarTags resource={resource} />
        </div>
      )}
      
      {/* Actions */}
      <div className={Typography.cardContainer}>
        <h2 className={Typography.sidebarHeading}>Actions</h2>
        <div className="space-y-3">
          <div className="w-full py-2 px-4 bg-brand-purple text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center font-inter">
            <FavoriteButton 
              type="resource" 
              id={resource._id} 
              size="default"
              showText={true}
              className="text-white flex items-center justify-center w-full"
            />
          </div>
          
          <button className="w-full py-2 px-4 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center font-inter">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
          
          <button className="w-full py-2 px-4 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center font-inter">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Report Issue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailSidebar;
