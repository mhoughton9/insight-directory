import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import resourcesService from '../../services/api/resources';
import teachersService from '../../services/api/teachers';
import traditionsService from '../../services/api/traditions';

// Components
import SearchBar from '../../components/filters/SearchBar';
import FilterBar from '../../components/filters/FilterBar';
import ResourceGrid from '../../components/resources/ResourceGrid';
import InfiniteScroll from '../../components/ui/InfiniteScroll';

// Constants
const ITEMS_PER_PAGE = 12;

/**
 * Resources listing page
 * Displays a filterable, searchable grid of resources with infinite scrolling
 */
export default function ResourcesPage() {
  const router = useRouter();
  const { query } = router;
  
  // State for resources and metadata
  const [resources, setResources] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentRequestId, setCurrentRequestId] = useState(0); // Track the latest request
  const [cacheHit, setCacheHit] = useState(false); // Track if data came from cache
  
  // State for filter options
  const [resourceTypes, setResourceTypes] = useState([]);
  const [traditions, setTraditions] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [tags, setTags] = useState([]);
  
  // State for active filters
  const [activeFilters, setActiveFilters] = useState({
    types: [],
    traditions: [],
    teachers: [],
    tags: [],
    sort: 'newest',
    search: ''
  });

  // Ref to track if URL has been updated by our code
  const isUrlUpdatedRef = useRef(false);
  // Ref to track if initial fetch has been done
  const initialFetchDoneRef = useRef(false);
  // Ref to track if we're currently fetching resources
  const fetchingRef = useRef(false);
  
  // Debugging render cycles
  useEffect(() => {
    console.log('========= Component Rendered =========');
    return () => {
      console.log('========= Component Cleanup =========');
    };
  }, []);

  // Perform one-time setup operations
  useEffect(() => {
    console.log('One-time setup effect running');
    
    // Fix: Clean up event listeners and subscriptions when component unmounts
    return () => {
      console.log('Cleaning up resources page');
      // Reset request tracking state to avoid memory leaks
      fetchingRef.current = false;
    };
  }, []);

  // Initialize filters from URL query parameters
  useEffect(() => {
    if (!router.isReady) return;
    
    // Skip if we just updated the URL ourselves
    if (isUrlUpdatedRef.current) {
      isUrlUpdatedRef.current = false;
      return;
    }
    
    console.log('Initializing filters from URL', router.query);
    
    const { type, tradition, teacher, tag, sort, search } = router.query;
    
    // Only update filters if URL parameters exist
    if (type || tradition || teacher || tag || sort || search) {
      const initialFilters = {
        types: type ? type.split(',') : [],
        traditions: tradition ? [tradition] : [], // Single-select now
        teachers: teacher ? [teacher] : [], // Single-select now
        tags: tag ? tag.split(',').slice(0, 3) : [], // Limit to 3 tags
        sort: sort || 'newest',
        search: search || ''
      };
      
      setActiveFilters(initialFilters);
    }
  }, [router.isReady, router.query]);
  
  // Fetch filter options (resource types, traditions, teachers, tags)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch resource types
        const typesResponse = await resourcesService.getResourceTypes();
        console.log('Resource types response:', typesResponse);
        // Use the display names for UI but store the internal values for filtering
        setResourceTypes(typesResponse.types || []);
        
        // Fetch traditions
        const traditionsResponse = await traditionsService.getAll();
        console.log('Traditions response:', traditionsResponse);
        const traditionNames = (traditionsResponse.traditions || []).map(t => t.name);
        setTraditions(traditionNames);
        
        // Fetch teachers
        const teachersResponse = await teachersService.getAll();
        console.log('Teachers response:', teachersResponse);
        const teacherNames = (teachersResponse.teachers || []).map(t => t.name);
        setTeachers(teacherNames);
        
        // Fetch tags (this endpoint might need to be implemented)
        const tagsResponse = await resourcesService.getTags();
        console.log('Tags response:', tagsResponse);
        setTags(tagsResponse.tags || []);
      } catch (err) {
        console.error('Error fetching filter options:', err);
        setError('Failed to load filter options. Please try again later.');
      }
    };
    
    fetchFilterOptions();
  }, []);
  
  // Update URL based on active filters
  const updateUrl = useCallback(() => {
    // Build query parameters
    const params = new URLSearchParams();
    
    // Map display type names back to internal values for API requests
    if (activeFilters.types.length > 0) {
      const typeMapping = {
        'Book': 'book',
        'Blog': 'blog',
        'Video Channel': 'videoChannel',
        'Podcast': 'podcast',
        'Practice': 'practice',
        'Retreat Center': 'retreatCenter',
        'Website': 'website',
        'App': 'app'
      };
      
      const internalTypes = activeFilters.types.map(type => typeMapping[type] || type.toLowerCase());
      params.append('type', internalTypes.join(','));
    }
    
    if (activeFilters.traditions.length > 0) {
      params.append('tradition', activeFilters.traditions.join(','));
    }
    
    if (activeFilters.teachers.length > 0) {
      params.append('teacher', activeFilters.teachers.join(','));
    }
    
    if (activeFilters.tags.length > 0) {
      params.append('tag', activeFilters.tags.join(','));
    }
    
    if (activeFilters.sort) {
      params.append('sort', activeFilters.sort);
    }
    
    if (activeFilters.search) {
      params.append('search', activeFilters.search);
    }
    
    // Update URL with query parameters
    const queryString = params.toString();
    isUrlUpdatedRef.current = true; // Set flag before updating URL
    router.push(
      {
        pathname: '/resources',
        search: queryString ? `?${queryString}` : ''
      },
      undefined,
      { shallow: true }
    );
  }, [activeFilters, router]);
  
  // Update URL when filters change
  useEffect(() => {
    if (router.isReady && initialFetchDoneRef.current) {
      updateUrl();
    }
  }, [activeFilters, router.isReady, updateUrl]);
  
  // Fetch resources based on active filters
  const fetchResources = useCallback(async (pageNum = 1, isNewFilter = false) => {
    // Track fetch status - CRITICAL FOR PREVENTING INFINITE LOOPS
    const fetchId = Date.now();
    console.log(`🚀 Starting fetch ${fetchId}`);
    
    // Prevent duplicate fetches
    if (fetchingRef.current) {
      console.log(`⚠️ Skipping duplicate fetch ${fetchId} - already fetching`);
      return;
    }
    
    // Set fetching flag immediately
    fetchingRef.current = true;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Generate a unique ID for this request
      const requestId = Date.now();
      setCurrentRequestId(requestId);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', pageNum);
      params.append('limit', ITEMS_PER_PAGE);
      
      // Add cache=true to ensure we're not getting cached responses during debugging
      params.append('cache', 'true');
      
      // Map display type names back to internal values for API requests
      if (activeFilters.types.length > 0) {
        // Get the type mapping from the API or use a local mapping
        const typeMapping = {
          'Book': 'book',
          'Blog': 'blog',
          'Video Channel': 'videoChannel',
          'Podcast': 'podcast',
          'Practice': 'practice',
          'Retreat Center': 'retreatCenter',
          'Website': 'website',
          'App': 'app'
        };
        
        // Map display names to internal values
        const internalTypes = activeFilters.types.map(type => typeMapping[type] || type.toLowerCase());
        params.append('type', internalTypes.join(','));
      }
      
      if (activeFilters.traditions.length > 0) {
        params.append('tradition', activeFilters.traditions.join(','));
      }
      
      if (activeFilters.teachers.length > 0) {
        params.append('teacher', activeFilters.teachers.join(','));
      }
      
      if (activeFilters.tags.length > 0) {
        params.append('tag', activeFilters.tags.join(','));
      }
      
      if (activeFilters.sort) {
        params.append('sort', activeFilters.sort);
      }
      
      if (activeFilters.search) {
        params.append('search', activeFilters.search);
      }
      
      console.log('Fetching resources with params:', Object.fromEntries(params));
      
      // Fetch resources from API
      const response = await resourcesService.getAll(params);
      console.log('Resources API response:', response);
      
      // Debug the resources structure
      if (response.resources && response.resources.length > 0) {
        console.log('🟢 SUCCESS: Resources returned from API:', response.resources.length);
        console.log('First resource structure:', response.resources[0]);
      } else {
        console.log('⚠️ API returned no resources or empty array');
        console.log('Response structure:', response);
      }
      
      // Only update state if this is still the latest request
      if (requestId === currentRequestId) {
        if (isNewFilter || pageNum === 1) {
          console.log('🔄 Setting resources:', response.resources || []);
          // Ensure each resource has a slug for the ResourceCard component
          const processedResources = (response.resources || []).map(resource => {
            // If resource doesn't have a slug, generate one from the title or use _id
            if (!resource.slug && resource.title) {
              resource.slug = resource.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '') // Remove non-word chars
                .replace(/[\s_-]+/g, '-') // Replace spaces with hyphens
                .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
            } else if (!resource.slug && resource._id) {
              resource.slug = resource._id;
            }
            return resource;
          });
          setResources(processedResources);
        } else {
          console.log('Appending resources:', response.resources || []);
          // Process new resources before appending
          const processedNewResources = (response.resources || []).map(resource => {
            if (!resource.slug && resource.title) {
              resource.slug = resource.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
            } else if (!resource.slug && resource._id) {
              resource.slug = resource._id;
            }
            return resource;
          });
          setResources(prev => [...prev, ...processedNewResources]);
        }
        
        setPage(pageNum);
        setHasMore((response.resources || []).length === ITEMS_PER_PAGE);
        setCacheHit(response.cached || false);
        initialFetchDoneRef.current = true; // Mark initial fetch as complete
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
      console.error('Error details:', err.message, err.stack);
      if (err.response?.status === 404) {
        setError('No resources found matching your criteria.');
      } else {
        setError('Failed to load resources. Please try again later.');
      }
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, []);  // Empty dependency array to prevent re-creation
  
  // Handle direct fetching without complex state dependencies
  const directFetch = async () => {
    console.log('🔍 Direct fetch started');
    setIsLoading(true);
    setError(null);
    
    try {
      // Make a simple API call with minimal parameters
      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('limit', ITEMS_PER_PAGE);
      
      console.log('Making direct API call...');
      const response = await resourcesService.getAll(params);
      console.log('Direct API response:', response);
      
      if (response.resources && response.resources.length > 0) {
        console.log(`✅ SUCCESS: Received ${response.resources.length} resources directly`);
        console.log('First resource:', response.resources[0]);
        
        // Update the resources state directly
        setResources(response.resources);
        setPage(1);
        setHasMore(response.resources.length === ITEMS_PER_PAGE);
      } else {
        console.log('❌ No resources returned from direct fetch');
        setResources([]);
      }
    } catch (err) {
      console.error('Error in direct fetch:', err);
      setError('Failed to load resources. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add a button to trigger direct fetch for testing
  useEffect(() => {
    if (router.isReady) {
      // Try a direct fetch on component mount
      directFetch();
    }
  }, [router.isReady]);
  
  // Initial fetch of resources - using the direct fetch approach which works properly
  useEffect(() => {
    // Only run this effect once when the router is ready
    if (router.isReady && !initialFetchDoneRef.current) {
      console.log('Router is ready, fetching initial resources');
      initialFetchDoneRef.current = true; // Mark as done immediately to prevent refetching
      directFetch(); // Use our simpler direct fetch that works
    }
  }, [router.isReady]); // Only depend on router.isReady
  
  // We've already done all the needed fetches, so remove the other fetch effects
  // that were causing the render loop
  
  // Handle filter changes
  const handleFilterChange = (filters) => {
    console.log('Filter changed:', filters);
    setActiveFilters(prev => ({
      ...prev,
      ...filters
    }));
    
    // Reset page
    setPage(1);
  };
  
  // Handle search
  const handleSearch = (searchTerm) => {
    console.log('Search term:', searchTerm);
    setActiveFilters(prev => ({
      ...prev,
      search: searchTerm
    }));
    
    // Reset page
    setPage(1);
  };
  
  return (
    <>
      <Head>
        <title>All Resources | Awakening Resources Directory</title>
        <meta name="description" content="Browse our curated collection of spiritual awakening, non-duality, and self-inquiry resources." />
      </Head>
      
      <main className="bg-white dark:bg-neutral-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">All Resources</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Browse our curated collection of spiritual awakening, non-duality, and self-inquiry resources. Use the filters and search to find exactly what you're looking for.
            </p>
          </div>
          
          <SearchBar onSearch={handleSearch} initialValue={activeFilters.search} />
          
          <div className="mt-6 flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4 xl:w-1/5">
              <FilterBar
                resourceTypes={resourceTypes}
                traditions={traditions}
                teachers={teachers}
                tags={tags}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
              />
            </div>
            
            <div className="lg:w-3/4 xl:w-4/5">
              {error ? (
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                  <button
                    onClick={() => fetchResources(1, true)}
                    className="mt-4 px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-opacity-90 transition-all"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <InfiniteScroll
                  loadMore={() => fetchResources(page + 1, false)}
                  hasMore={hasMore && !isLoading}
                  loader={<div className="text-center py-4">Loading more resources...</div>}
                  endMessage={
                    resources.length > 0 && (
                      <div className="text-center py-4 text-neutral-600 dark:text-neutral-400">
                        You've seen all available resources
                      </div>
                    )
                  }
                >
                  <ResourceGrid 
                    resources={resources} 
                    isLoading={isLoading && resources.length === 0} 
                    searchTerm={activeFilters.search}
                  />
                  
                  {isLoading && resources.length > 0 && (
                    <div className="flex justify-center mt-6">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  )}
                </InfiniteScroll>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
