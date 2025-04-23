import React from 'react';
import { getCreatorLabel, getResourceCreators } from '../../../utils/resource-creator-utils';
import { getTitleLabel, getResourceTitle } from '../../../utils/resource-name-utils';

/**
 * Displays resource-specific details in the sidebar
 */
const ResourceDetailSidebarDetails = ({ resource }) => {
  if (!resource) return null;

  // Helper to render a detail item if it exists
  const renderDetailItem = (label, value) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    
    // Handle array values
    const displayValue = Array.isArray(value) 
      ? value.join(', ')
      : value;
      
    return (
      <div className="mb-3 last:mb-0">
        <p className="font-inter" style={{ color: 'var(--text-primary)' }}>
          <span className="font-inter" style={{ color: 'var(--text-secondary)' }}>{label}: </span>
          {displayValue}
        </p>
      </div>
    );
  };

  // Get creators with appropriate label based on resource type
  const creatorLabel = getCreatorLabel(resource.type);
  const creators = getResourceCreators(resource);
  
  // Get title with appropriate label based on resource type
  const titleLabel = getTitleLabel(resource.type);
  const title = getResourceTitle(resource);

  return (
    <div>
      {/* Title (always shown) */}
      {renderDetailItem(titleLabel, title)}
      
      {/* Creator (author, host, etc.) */}
      {creators.length > 0 && renderDetailItem(creatorLabel, creators)}
      
      {/* Common fields for all resource types */}
      {renderDetailItem('Published', resource.formattedDate)}
      
      {/* Type-specific details */}
      {resource.type === 'book' && (
        <>
          {renderDetailItem('Publisher', resource.publisher || (resource.bookDetails && resource.bookDetails.publisher))}
          {renderDetailItem('Pages', resource.pages || (resource.bookDetails && resource.bookDetails.pages))}
          {renderDetailItem('Year Published', resource.yearPublished || (resource.bookDetails && resource.bookDetails.yearPublished))}
        </>
      )}
      
      {resource.type === 'website' && (
        <>
          {renderDetailItem('Primary Content Types', resource.contentTypes || (resource.websiteDetails && resource.websiteDetails.contentTypes))}
        </>
      )}
      
      {resource.type === 'blog' && (
        <>
          {renderDetailItem('Frequency', resource.frequency || (resource.blogDetails && resource.blogDetails.frequency))}
        </>
      )}
      
      {resource.type === 'podcast' && (
        <>
          {renderDetailItem('Episode Count', resource.episodeCount || (resource.podcastDetails && resource.podcastDetails.episodeCount))}
          {renderDetailItem('Dates Active', resource.datesActive || (resource.podcastDetails && resource.podcastDetails.datesActive))}
          {renderDetailItem('Notable Guests', resource.notableGuests || (resource.podcastDetails && resource.podcastDetails.notableGuests))}
        </>
      )}
      
      {resource.type === 'videoChannel' && (
        <>
          {renderDetailItem('Key Topics', resource.keyTopics || (resource.videoChannelDetails && resource.videoChannelDetails.keyTopics))}
        </>
      )}
      
      {resource.type === 'practice' && (
        <>
          {renderDetailItem('Duration', resource.duration || (resource.practiceDetails && resource.practiceDetails.duration))}
          {renderDetailItem('Difficulty', resource.difficulty || (resource.practiceDetails && resource.practiceDetails.difficulty))}
          {renderDetailItem('Technique', resource.technique || (resource.practiceDetails && resource.practiceDetails.technique))}
          {renderDetailItem('Benefits', resource.benefits || (resource.practiceDetails && resource.practiceDetails.benefits))}
        </>
      )}
      
      {resource.type === 'retreatCenter' && (
        <>
          {renderDetailItem('Location', resource.location || (resource.retreatCenterDetails && resource.retreatCenterDetails.location))}
          {renderDetailItem('Retreat Types', resource.retreatTypes || (resource.retreatCenterDetails && resource.retreatCenterDetails.retreatTypes))}
        </>
      )}
      
      {resource.type === 'app' && (
        <>
          {renderDetailItem('Platforms', resource.platforms || (resource.appDetails && resource.appDetails.platforms))}
          {renderDetailItem('Price', resource.price || (resource.appDetails && resource.appDetails.price))}
          {renderDetailItem('Features', resource.features || (resource.appDetails && resource.appDetails.features))}
        </>
      )}
      
      {/* Tags - Temporarily hidden but infrastructure preserved for future use */}
      {/* Uncomment this section when ready to use tags again
      {resource.tags && resource.tags.length > 0 && (
        <div className="mb-3">
          <p className="font-inter text-neutral-500 dark:text-neutral-400 mb-1">Tags: </p>
          <div className="flex flex-wrap gap-2">
            {resource.tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      */}
    </div>
  );
};

export default ResourceDetailSidebarDetails;
