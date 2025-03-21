import React from 'react';

/**
 * ResourceDetailSidebarLinks component
 * Displays external links for a resource
 * @param {Object} props - Component props
 * @param {Object} props.resource - Resource data object
 */
const ResourceDetailSidebarLinks = ({ resource }) => {
  if (!resource) return null;
  
  // Check for different possible link structures
  const hasLinks = resource.links && resource.links.length > 0;
  const hasUrl = typeof resource.url === 'string' && resource.url.trim() !== '';
  const hasWebsiteUrl = typeof resource.websiteUrl === 'string' && resource.websiteUrl.trim() !== '';
  
  // If no links are available, don't render the component
  if (!hasLinks && !hasUrl && !hasWebsiteUrl) return null;
  
  // Format URL for display
  const formatUrlForDisplay = (url) => {
    try {
      const hostname = new URL(url).hostname.replace('www.', '');
      return hostname || url;
    } catch (e) {
      // If URL parsing fails, just return the URL as is
      return url;
    }
  };
  
  return (
    <div className="space-y-2">
      {/* Handle array of link objects */}
      {hasLinks && resource.links.map((link, index) => {
        // Skip invalid links
        if (!link || (!link.url && !link.href)) return null;
        
        const url = link.url || link.href;
        const label = link.label || link.title || formatUrlForDisplay(url);
        
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-brand-purple hover:text-brand-purple-dark transition-colors group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2 flex-shrink-0 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span className="font-inter">{label}</span>
          </a>
        );
      })}
      
      {/* Handle direct URL property */}
      {hasUrl && !hasLinks && (
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-brand-purple hover:text-brand-purple-dark transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2 flex-shrink-0 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span className="font-inter">
            {formatUrlForDisplay(resource.url)}
          </span>
        </a>
      )}
      
      {/* Handle website URL property */}
      {hasWebsiteUrl && !hasLinks && !hasUrl && (
        <a
          href={resource.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-brand-purple hover:text-brand-purple-dark transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2 flex-shrink-0 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span className="font-inter">
            {formatUrlForDisplay(resource.websiteUrl)}
          </span>
        </a>
      )}
    </div>
  );
};

export default ResourceDetailSidebarLinks;
