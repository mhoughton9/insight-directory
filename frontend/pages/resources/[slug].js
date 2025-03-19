import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import resourcesService from '../../services/api/resources';
import teachersService from '../../services/api/teachers';
import traditionsService from '../../services/api/traditions';

// UI Components
import ResourceDetailSkeleton from '../../components/resources/ResourceDetailSkeleton';
import ResourceTypeIcon from '../../components/resources/ResourceTypeIcon';
import ResourceDetailHeader from '../../components/resources/ResourceDetailHeader';
import ResourceDetailContent from '../../components/resources/ResourceDetailContent';
import ResourceDetailSidebar from '../../components/resources/ResourceDetailSidebar';

/**
 * Resource detail page component
 * Displays comprehensive information about a single resource
 */
export default function ResourceDetail() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [resource, setResource] = useState(null);
  const [relatedResources, setRelatedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch resource data when slug is available
  useEffect(() => {
    if (!slug) return;
    
    const fetchResourceData = async () => {
      try {
        setLoading(true);
        
        // Fetch resource by slug
        const resourceResponse = await resourcesService.getById(slug);
        // Extract resource from the response object
        const resourceData = resourceResponse.resource || resourceResponse;
        setResource(resourceData);
        
        // Fetch related resources based on tags, traditions, or teachers
        if (resourceData) {
          // Create a query based on resource tags, traditions, or teachers
          const query = {
            tags: resourceData.tags?.join(','),
            limit: 4,
            exclude: resourceData._id
          };
          
          const relatedResponse = await resourcesService.getAll(query);
          // Extract resources from the response object
          const relatedData = relatedResponse.resources || relatedResponse || [];
          setRelatedResources(relatedData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching resource:', err);
        setError('Failed to load resource. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchResourceData();
  }, [slug]);
  
  // Handle loading state
  if (loading) {
    return <ResourceDetailSkeleton />;
  }
  
  // Handle error state
  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
          <h2 className="text-xl font-medium text-red-600 dark:text-red-400 mb-2">Error</h2>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <div className="mt-6 flex justify-center space-x-4">
            <button 
              onClick={() => router.back()} 
              className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-md hover:bg-opacity-90 transition-all"
            >
              Go Back
            </button>
            <button 
              onClick={() => router.push('/resources')} 
              className="px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-opacity-90 transition-all"
            >
              Browse All Resources
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Handle 404 - resource not found
  if (!resource && !loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
          <h2 className="text-xl font-medium mb-2">Resource Not Found</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            The resource you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <button 
              onClick={() => router.back()} 
              className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-md hover:bg-opacity-90 transition-all"
            >
              Go Back
            </button>
            <button 
              onClick={() => router.push('/resources')} 
              className="px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-opacity-90 transition-all"
            >
              Browse All Resources
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{resource?.title} | Awakening Resources Directory</title>
        <meta name="description" content={resource?.description?.substring(0, 160)} />
        <meta property="og:title" content={`${resource?.title} | Awakening Resources Directory`} />
        <meta property="og:description" content={resource?.description?.substring(0, 160)} />
        {resource?.imageUrl && <meta property="og:image" content={resource.imageUrl} />}
      </Head>
      
      <main className="bg-white dark:bg-neutral-900 min-h-screen">
        <ResourceDetailHeader resource={resource} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content */}
            <div className="lg:w-2/3">
              <ResourceDetailContent resource={resource} />
              
              {/* Placeholder Comments section */}
              <section className="mt-16 bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-medium mb-6 text-neutral-800 dark:text-neutral-200">
                  Comments
                </h2>
                <div className="bg-neutral-50 dark:bg-neutral-700 p-6 rounded-lg text-center">
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    Comments functionality will be available in a future update.
                  </p>
                  <button 
                    className="px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled
                  >
                    Leave a Comment
                  </button>
                </div>
              </section>
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3">
              <ResourceDetailSidebar resource={resource} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
