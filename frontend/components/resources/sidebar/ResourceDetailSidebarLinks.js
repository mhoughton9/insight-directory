import React from 'react';

/**
 * ResourceDetailSidebarLinks component
 * Displays external links for a resource
 * @param {Object} props - Component props
 * @param {Object} props.resource - Resource data object
 */
const ResourceDetailSidebarLinks = ({ resource }) => {
  if (!resource) return null;
  
  // Get the appropriate links array based on resource type
  const getResourceLinks = () => {
    const type = resource.type;
    if (!type) return [];
    
    // Extract links from the appropriate type-specific details object
    switch (type) {
      case 'book':
        return resource.bookDetails?.links || [];
      case 'videoChannel':
        return resource.videoChannelDetails?.links || [];
      case 'website':
        return resource.websiteDetails?.links || [];
      case 'blog':
        return resource.blogDetails?.links || [];
      case 'podcast':
        return resource.podcastDetails?.links || [];
      case 'retreatCenter':
        return resource.retreatCenterDetails?.links || [];
      case 'practice':
        return resource.practiceDetails?.links || [];
      case 'app':
        return resource.appDetails?.links || [];
      default:
        return [];
    }
  };
  
  const links = getResourceLinks();
  
  // If no links are available, don't render the component
  if (!links || links.length === 0) return null;
  
  // Format URL for display if no label is provided
  const formatUrlForDisplay = (url) => {
    try {
      const hostname = new URL(url).hostname.replace('www.', '');
      return hostname || url;
    } catch (e) {
      // If URL parsing fails, just return the URL as is
      return url;
    }
  };
  
  // Helper to extract URL from a link that might be in character array format
  const getLinkUrl = (link) => {
    // If link has a url property, use it
    if (link.url) return link.url;
    
    // Check if link is a character array (has numeric keys)
    if (typeof link === 'object') {
      const keys = Object.keys(link).filter(key => !isNaN(parseInt(key)));
      if (keys.length > 0) {
        // Sort the keys numerically to reconstruct the URL in order
        keys.sort((a, b) => parseInt(a) - parseInt(b));
        let url = '';
        for (const key of keys) {
          if (link[key] === undefined) break;
          url += link[key];
        }
        return url;
      }
    }
    
    // Fallback: return the link itself if it's a string
    return typeof link === 'string' ? link : '';
  };
  
  // Helper to get label for a link
  const getLinkLabel = (link) => {
    // If link has a label property, use it
    if (link.label) return link.label;
    
    // Otherwise, format the URL for display
    const url = getLinkUrl(link);
    return formatUrlForDisplay(url);
  };
  
  // Get icon for link based on URL
  const getLinkIcon = (url) => {
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      
      if (hostname.includes('amazon')) {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.42,14.79a2.88,2.88,0,0,0-1.74.56,1.38,1.38,0,0,0-.58,1.16,1.3,1.3,0,0,0,.33.93,1.92,1.92,0,0,0,1.25.35A2.19,2.19,0,0,0,19.5,17a2.3,2.3,0,0,0,.5-1.62v-.57Z"/>
            <path d="M21.13,18.24a.32.32,0,0,1-.35.3c-1.31-.22-1.62-.32-2.38.73a.3.3,0,0,1-.39.06C16.3,18.52,15.1,18,14,18a5.8,5.8,0,0,1-3.27.9c-1.53,0-2.79-1.25-2.79-3.06,0-1.6.88-2.7,2.12-3.22A9.92,9.92,0,0,1,14,12c.52,0,1.12,0,1.73.09,0-.57,0-1-.24-1.39a2.12,2.12,0,0,0-1.31-.49,3.56,3.56,0,0,0-2.35.81.34.34,0,0,1-.31.06.35.35,0,0,1-.22-.25L11,9.56a.34.34,0,0,1,.14-.34A4.9,4.9,0,0,1,14,8.5a3.15,3.15,0,0,1,2.52.89,3.67,3.67,0,0,1,.73,2.57v2.31c0,.69.28,1,.87,1.31a.34.34,0,0,1,.16.31l0,.35ZM3,8.89l0,.29a.34.34,0,0,0,.1.24A20.11,20.11,0,0,0,6.7,12.56a.34.34,0,0,0,.38,0A16.37,16.37,0,0,0,9.44,10a.33.33,0,0,0,.06-.38.34.34,0,0,0-.34-.21H8.27A3.51,3.51,0,0,1,3,8.89Zm19.56,6.33a.34.34,0,0,0-.09-.26c-.16-.12-.37-.08-.52.08a6.46,6.46,0,0,1-3.14,1.77.34.34,0,0,0-.26.33v.47a.34.34,0,0,0,.21.31,6.89,6.89,0,0,0,3.44.13.34.34,0,0,0,.26-.33v-.5h0v-.9h0v-1.1Z"/>
          </svg>
        );
      }
      
      if (hostname.includes('goodreads')) {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18.5A8.5,8.5,0,1,1,20.5,12,8.51,8.51,0,0,1,12,20.5ZM15,7H9V17h6a3,3,0,0,0,3-3V10A3,3,0,0,0,15,7Zm1,7a1,1,0,0,1-1,1H11V9h4a1,1,0,0,1,1,1Z"/>
          </svg>
        );
      }
      
      // Default external link icon
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2 flex-shrink-0 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      );
    } catch (e) {
      // Default icon if URL parsing fails
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2 flex-shrink-0 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      );
    }
  };
  
  return (
    <div className="space-y-2">
      {links.map((link, index) => {
        // Skip invalid links
        if (!link) return null;
        
        const url = getLinkUrl(link);
        if (!url) return null;
        
        const label = getLinkLabel(link);
        const icon = getLinkIcon(url);
        
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-brand-purple hover:text-brand-purple-dark transition-colors group"
          >
            {icon}
            <span className="font-inter truncate">{label}</span>
          </a>
        );
      })}
    </div>
  );
};

export default ResourceDetailSidebarLinks;
