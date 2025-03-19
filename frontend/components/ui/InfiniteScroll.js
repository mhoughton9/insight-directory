import { useEffect, useRef, useState } from 'react';

/**
 * InfiniteScroll component
 * Loads more content when the user scrolls to the bottom of the page
 */
export default function InfiniteScroll({
  loadMore,
  hasMore,
  isLoading,
  loadingComponent,
  endMessage,
  threshold = 200,
  children
}) {
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef(null);
  const loadingRef = useRef(null);
  
  useEffect(() => {
    // Create intersection observer to detect when user scrolls near the bottom
    const options = {
      root: null, // Use viewport as root
      rootMargin: `0px 0px ${threshold}px 0px`, // Trigger when element is within threshold px of viewport
      threshold: 0 // Trigger as soon as any part of the element is visible
    };
    
    observer.current = new IntersectionObserver(handleObserver, options);
    
    // Observe the loading element if it exists
    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }
    
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [threshold, loadingRef.current]);
  
  // Handle intersection observer callback
  const handleObserver = async (entries) => {
    const [entry] = entries;
    
    // If the loading element is intersecting (visible) and we have more items to load
    if (entry.isIntersecting && hasMore && !isLoading && !loadingMore) {
      setLoadingMore(true);
      
      try {
        await loadMore();
      } catch (error) {
        console.error('Error loading more items:', error);
      } finally {
        setLoadingMore(false);
      }
    }
  };
  
  return (
    <div className="infinite-scroll-component">
      {/* Render the children (content) */}
      {children}
      
      {/* Loading indicator */}
      {(isLoading || loadingMore) && loadingComponent && (
        <div className="py-4 text-center">
          {loadingComponent}
        </div>
      )}
      
      {/* End message when no more items to load */}
      {!hasMore && !isLoading && !loadingMore && endMessage && (
        <div className="py-8 text-center">
          {endMessage}
        </div>
      )}
      
      {/* Invisible element that triggers loading more when it becomes visible */}
      <div ref={loadingRef} className="h-1" />
    </div>
  );
}
