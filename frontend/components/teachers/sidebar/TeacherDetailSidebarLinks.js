import React from 'react';
import { Globe } from 'lucide-react';

/**
 * TeacherDetailSidebarLinks component
 * Displays external links for a teacher
 * @param {Object} props - Component props
 * @param {Object} props.teacher - Teacher data object
 */
const TeacherDetailSidebarLinks = ({ teacher }) => {
  if (!teacher) return null;
  
  // Get links from teacher data
  const links = teacher.links || [];
  
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
    // If link has a title property, use it
    if (link.title) return link.title;
    if (link.label) return link.label;
    
    // Check if hostname is the main website and return 'Website' as label
    try {
      const url = getLinkUrl(link);
      const hostname = new URL(url).hostname.toLowerCase();
      if (hostname.startsWith('www.') || !hostname.includes('.')) {
        return 'Website';
      }
    } catch (e) {
      // Ignore errors in URL parsing
    }
    
    // Otherwise, format the URL for display
    const url = getLinkUrl(link);
    return formatUrlForDisplay(url);
  };
  
  // Get icon for link based on URL and label
  const getLinkIcon = (url, label) => {
    try {
      // Check for Website label first - highest priority
      if (label && label.toLowerCase() === 'website') {
        return (
          <Globe 
            className="w-5 h-5 mr-2 flex-shrink-0" 
            strokeWidth={1.5} 
            stroke="var(--accent-blue)" 
          />
        );
      }
      
      const hostname = new URL(url).hostname.toLowerCase();
      
      if (hostname.includes('youtube')) {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="#FF0000">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
          </svg>
        );
      }
      
      if (hostname.includes('amazon') || hostname.includes('amzn.to')) {
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-5 h-5 mr-2 flex-shrink-0" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#E47911" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v2.5A2.5 2.5 0 0 1 17.5 22H6.5A2.5 2.5 0 0 1 4 19.5z" /> 
            <path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5v-10A2.5 2.5 0 0 1 6.5 2z" />
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
      
      if (hostname.includes('wikipedia.org')) {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="#000000">
            <path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.931-1.532.029-1.406-3.321-4.293-9.144-5.651-12.409-.251-.601-.441-.987-.619-1.139-.181-.15-.554-.24-1.122-.271-.329-.026-.494-.078-.494-.348 0-.32.039-.415.889-.415h5.014c.742 0 .92.084.92.499 0 .34-.168.433-.572.493-.775.071-1.023.321-.549 1.269.288.562 1.315 2.92 2.892 6.122l2.15-4.504c.397-.813.652-1.393.674-1.729.033-.36-.006-.697-.328-.92-.334-.222-.668-.256-1.275-.256-.19 0-.298-.021-.298-.341 0-.354.298-.388.651-.388h3.61c.694 0 .845.149.845.488 0 .311-.274.441-.98.503-.7.044-.842.199-1.398 1.205-.303.552-1.46 3.053-2.809 6.017l3.248-3.643c.856-.948 1.195-1.278 1.195-1.623 0-.331-.215-.523-.644-.573-.645-.075-.743-.125-.743-.443 0-.251.078-.311.582-.311h3.353c.494 0 .692.069.692.406 0 .27-.166.362-.595.487-.545.158-.752.311-2.054 1.812-1.213 1.414-3.029 3.387-4.716 5.287l.436.895c.901 1.887 1.337 2.778 1.902 2.778.35 0 .758-.404 1.195-1.104.474-.771.556-.845.865-.845.245 0 .413.284.413.706 0 .762-.798 2.222-1.838 2.222-.861 0-1.811-1.381-2.905-4.082l-.437-.908-1.564 1.779c-.857.973-1.24 1.549-1.24 1.864 0 .21.239.361.572.361.493 0 .685.053.685.334 0 .282-.18.388-.621.388h-3.361c-.342 0-.477-.055-.477-.387 0-.275.154-.372.693-.404.708-.044 1.121-.309 2.054-1.383.444-.513.813-.934.992-1.139l-2.432-5.012c-.701 1.515-1.549 3.279-2.342 4.853-.743 1.469-1.32 2.034-2.045 2.034-.696 0-1.097-.517-1.097-1.415 0-.665.302-.864.835-.864.215 0 .41.049.41.251 0 .176-.035.233-.035.364 0 .216.105.33.316.33.245 0 .631-.303 1.152-1.146.742-1.169 1.941-3.805 3.687-8.126l.369-.877z" />
          </svg>
        );
      }
      
      // Add check for "Website" label
      
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
            className="flex items-center px-3 py-2 rounded-md transition-all duration-200 group hover:!bg-[var(--dark-surface-hover)]"
            style={{ 
              backgroundColor: 'var(--surface)', 
              color: 'var(--text-primary)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(255, 255, 255, 0.2)' 
            }}
          >
            <span className="group-hover:scale-110 transition-transform duration-200">
              {icon}
            </span>
            <span className="font-inter truncate">{label}</span>
          </a>
        );
      })}
    </div>
  );
};

export default TeacherDetailSidebarLinks;
