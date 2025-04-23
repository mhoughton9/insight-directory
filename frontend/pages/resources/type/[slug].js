import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import resourcesService from '../../../services/api/resources';
import { formatResourceType, normalizeResourceType, getPluralResourceType } from '../../../utils/resource-utils';
import { Heading, Text } from '../../../components/ui/Typography';

// Components
import ResourceGrid from '../../../components/resources/ResourceGrid';
import BookListLayout from '../../../components/resources/BookListLayout';
import Pagination from '../../../components/ui/Pagination';

/**
 * Resource Type Page
 * Displays resources of a specific type with a simple, clean interface
 */
export default function ResourceTypePage() {
  const router = useRouter();
  const { slug } = router.query;
  const type = slug ? normalizeResourceType(slug) : ''; // Normalize the type for consistency
  const formattedTypeName = formatResourceType(type);
  const pluralTypeName = getPluralResourceType(type);
  
  // State for resources and basic loading/error states
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResources, setTotalResources] = useState(0);
  const ITEMS_PER_PAGE = 12; // Updated to 12 for a uniform 4x3 grid
  
  // Fetch resources of this type
  useEffect(() => {
    if (!router.isReady || !type) return;
    
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simple query to get resources by type with pagination
        const response = await resourcesService.getAll({ 
          type,
          page: currentPage,
          limit: ITEMS_PER_PAGE // Using the constant for consistent grid layout
        });
        
        const fetchedResources = response.resources || [];
        
        setResources(fetchedResources);
        setTotalPages(response.totalPages || 1);
        setTotalResources(response.total || 0);
      } catch (err) {
        setError('Failed to load resources. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResources();
  }, [router.isReady, type, currentPage]); // Add currentPage as a dependency
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle loading state
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
        <title>{pluralTypeName} | Insight Directory</title>
        <meta 
          name="description" 
          content={`Browse this comprehensive collection of ${pluralTypeName.toLowerCase()} for awakening, non-duality, and self-inquiry.`} 
        />
      </Head>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10 text-center">
          <Heading as="h1" size="4xl" className="mb-4">
            {pluralTypeName}
          </Heading>
          <Text size="lg" className="max-w-3xl mx-auto">
            Browse this comprehensive collection of {pluralTypeName.toLowerCase()} about awakening, non-duality, and self-inquiry.
          </Text>
          {totalResources > 0 && (
            <Text 
              size="md" 
              className="mt-2" 
              style={{ color: 'var(--text-secondary)' }} 
            >
              Showing {resources.length} of {totalResources} {totalResources === 1 ? formattedTypeName.toLowerCase() : pluralTypeName.toLowerCase()}
            </Text>
          )}
        </header>

        {error ? (
          <div className="w-full max-w-5xl mx-auto p-8 text-center bg-red-50 dark:bg-red-900/20 rounded-lg">
            <Text size="xl" className="text-red-600 dark:text-red-400">{error}</Text>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {type === 'book' ? (
              <BookListLayout resources={resources} isLoading={isLoading} />
            ) : (
              <ResourceGrid resources={resources} isLoading={isLoading} />
            )}
            
            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  maxDisplayedPages={5}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
