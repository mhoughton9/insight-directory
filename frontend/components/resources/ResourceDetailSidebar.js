import React from 'react';
import ResourceDetailSidebarDetails from './sidebar/ResourceDetailSidebarDetails';
import ResourceDetailSidebarLinks from './sidebar/ResourceDetailSidebarLinks';
import ResourceDetailSidebarTags from './sidebar/ResourceDetailSidebarTags';
import ResourceDetailSidebarActions from './sidebar/ResourceDetailSidebarActions';

/**
 * ResourceDetailSidebar component
 * Displays additional information about the resource in a sidebar
 * @param {Object} props - Component props
 * @param {Object} props.resource - Resource data object
 */
const ResourceDetailSidebar = ({ resource }) => {
  if (!resource) return null;
  
  return (
    <aside className="w-full">
      <div className="sticky top-4 space-y-4">
        {/* Resource Details Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800 p-6">
          <ResourceDetailSidebarDetails resource={resource} />
        </div>
        
        {/* Resource Links Section */}
        {(resource.links?.length > 0 || resource.url || resource.websiteUrl) && (
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800 p-6">
            <ResourceDetailSidebarLinks resource={resource} />
          </div>
        )}
        
        {/* Resource Actions Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800 p-6">
          <ResourceDetailSidebarActions resource={resource} />
        </div>
        
        {/* Resource Tags Section */}
        {(resource.tags?.length > 0 || resource.traditions?.length > 0 || resource.teachers?.length > 0) && (
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800 p-6">
            <ResourceDetailSidebarTags resource={resource} />
          </div>
        )}
      </div>
    </aside>
  );
};

export default ResourceDetailSidebar;
