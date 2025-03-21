import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import resourcesService from '../../../services/api/resources';
import { formatResourceType, normalizeResourceType, getPluralResourceType } from '../../../utils/resource-utils';

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
  const pluralTypeName = getPluralResourceType(type);
  
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
        
        // Debug logging
        console.log('Fetching resources for type:', type);
        
        // Simple query to get resources by type
        const response = await resourcesService.getAll({ type });
        const fetchedResources = response.resources || [];
        
        // More detailed debug logging
        console.log(`Fetched ${fetchedResources.length} resources`);
        if (fetchedResources.length > 0) {
          console.log('First resource full data:', JSON.stringify(fetchedResources[0], null, 2));
          console.log('Resource type:', fetchedResources[0].type);
          console.log('Checking for nested details:', {
            bookDetails: fetchedResources[0].bookDetails,
            podcastDetails: fetchedResources[0].podcastDetails,
            videoChannelDetails: fetchedResources[0].videoChannelDetails,
            retreatCenterDetails: fetchedResources[0].retreatCenterDetails,
            blogDetails: fetchedResources[0].blogDetails,
            appDetails: fetchedResources[0].appDetails
          });
        }
        
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
        <title>{pluralTypeName} | Insight Directory</title>
        <meta 
          name="description" 
          content={`Browse this comprehensive collection of ${pluralTypeName.toLowerCase()} for awakening, non-duality, and self-inquiry.`} 
        />
      </Head>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-medium text-neutral-900 dark:text-white mb-4" style={{ fontFamily: 'Lora, serif' }}>
            {pluralTypeName}
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Browse this comprehensive collection of {pluralTypeName.toLowerCase()} about awakening, non-duality, and self-inquiry.
          </p>
        </header>

        {error ? (
          <div className="w-full max-w-5xl mx-auto p-8 text-center bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <ResourceGrid resources={resources} isLoading={isLoading} />
        )}
      </div>
    </>
  );
}
