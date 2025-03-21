import React from 'react';
import { normalizeResourceType } from '../../../utils/resource-utils';

/**
 * ResourceDetailSidebarDetails component
 * Displays resource-specific details based on resource type
 * @param {Object} props - Component props
 * @param {Object} props.resource - Resource data object
 */
const ResourceDetailSidebarDetails = ({ resource }) => {
  if (!resource) return null;
  
  const normalizedType = normalizeResourceType(resource.type);
  
  // Helper function to render a detail item
  const renderDetailItem = (label, value) => {
    if (!value) return null;
    
    return (
      <div className="mb-3 last:mb-0">
        <p className="font-inter text-neutral-800 dark:text-neutral-200">
          <span className="font-inter text-neutral-500 dark:text-neutral-400">{label}: </span>
          {Array.isArray(value) ? value.join(', ') : value}
        </p>
      </div>
    );
  };
  
  // Render details based on resource type
  const renderTypeSpecificDetails = () => {
    switch (normalizedType) {
      case 'book':
        return (
          <>
            {renderDetailItem('Author', resource.author || (resource.bookDetails && resource.bookDetails.author))}
            {renderDetailItem('Page Count', resource.pageCount || (resource.bookDetails && resource.bookDetails.pages))}
            {renderDetailItem('Year Published', resource.yearPublished || (resource.bookDetails && resource.bookDetails.yearPublished))}
          </>
        );
        
      case 'videoChannel':
        return (
          <>
            {renderDetailItem('Creator', resource.creator || (resource.videoChannelDetails && resource.videoChannelDetails.creator))}
          </>
        );
        
      case 'website':
        return (
          <>
            {renderDetailItem('Creator', resource.creator || (resource.websiteDetails && resource.websiteDetails.creator))}
            {renderDetailItem('Primary Content Types', resource.contentTypes || (resource.websiteDetails && resource.websiteDetails.contentTypes))}
          </>
        );
        
      case 'blog':
        return (
          <>
            {renderDetailItem('Author', resource.author || (resource.blogDetails && resource.blogDetails.author))}
            {renderDetailItem('Frequency', resource.frequency || (resource.blogDetails && resource.blogDetails.frequency))}
          </>
        );
        
      case 'podcast':
        return (
          <>
            {renderDetailItem('Creator', resource.creator || (resource.podcastDetails && resource.podcastDetails.hosts))}
            {renderDetailItem('Episode Count', resource.episodeCount || (resource.podcastDetails && resource.podcastDetails.episodeCount))}
            {renderDetailItem('Dates Active', resource.datesActive || (resource.podcastDetails && resource.podcastDetails.datesActive))}
            {renderDetailItem('Notable Guests', resource.notableGuests || (resource.podcastDetails && resource.podcastDetails.notableGuests))}
          </>
        );
        
      case 'practice':
        return (
          <>
            {renderDetailItem('Source', resource.source || (resource.practiceDetails && resource.practiceDetails.source))}
          </>
        );
        
      case 'retreatCenter':
        return (
          <>
            {renderDetailItem('Location', resource.location || (resource.retreatCenterDetails && resource.retreatCenterDetails.location))}
          </>
        );
        
      case 'app':
        return (
          <>
            {renderDetailItem('Creator', resource.creator || (resource.appDetails && resource.appDetails.creator))}
            {renderDetailItem('Features', resource.features || (resource.appDetails && resource.appDetails.features))}
          </>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div>
      {renderTypeSpecificDetails()}
    </div>
  );
};

export default ResourceDetailSidebarDetails;
