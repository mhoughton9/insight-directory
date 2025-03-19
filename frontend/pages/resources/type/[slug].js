import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import resourcesService from '../../../services/api/resources';
import teachersService from '../../../services/api/teachers';
import traditionsService from '../../../services/api/traditions';
import { formatResourceType, normalizeResourceType } from '../../../utils/resource-utils';

// Components
import SearchBar from '../../../components/filters/SearchBar';
import FilterBar from '../../../components/filters/FilterBar';
import ResourceGrid from '../../../components/resources/ResourceGrid';
import InfiniteScroll from '../../../components/ui/InfiniteScroll';

// Constants
const ITEMS_PER_PAGE = 12;

/**
 * Resource Type Page
 * Displays resources of a specific type with filtering and search capabilities
 */
export default function ResourceTypePage() {
  const router = useRouter();
  const { slug } = router.query;
  const type = slug ? normalizeResourceType(slug) : ''; // Normalize the type for consistency
  const formattedTypeName = formatResourceType(type);
  
  // State for resources and metadata
  const [resources, setResources] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentRequestId, setCurrentRequestId] = useState(0); // Track the latest request
  const [cacheHit, setCacheHit] = useState(false); // Track if data came from cache
  
  // State for filter options
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
  
  // Initialize filters from URL query parameters
  useEffect(() => {
    if (!router.isReady || !type) return;
    
    const { tradition, teacher, tag, sort, search } = router.query;
    
    // Only update filters if URL parameters exist
    if (tradition || teacher || tag || sort || search) {
      const initialFilters = {
        types: [type], // Always include the current type
        traditions: tradition ? tradition.split(',') : [],
        teachers: teacher ? teacher.split(',') : [],
        tags: tag ? tag.split(',') : [],
        sort: sort || 'newest',
        search: search || ''
      };
      
      setActiveFilters(initialFilters);
    }
  }, [router.isReady, router.query, type]);
  
  // Fetch filter options (traditions, teachers, tags)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch traditions
        const traditionsResponse = await traditionsService.getAll();
        const traditionNames = (traditionsResponse.traditions || []).map(t => t.name);
        setTraditions(traditionNames);
        
        // Fetch teachers
        const teachersResponse = await teachersService.getAll();
        const teacherNames = (teachersResponse.teachers || []).map(t => t.name);
        setTeachers(teacherNames);
        
        // Fetch tags
        const tagsResponse = await resourcesService.getTags();
        setTags(tagsResponse.tags || []);
      } catch (err) {
        console.error('Error fetching filter options:', err);
        setError('Failed to load filter options. Please try again later.');
      }
    };
    
    fetchFilterOptions();
  }, []);
  
  // Fetch resources based on active filters
  const fetchResources = useCallback(async (pageNum = 1, append = false) => {
    if (!type) return;
    
    // Generate a unique request ID for this call
    const requestId = currentRequestId + 1;
    setCurrentRequestId(requestId);
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare query parameters
      const queryParams = {
        page: pageNum,
        limit: ITEMS_PER_PAGE,
        sort: activeFilters.sort,
        type: type // Always filter by the current type
      };
      
      // Add filter parameters if they exist
      if (activeFilters.traditions.length > 0) {
        queryParams.tradition = activeFilters.traditions.join(',');
      }
      
      if (activeFilters.teachers.length > 0) {
        queryParams.teacher = activeFilters.teachers.join(',');
      }
      
      if (activeFilters.tags.length > 0) {
        queryParams.tag = activeFilters.tags.join(',');
      }
      
      if (activeFilters.search) {
        queryParams.search = activeFilters.search;
      }
      
      // Fetch resources with filters
      const response = await resourcesService.getAll(queryParams);
      
      // Only update state if this is still the most recent request
      if (requestId === currentRequestId) {
        const fetchedResources = response.resources || [];
        setCacheHit(response.cached || false);
        
        // Update state based on append flag
        if (append) {
          setResources(prev => [...prev, ...fetchedResources]);
        } else {
          setResources(fetchedResources);
        }
        
        // Check if there are more resources to load
        setHasMore(fetchedResources.length === ITEMS_PER_PAGE);
        setPage(pageNum);
      }
    } catch (err) {
      // Only show error if this is still the most recent request
      if (requestId === currentRequestId) {
        console.error('Error fetching resources:', err);
        setError('Failed to load resources. Please try again later.');
      }
    } finally {
      if (requestId === currentRequestId) {
        setIsLoading(false);
      }
    }
  }, [activeFilters, type, currentRequestId]);
  
  // Initial fetch of resources
  useEffect(() => {
    if (router.isReady && type) {
      fetchResources(1, false);
    }
  }, [fetchResources, router.isReady, type]);
  
  // Load more resources when scrolling
  const loadMoreResources = async () => {
    if (!hasMore || isLoading) return;
    await fetchResources(page + 1, true);
  };
  
  // Handle filter changes
  const handleFilterChange = (filters) => {
    // Keep the type filter fixed
    const updatedFilters = {
      ...filters,
      types: [type] // Always keep the current type
    };
    
    setActiveFilters(prev => ({
      ...prev,
      ...updatedFilters
    }));
    
    // Update URL query parameters
    const queryParams = {};
    
    if (filters.traditions && filters.traditions.length > 0) {
      queryParams.tradition = filters.traditions.join(',');
    }
    
    if (filters.teachers && filters.teachers.length > 0) {
      queryParams.teacher = filters.teachers.join(',');
    }
    
    if (filters.tags && filters.tags.length > 0) {
      queryParams.tag = filters.tags.join(',');
    }
    
    if (filters.sort && filters.sort !== 'newest') {
      queryParams.sort = filters.sort;
    }
    
    if (activeFilters.search) {
      queryParams.search = activeFilters.search;
    }
    
    // Update URL without full page reload
    router.push({
      pathname: router.pathname,
      query: queryParams
    }, undefined, { shallow: true });
  };
  
  // Handle search input
  const handleSearch = (searchQuery) => {
    setActiveFilters(prev => ({
      ...prev,
      search: searchQuery
    }));
    
    // Update URL query parameters
    const queryParams = { ...router.query };
    
    if (searchQuery) {
      queryParams.search = searchQuery;
    } else {
      delete queryParams.search;
    }
    
    // Update URL without reloading the page
    router.push({
      pathname: `/resources/type/${slug}`,
      query: queryParams
    }, undefined, { shallow: true });
    
    // Reset to first page and fetch resources
    setPage(1);
    fetchResources(1, false);
  };
  
  // Handle retry after error
  const handleRetry = useCallback(() => {
    fetchResources(page, false);
  }, [fetchResources, page]);
  
  // If the page is not ready or type is not available, show loading
  if (!router.isReady || !type) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{formattedTypeName} Resources | Awakening Resources Directory</title>
        <meta 
          name="description" 
          content={`Browse our curated collection of ${formattedTypeName.toLowerCase()} resources for spiritual awakening, non-duality, and self-inquiry.`} 
        />
      </Head>
      
      <main className="bg-white dark:bg-neutral-900 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              {formattedTypeName} Resources
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-3xl">
              Browse our curated collection of {formattedTypeName.toLowerCase()} resources for spiritual awakening, non-duality, and self-inquiry.
              Use the filters and search to find exactly what you're looking for.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar 
              onSearch={handleSearch} 
              initialQuery={activeFilters.search}
              placeholder={`Search ${formattedTypeName} resources...`}
            />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar with Filters */}
            <div className="lg:w-1/4">
              <FilterBar 
                resourceTypes={[]} // No need to show resource types since we're on a specific type page
                traditions={traditions}
                teachers={teachers}
                tags={tags}
                onFilterChange={handleFilterChange}
                initialFilters={{
                  types: activeFilters.types,
                  traditions: activeFilters.traditions,
                  teachers: activeFilters.teachers,
                  tags: activeFilters.tags,
                  sort: activeFilters.sort
                }}
                hideResourceTypeFilter={true} // Hide the resource type filter on type-specific pages
              />
            </div>
            
            {/* Main Content */}
            <div className="lg:w-3/4">
              {error && (
                <div className="p-4 my-4 bg-red-50 text-red-700 rounded-md">
                  <p>{error}</p>
                  <button 
                    onClick={handleRetry}
                    className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
              {error ? null : (
                <InfiniteScroll
                  loadMore={loadMoreResources}
                  hasMore={hasMore}
                  isLoading={isLoading}
                  loadingComponent={
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2 text-neutral-600 dark:text-neutral-400">Loading more resources...</span>
                    </div>
                  }
                  endMessage={
                    <p className="text-neutral-600 dark:text-neutral-400 text-center">
                      You've reached the end of the list
                    </p>
                  }
                >
                  <ResourceGrid resources={resources} isLoading={isLoading && page === 1} />
                </InfiniteScroll>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
