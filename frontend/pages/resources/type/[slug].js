import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import resourcesService from '../../../services/api/resources';
import { formatResourceType, normalizeResourceType } from '../../../utils/resource-utils';

// Components
import ResourceGrid from '../../../components/resources/ResourceGrid';

/**
 * Resource Type Page
 * Displays resources of a specific type with a simple, clean interface
 */
export default function ResourceTypePage() {
  const router = useRouter();
  const { slug } = router.query;
  const type = slug ? normalizeResourceType(slug) : ''; // Normalize the type for consistency
  const formattedTypeName = formatResourceType(type);
  
  // State for resources and basic loading/error states
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch resources of this type
  useEffect(() => {
    if (!router.isReady || !type) return;
    
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching resources for type:', type); // Debug log
        
        // Simple query to get resources by type
        const response = await resourcesService.getAll({ type });
        const fetchedResources = response.resources || [];
        
        console.log('Fetched resources:', fetchedResources.length); // Debug log
        
        setResources(fetchedResources);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to load resources. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResources();
  }, [router.isReady, type]);
  
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
            </p>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            {error && (
              <div className="p-4 my-4 bg-red-50 text-red-700 rounded-md">
                <p>{error}</p>
              </div>
            )}
            {error ? null : (
              <ResourceGrid resources={resources} isLoading={isLoading} />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
