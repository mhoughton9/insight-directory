import { NextApiRequest, NextApiResponse } from 'next';

/**
 * API Route: /api/admin/bulk-import
 * 
 * Handles bulk import of various entity types (resources, teachers, traditions)
 * Forwards the request to the backend
 */
export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    console.log('Frontend API route - Bulk import request received');
    console.log('Frontend API route - Request query:', req.query);
    console.log('Frontend API route - Request body:', req.body);
    
    // Get the entity type from query parameters
    const { entityType = 'resource' } = req.query;
    console.log('Frontend API route - Entity type:', entityType);
    
    // Extract the entities from the request body
    let { entities } = req.body;
    console.log('Frontend API route - Entities count:', entities ? entities.length : 0);
    
    if (!entities || !Array.isArray(entities) || entities.length === 0) {
      console.log('Frontend API route - Invalid entities array');
      return res.status(400).json({ message: `Invalid request: ${entityType}s must be a non-empty array` });
    }
    
    // Process entities for proper structure before sending to backend
    if (entityType === 'resource') {
      entities = entities.map(entity => {
        // Create a deep copy to avoid mutating the original object
        const processedEntity = { ...entity };
        
        // Handle book-specific fields
        if (entity.type === 'book') {
          // Create or update bookDetails object
          processedEntity.bookDetails = processedEntity.bookDetails || {};
          
          // Move book-specific fields into bookDetails object
          if (entity.author) {
            // Ensure author is an array
            processedEntity.bookDetails.author = Array.isArray(entity.author) ? entity.author : [entity.author];
            delete processedEntity.author; // Remove from top level
          }
          
          if (entity.yearPublished !== undefined) {
            processedEntity.bookDetails.yearPublished = entity.yearPublished;
            delete processedEntity.yearPublished; // Remove from top level
          }
          
          if (entity.pages !== undefined) {
            processedEntity.bookDetails.pages = entity.pages;
            delete processedEntity.pages; // Remove from top level
          }
          
          if (entity.publisher) {
            processedEntity.bookDetails.publisher = entity.publisher;
            delete processedEntity.publisher; // Remove from top level
          }
          
          if (entity.isbn) {
            processedEntity.bookDetails.isbn = entity.isbn;
            delete processedEntity.isbn; // Remove from top level
          }
        }
        
        // Handle videoChannel-specific fields
        if (entity.type === 'videoChannel') {
          processedEntity.videoChannelDetails = processedEntity.videoChannelDetails || {};
          
          // Move fields into videoChannelDetails object
          if (entity.channelName) {
            processedEntity.videoChannelDetails.channelName = entity.channelName;
            delete processedEntity.channelName;
          }
          
          if (entity.creator) {
            processedEntity.videoChannelDetails.creator = Array.isArray(entity.creator) ? 
              entity.creator : [entity.creator];
            // Don't delete creator from top level as it's a standard field
          }
          
          // Handle keyTopics field
          if (entity.keyTopics) {
            processedEntity.videoChannelDetails.keyTopics = Array.isArray(entity.keyTopics) ? 
              entity.keyTopics : [entity.keyTopics];
            delete processedEntity.keyTopics;
          }
        }
        
        // Handle podcast-specific fields
        if (entity.type === 'podcast') {
          processedEntity.podcastDetails = processedEntity.podcastDetails || {};
          
          if (entity.podcastName) {
            processedEntity.podcastDetails.podcastName = entity.podcastName;
            delete processedEntity.podcastName;
          }
          
          if (entity.hosts) {
            processedEntity.podcastDetails.hosts = Array.isArray(entity.hosts) ? 
              entity.hosts : [entity.hosts];
            delete processedEntity.hosts;
          }
          
          // Handle datesActive field
          if (entity.datesActive) {
            processedEntity.podcastDetails.datesActive = entity.datesActive;
            delete processedEntity.datesActive;
          }
          
          // Handle notableGuests field
          if (entity.notableGuests) {
            processedEntity.podcastDetails.notableGuests = Array.isArray(entity.notableGuests) ? 
              entity.notableGuests : [entity.notableGuests];
            delete processedEntity.notableGuests;
          }
        }
        
        // Handle website-specific fields
        if (entity.type === 'website') {
          processedEntity.websiteDetails = processedEntity.websiteDetails || {};
          
          if (entity.websiteName) {
            processedEntity.websiteDetails.websiteName = entity.websiteName;
            delete processedEntity.websiteName;
          }
          
          if (entity.creator) {
            processedEntity.websiteDetails.creator = Array.isArray(entity.creator) ? 
              entity.creator : [entity.creator];
            // Don't delete creator from top level as it's a standard field
          }
          
          // Handle primaryContentTypes field
          if (entity.primaryContentTypes) {
            processedEntity.websiteDetails.primaryContentTypes = Array.isArray(entity.primaryContentTypes) ? 
              entity.primaryContentTypes : [entity.primaryContentTypes];
            delete processedEntity.primaryContentTypes;
          }
          
          // Handle link field
          if (entity.link) {
            processedEntity.websiteDetails.link = entity.link;
            delete processedEntity.link;
            
            // Convert link to links array if needed
            if (!processedEntity.websiteDetails.links || !processedEntity.websiteDetails.links.length) {
              processedEntity.websiteDetails.links = [{
                url: entity.link,
                label: 'Website'
              }];
            }
          }
        }
        
        // Handle blog-specific fields
        if (entity.type === 'blog') {
          processedEntity.blogDetails = processedEntity.blogDetails || {};
          
          if (entity.name) {
            processedEntity.blogDetails.name = entity.name;
            delete processedEntity.name;
          }
          
          // Handle author field
          if (entity.author) {
            processedEntity.blogDetails.author = Array.isArray(entity.author) ? 
              entity.author : [entity.author];
            delete processedEntity.author;
          }
          
          // Handle frequency field
          if (entity.frequency) {
            processedEntity.blogDetails.frequency = entity.frequency;
            delete processedEntity.frequency;
          }
          
          // Handle link field
          if (entity.link) {
            processedEntity.blogDetails.link = entity.link;
            delete processedEntity.link;
            
            // Convert link to links array if needed
            if (!processedEntity.blogDetails.links || !processedEntity.blogDetails.links.length) {
              processedEntity.blogDetails.links = [{
                url: entity.link,
                label: 'Blog'
              }];
            }
          }
        }
        
        // Handle practice-specific fields
        if (entity.type === 'practice') {
          processedEntity.practiceDetails = processedEntity.practiceDetails || {};
          
          if (entity.name) {
            processedEntity.practiceDetails.name = entity.name;
            delete processedEntity.name;
          }
          
          // Handle originator field
          if (entity.originator) {
            processedEntity.practiceDetails.originator = Array.isArray(entity.originator) ? 
              entity.originator : [entity.originator];
            // Also set the creator field for consistency
            processedEntity.creator = Array.isArray(entity.originator) ? 
              [...entity.originator] : [entity.originator];
            delete processedEntity.originator;
          }
          
          // Handle duration field
          if (entity.duration) {
            processedEntity.practiceDetails.duration = entity.duration;
            delete processedEntity.duration;
          }
          
          // Handle links field
          if (entity.links) {
            processedEntity.practiceDetails.links = Array.isArray(entity.links) ? 
              entity.links.map(link => typeof link === 'string' ? { url: link, label: 'Practice Link' } : link) : 
              [{ url: entity.links, label: 'Practice Link' }];
            delete processedEntity.links;
          }
        }
        
        // Handle retreatCenter-specific fields
        if (entity.type === 'retreatCenter') {
          processedEntity.retreatCenterDetails = processedEntity.retreatCenterDetails || {};
          
          if (entity.name) {
            processedEntity.retreatCenterDetails.name = entity.name;
            delete processedEntity.name;
          }
          
          // Handle location field
          if (entity.location) {
            processedEntity.retreatCenterDetails.location = entity.location;
            delete processedEntity.location;
          }
          
          // Handle creator field
          if (entity.creator) {
            processedEntity.retreatCenterDetails.creator = Array.isArray(entity.creator) ? 
              entity.creator : [entity.creator];
            // Don't delete creator from top level as it's a standard field
          }
          
          // Handle retreatTypes field (if present)
          if (entity.retreatTypes) {
            processedEntity.retreatCenterDetails.retreatTypes = Array.isArray(entity.retreatTypes) ? 
              entity.retreatTypes : [entity.retreatTypes];
            delete processedEntity.retreatTypes;
          }
          
          // Handle upcomingDates field (if present)
          if (entity.upcomingDates) {
            processedEntity.retreatCenterDetails.upcomingDates = Array.isArray(entity.upcomingDates) ? 
              entity.upcomingDates : [entity.upcomingDates];
            delete processedEntity.upcomingDates;
          }
        }
        
        return processedEntity;
      });
    }
    
    // Forward the request to the backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const backendEndpoint = `${backendUrl}/api/admin/bulk-import?entityType=${entityType}`;
    console.log('Frontend API route - Sending request to backend:', backendEndpoint);
    
    const requestBody = { entities };
    console.log('Frontend API route - Request body to backend:', requestBody);
    
    const response = await fetch(backendEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    // Get the response from the backend
    const data = await response.json();
    console.log('Frontend API route - Backend response status:', response.status);
    console.log('Frontend API route - Backend response data:', data);
    
    // Return the response
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error in bulk import API route:', error);
    return res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
}
