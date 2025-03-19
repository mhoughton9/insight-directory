import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import resourcesService from '../../services/api/resources';

// UI Components
import ResourceDetailSkeleton from '../../components/resources/ResourceDetailSkeleton';
import ResourceTypeIcon from '../../components/resources/ResourceTypeIcon';

/**
 * Resource detail page component
 * Displays essential information about a single resource
 */
export default function ResourceDetail() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [resource, setResource] = useState(null);
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
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Resource Header */}
          <div className="mb-8 border-b border-neutral-200 dark:border-neutral-700 pb-6">
            <div className="flex items-center mb-4">
              <div className="mr-3">
                <ResourceTypeIcon type={resource.type} size="md" />
              </div>
              <div>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {resource.type}
                </span>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
              {resource.title}
            </h1>
            
            {resource.imageUrl && (
              <div className="mb-6 relative rounded-lg overflow-hidden w-full h-64 md:h-80">
                <Image 
                  src={resource.imageUrl} 
                  alt={resource.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
          
          {/* Resource Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-2">Description</h2>
              <p className="text-neutral-700 dark:text-neutral-300">
                {resource.description}
              </p>
            </div>
            
            {resource.url && (
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-2">Link</h2>
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-purple hover:text-brand-purple-dark transition-colors"
                >
                  {resource.url}
                </a>
              </div>
            )}
            
            {resource.teachers && resource.teachers.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-2">Teachers</h2>
                <div className="flex flex-wrap gap-2">
                  {resource.teachers.map(teacher => (
                    <span 
                      key={teacher} 
                      className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm"
                    >
                      {teacher}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {resource.traditions && resource.traditions.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-2">Traditions</h2>
                <div className="flex flex-wrap gap-2">
                  {resource.traditions.map(tradition => (
                    <span 
                      key={tradition} 
                      className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm"
                    >
                      {tradition}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {resource.tags && resource.tags.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Back Button */}
          <div className="mt-8">
            <button 
              onClick={() => router.back()} 
              className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-md hover:bg-opacity-90 transition-all"
            >
              ← Back
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
