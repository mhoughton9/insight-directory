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
      <div className="sticky top-4 space-y-6">
        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800 p-6">
          {/* Resource Details Section */}
          <ResourceDetailSidebarDetails resource={resource} />
          
          {/* Resource Links Section */}
          <ResourceDetailSidebarLinks resource={resource} />
          
          {/* Resource Actions Section */}
          <ResourceDetailSidebarActions resource={resource} />
          
          {/* Resource Tags Section */}
          <ResourceDetailSidebarTags resource={resource} />
        </div>
      </div>
    </aside>
  );
};

export default ResourceDetailSidebar;
