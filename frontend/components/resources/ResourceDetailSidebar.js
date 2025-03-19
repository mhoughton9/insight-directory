import React from 'react';
import {
  ResourceMetadata,
  ResourceTags,
  ResourceTraditions,
  ResourceLinks,
  ResourceTeachers,
  ResourceActions
} from './sidebar';

/**
 * ResourceDetailSidebar component
 * Displays additional information about the resource including tags, traditions, and metadata
 * @param {Object} props - Component props
 * @param {Object} props.resource - Resource data object
 */
const ResourceDetailSidebar = ({ resource }) => {
  if (!resource) return null;
  
  return (
    <div className="space-y-6">
      {/* Tags section */}
      <ResourceTags tags={resource.tags} />
      
      {/* Traditions section */}
      <ResourceTraditions traditions={resource.traditions} />
      
      {/* Links section */}
      <ResourceLinks resource={resource} />
      
      {/* Teachers or Notable Guests section */}
      <ResourceTeachers teachers={resource.teachers} resourceType={resource.type} />
      
      {/* Metadata section - Resource Info */}
      <ResourceMetadata resource={resource} />
      
      {/* Sharing and Favorite section */}
      <ResourceActions resource={resource} />
    </div>
  );
};

export default ResourceDetailSidebar;
