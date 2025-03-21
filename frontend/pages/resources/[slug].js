import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import ResourceDetailHeader from '../../components/resources/ResourceDetailHeader';
import ResourceDetailContent from '../../components/resources/ResourceDetailContent';
import ResourceDetailSidebar from '../../components/resources/ResourceDetailSidebar';
import resourcesService from '../../services/api/resources';
import { normalizeResourceType } from '../../utils/resource-utils';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import * as Typography from '../../components/common/TypographyStyles';

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
  
  useEffect(() => {
    // Only fetch the resource when the slug is available
    if (!slug) return;
    
    fetchResource();
  }, [slug]);
  
  // Handle loading state
  if (loading) {
    return <LoadingSkeleton type="resource" />;
  }
  
  // Handle error state
  if (error || !resource) {
    return (
      <ErrorMessage
        title="Resource Not Found"
        message={error || 'The resource you are looking for does not exist or has been removed.'}
        linkHref="/resources"
        linkText="Browse Resources"
        onRetry={() => {
          setError(null);
          setLoading(true);
          fetchResource();
        }}
      />
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="w-full lg:w-2/3">
            <ResourceDetailContent resource={resource} />
            
            {/* Comments Section (Placeholder) */}
            <div className="mb-6 md:mb-8 p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
              <h2 className="text-2xl font-medium mb-4 text-neutral-800 dark:text-neutral-200 font-lora">Comments</h2>
              <p className="text-neutral-600 dark:text-neutral-400 italic font-inter">Comments feature coming soon...</p>
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
