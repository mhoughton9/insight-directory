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
  
  // Get icon for link based on URL and label
  const getLinkIcon = (url, label) => {
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      
      if (hostname.includes('youtube')) {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="#FF0000">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
          </svg>
        );
      }
      
      // Show a book icon for Amazon links (by label or URL)
      if ((hostname && hostname.includes('amazon')) || (label && label.toLowerCase().includes('amazon'))) {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#E47911" strokeWidth="2">
            <rect x="5" y="3" width="14" height="18" rx="2" fill="#fff"/>
            <path d="M8 6h8M8 10h8M8 14h6" stroke="#E47911" strokeWidth="1.5" strokeLinecap="round"/>
            <rect x="5" y="3" width="14" height="18" rx="2" stroke="#E47911" strokeWidth="2"/>
          </svg>
        );
      }
      
      if (hostname.includes('goodreads')) {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#553B08" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        );
      }
      
      if (hostname.includes('spotify')) {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="#1DB954">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        );
      }
      
      if (hostname.includes('apple.com')) {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="#A2AAAD">
            <path d="M22 17.607c-.786 2.28-3.139 6.317-5.563 6.361-1.608.031-2.125-.953-3.963-.953-1.837 0-2.412.923-3.932.983-2.572.099-6.542-5.827-6.542-10.995 0-4.747 3.308-7.1 6.198-7.143 1.55-.028 3.014 1.045 3.959 1.045.949 0 2.727-1.29 4.596-1.101.782.033 2.979.315 4.389 2.377-3.741 2.442-3.158 7.549.858 9.426zm-5.222-17.607c-2.826.114-5.132 3.079-4.81 5.531 2.612.203 5.118-2.725 4.81-5.531z"/>
          </svg>
        );
      }
      
      if (hostname.includes('google.com')) {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="#4285F4">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
          </svg>
        );
      }
      
      // Website icon with more color and style - simpler version without gradients
      if (label === 'Website') {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#6366F1" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      }
      
      // Default external link icon with enhanced styling
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#6B7280" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      );
    } catch (e) {
      // Default icon if URL parsing fails
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#6B7280" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      );
    }
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link, index) => {
        // Skip invalid links
        if (!link) return null;
        
        const url = getLinkUrl(link);
        if (!url) return null;
        
        const label = getLinkLabel(link);
        const icon = getLinkIcon(url, label);
        
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md transition-all duration-200 group"
          >
            <span className="text-gray-600 group-hover:scale-110 transition-transform duration-200">
              {icon}
            </span>
            <span className="font-inter truncate">{label}</span>
          </a>
        );
      })}
    </div>
  );
};

export default ResourceDetailSidebarLinks;
