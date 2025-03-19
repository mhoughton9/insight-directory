import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { normalizeResourceType } from '../../utils/resource-utils';

/**
 * ResourceDetailContent component
 * Displays the main content of the resource including image, description, and type-specific details
 * @param {Object} props - Component props
 * @param {Object} props.resource - Resource data object
 */
const ResourceDetailContent = ({ resource }) => {
  if (!resource) return null;
  
  // Helper function to render type-specific details
  const renderTypeSpecificDetails = () => {
    // Use the centralized normalizeResourceType utility for consistent handling
    const normalizedType = normalizeResourceType(resource.type);
    
    switch (normalizedType) {
      case 'book':
        return resource.bookDetails && (
          <div className="mt-8 bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200">Book Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resource.bookDetails.author && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Author</p>
                  <p>{Array.isArray(resource.bookDetails.author) ? resource.bookDetails.author.join(', ') : resource.bookDetails.author}</p>
                </div>
              )}
              {resource.bookDetails.yearPublished && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Year Published</p>
                  <p>{resource.bookDetails.yearPublished}</p>
                </div>
              )}
              {resource.bookDetails.pages && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Pages</p>
                  <p>{resource.bookDetails.pages}</p>
                </div>
              )}
              {resource.bookDetails.publisher && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Publisher</p>
                  <p>{resource.bookDetails.publisher}</p>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'blog':
        return resource.blogDetails && (
          <div className="mt-8 bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200">Blog Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resource.blogDetails.name && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Name</p>
                  <p>{resource.blogDetails.name}</p>
                </div>
              )}
              {resource.blogDetails.author && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Author</p>
                  <p>{resource.blogDetails.author}</p>
                </div>
              )}
              {resource.blogDetails.frequency && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Frequency</p>
                  <p>{resource.blogDetails.frequency}</p>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'videochannel':
      case 'videochannels':
      case 'videoChannel':
        return resource.videoChannelDetails && (
          <div className="mt-8 bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200">Video Channel Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resource.videoChannelDetails.channelName && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Channel Name</p>
                  <p>{resource.videoChannelDetails.channelName}</p>
                </div>
              )}
              {resource.videoChannelDetails.creator && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Creator</p>
                  <p>{resource.videoChannelDetails.creator}</p>
                </div>
              )}
              {resource.videoChannelDetails.keyTopics && resource.videoChannelDetails.keyTopics.length > 0 && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Key Topics</p>
                  <p>{resource.videoChannelDetails.keyTopics.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'podcast':
        return resource.podcastDetails && (
          <div className="mt-8 bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200">Podcast Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resource.podcastDetails.podcastName && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Podcast Name</p>
                  <p>{resource.podcastDetails.podcastName}</p>
                </div>
              )}
              {resource.podcastDetails.hosts && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Hosts</p>
                  <p>{Array.isArray(resource.podcastDetails.hosts) ? resource.podcastDetails.hosts.join(', ') : resource.podcastDetails.hosts}</p>
                </div>
              )}
              {resource.podcastDetails.datesActive && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Active Dates</p>
                  <p>{resource.podcastDetails.datesActive}</p>
                </div>
              )}
              {resource.podcastDetails.episodeCount && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Episodes</p>
                  <p>{resource.podcastDetails.episodeCount}</p>
                </div>
              )}
              {resource.podcastDetails.notableGuests && resource.podcastDetails.notableGuests.length > 0 && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Notable Guests</p>
                  <p>{resource.podcastDetails.notableGuests.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'practice':
        return resource.practiceDetails && (
          <div className="mt-8 bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200">Practice Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {resource.practiceDetails.name && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Name</p>
                  <p>{resource.practiceDetails.name}</p>
                </div>
              )}
              {resource.practiceDetails.source && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Source</p>
                  <p>{resource.practiceDetails.source}</p>
                </div>
              )}
              {resource.practiceDetails.duration && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Duration</p>
                  <p>{resource.practiceDetails.duration}</p>
                </div>
              )}
              {resource.practiceDetails.difficulty && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Difficulty</p>
                  <p>{resource.practiceDetails.difficulty}</p>
                </div>
              )}
              {resource.practiceDetails.technique && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Technique</p>
                  <p>{resource.practiceDetails.technique}</p>
                </div>
              )}
              {resource.practiceDetails.benefits && resource.practiceDetails.benefits.length > 0 && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Benefits</p>
                  <p>{resource.practiceDetails.benefits.join(', ')}</p>
                </div>
              )}
            </div>
            {resource.practiceDetails.instructions && (
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">Instructions</p>
                <div className="prose dark:prose-invert max-w-none">
                  <p>{resource.practiceDetails.instructions}</p>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'retreatcenter':
      case 'retreatcenters':
      case 'retreatCenter':
        return resource.retreatCenterDetails && (
          <div className="mt-8 bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200">Retreat Center Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resource.retreatCenterDetails.name && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Name</p>
                  <p>{resource.retreatCenterDetails.name}</p>
                </div>
              )}
              {resource.retreatCenterDetails.location && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Location</p>
                  <p>{resource.retreatCenterDetails.location}</p>
                </div>
              )}
              {resource.retreatCenterDetails.retreatTypes && resource.retreatCenterDetails.retreatTypes.length > 0 && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Retreat Types</p>
                  <p>{resource.retreatCenterDetails.retreatTypes.join(', ')}</p>
                </div>
              )}
            </div>
            {resource.retreatCenterDetails.upcomingDates && resource.retreatCenterDetails.upcomingDates.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">Upcoming Dates</p>
                <ul className="list-disc pl-5">
                  {resource.retreatCenterDetails.upcomingDates.map((date, index) => (
                    <li key={index}>{date}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      
      case 'website':
        return resource.websiteDetails && (
          <div className="mt-8 bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200">Website Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resource.websiteDetails.websiteName && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Website Name</p>
                  <p>{resource.websiteDetails.websiteName}</p>
                </div>
              )}
              {resource.websiteDetails.creator && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Creator</p>
                  <p>{resource.websiteDetails.creator}</p>
                </div>
              )}
              {resource.websiteDetails.primaryContentTypes && resource.websiteDetails.primaryContentTypes.length > 0 && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Primary Content Types</p>
                  <p>{resource.websiteDetails.primaryContentTypes.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'app':
        return resource.appDetails && (
          <div className="mt-8 bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200">App Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resource.appDetails.appName && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">App Name</p>
                  <p>{resource.appDetails.appName}</p>
                </div>
              )}
              {resource.appDetails.creator && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Creator</p>
                  <p>{resource.appDetails.creator}</p>
                </div>
              )}
              {resource.appDetails.platforms && resource.appDetails.platforms.length > 0 && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Platforms</p>
                  <p>{resource.appDetails.platforms.join(', ')}</p>
                </div>
              )}
              {resource.appDetails.price && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Price</p>
                  <p>{resource.appDetails.price}</p>
                </div>
              )}
              {resource.appDetails.teachers && resource.appDetails.teachers.length > 0 && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Teachers</p>
                  <p>{resource.appDetails.teachers.join(', ')}</p>
                </div>
              )}
              {resource.appDetails.features && resource.appDetails.features.length > 0 && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Features</p>
                  <p>{resource.appDetails.features.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Resource Image */}
      {resource.imageUrl && (
        <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <Image 
            src={resource.imageUrl} 
            alt={resource.title} 
            fill
            className="object-cover"
          />
        </div>
      )}
      
      {/* Resource Description */}
      <div className="prose dark:prose-invert max-w-none mb-8">
        <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">
          About this {resource.type}
        </h2>
        <div className="whitespace-pre-line">
          {resource.description}
        </div>
      </div>
      
      {/* Type-specific Details */}
      {renderTypeSpecificDetails()}
      
      {/* Resource Links */}
      {resource.links && resource.links.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200">Links</h3>
          <div className="flex flex-wrap gap-3">
            {resource.links.map((link, index) => (
              <Link 
                key={index} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-purple-dark transition-colors"
              >
                {link.label || `Link ${index + 1}`}
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Comments Section (Placeholder) */}
      <div className="mt-12 p-6 border border-neutral-200 dark:border-neutral-700 rounded-lg">
        <h3 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">Comments</h3>
        <p className="text-neutral-500 dark:text-neutral-400">Comments feature coming soon...</p>
      </div>
    </div>
  );
};

export default ResourceDetailContent;
