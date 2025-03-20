import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import ResourceDetailHeader from '../../components/resources/ResourceDetailHeader';
import ResourceDetailContent from '../../components/resources/ResourceDetailContent';
import ResourceDetailSidebar from '../../components/resources/ResourceDetailSidebar';
import ResourceDetailSkeleton from '../../components/resources/ResourceDetailSkeleton';
import resourcesService from '../../services/api/resources';
import { normalizeResourceType } from '../../utils/resource-utils';

/**
 * ResourceDetailPage component
 * Displays detailed information about a specific resource
 */
const ResourceDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Only fetch the resource when the slug is available
    if (!slug) return;
    
    const fetchResource = async () => {
      try {
        setLoading(true);
        const response = await resourcesService.getById(slug);
        
        // Extract resource data from the response
        // API might return { resource: {...} } or the resource directly
        const resourceData = response.resource || response;
        
        if (resourceData) {
          console.log('Resource loaded:', resourceData.title);
          setResource(resourceData);
          setError(null);
        } else {
          setError('Resource not found');
        }
      } catch (err) {
        console.error('Error fetching resource:', err);
        setError(err.message || 'Failed to load resource');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResource();
  }, [slug]);
  
  // Handle loading state
  if (loading) {
    return <ResourceDetailSkeleton />;
  }
  
  // Handle error state
  if (error || !resource) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-medium text-neutral-800 dark:text-neutral-200 mb-4 font-lora">
          Resource Not Found
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8 font-inter">
          {error || 'The resource you are looking for does not exist or has been removed.'}
        </p>
        <Link 
          href="/resources"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-purple hover:bg-brand-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple transition-colors font-inter"
        >
          Browse Resources
        </Link>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{resource.title} | Insight Directory</title>
        <meta 
          name="description" 
          content={resource.description ? resource.description.substring(0, 160) : `Explore ${resource.title}, a ${normalizeResourceType(resource.type)} resource for spiritual awakening and non-duality.`}
        />
      </Head>
      
      {/* Resource Header */}
      <ResourceDetailHeader resource={resource} />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Main Content */}
          <div className="w-full lg:w-2/3">
            <ResourceDetailContent resource={resource} />
            
            {/* Comments Section (Placeholder) */}
            <div className="mt-12 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
              <h3 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200 font-lora">Comments</h3>
              <p className="text-neutral-500 dark:text-neutral-400 italic font-inter">Comments feature coming soon...</p>
            </div>
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="w-full lg:w-1/3">
            <ResourceDetailSidebar resource={resource} />
          </div>
        </div>
      </main>
    </>
  );
};

export default ResourceDetailPage;
