import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import traditionsService from '../../services/api/traditions';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import * as Typography from '../../components/common/TypographyStyles';
import FavoriteButton from '../../components/ui/FavoriteButton';
import TraditionDetailContent from '../../components/traditions/TraditionDetailContent';
import TraditionDetailSidebarLinks from '../../components/traditions/sidebar/TraditionDetailSidebarLinks';

/**
 * TraditionDetailPage component
 * Displays detailed information about a specific spiritual tradition
 */
const TraditionDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  
  const [tradition, setTradition] = useState(null);
  const [resources, setResources] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loadingTradition, setLoadingTradition] = useState(true);
  const [loadingResources, setLoadingResources] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!slug) return;
    
    const fetchTradition = async () => {
      try {
        setLoadingTradition(true);
        
        let response;
        try {
          response = await traditionsService.getById(slug);
        } catch (slugError) {
          
          const allTraditions = await traditionsService.getAll();
          const traditionsArray = Array.isArray(allTraditions) ? allTraditions : 
                              (allTraditions.traditions && Array.isArray(allTraditions.traditions)) ? 
                              allTraditions.traditions : [];
          
          const foundTradition = traditionsArray.find(t => 
            t.slug === slug || 
            t.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') === slug ||
            t._id === slug
          );
          
          if (foundTradition) {
            response = { tradition: foundTradition };
          } else {
            throw new Error('Tradition not found');
          }
        }
        
        const traditionData = response.tradition || response;
        
        if (traditionData) {
          setTradition(traditionData);
          setError(null);
          
          // Resources API endpoint is not implemented yet
          // Uncomment this when the API is ready
          // if (traditionData._id) {
          //   fetchTraditionResources(traditionData._id);
          //   fetchTraditionTeachers(traditionData._id);
          // }
        } else {
          setError('Tradition not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load tradition');
      } finally {
        setLoadingTradition(false);
      }
    };
    
    // This function is disabled until the API endpoint is implemented
    const fetchTraditionResources = async (traditionId) => {
      try {
        setLoadingResources(true);
        // Temporarily disabled until API endpoint is implemented
        // const resourcesResponse = await traditionsService.getResources(traditionId);
        // const resourcesData = resourcesResponse.resources || resourcesResponse || [];
        // setResources(resourcesData);
        setResources([]);
      } catch (resourceErr) {
        setResources([]);
      } finally {
        setLoadingResources(false);
      }
    };
    
    // This function is disabled until the API endpoint is implemented
    const fetchTraditionTeachers = async (traditionId) => {
      try {
        setLoadingTeachers(true);
        // Temporarily disabled until API endpoint is implemented
        // const teachersResponse = await traditionsService.getTeachers(traditionId);
        // const teachersData = teachersResponse.teachers || teachersResponse || [];
        // setTeachers(teachersData);
        setTeachers([]);
      } catch (teachersErr) {
        setTeachers([]);
      } finally {
        setLoadingTeachers(false);
      }
    };
    
    fetchTradition();
  }, [slug]);
  
  if (loadingTradition) {
    return <LoadingSkeleton type="tradition" />;
  }
  
  if (error || !tradition) {
    return (
      <ErrorMessage
        title="Tradition Not Found"
        message={error || 'The tradition you are looking for does not exist or has been removed.'}
        linkHref="/traditions"
        linkText="Browse Traditions"
        onRetry={() => {
          setError(null);
          setLoadingTradition(true);
          fetchTradition();
        }}
      />
    );
  }
  
  return (
    <>
      <Head>
        <title>{tradition.name} | Insight Directory</title>
        <meta 
          name="description" 
          content={tradition.description ? tradition.description.substring(0, 160) : `Learn about ${tradition.name}, a spiritual tradition and its teachings.`}
        />
      </Head>
      
      <header className="w-full bg-gradient-to-r from-brand-start via-brand-mid to-brand-end bg-opacity-10 dark:bg-opacity-5 py-6 md:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb navigation */}
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-4 font-inter overflow-x-auto pb-1 scrollbar-hide">
            <Link href="/" className={Typography.breadcrumbItem}>
              Home
            </Link>
            <span>/</span>
            <Link href="/traditions" className={Typography.breadcrumbItem}>
              Traditions
            </Link>
            <span>/</span>
            <span className={Typography.breadcrumbText}>
              {tradition.name}
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            {/* Tradition image (if available) */}
            {tradition.imageUrl && (
              <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-lg overflow-hidden relative flex-shrink-0 border border-neutral-200 dark:border-neutral-700 shadow-sm transition-transform hover:scale-105">
                <Image 
                  src={tradition.imageUrl} 
                  alt={tradition.name}
                  fill
                  sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className={Typography.pageTitle}>
                {tradition.name}
              </h1>
              
              {(tradition.foundingPeriod) && (
                <p className={Typography.metadataText}>
                  {tradition.foundingPeriod}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="w-full lg:w-2/3">
            {/* Tradition Detail Content */}
            <TraditionDetailContent tradition={tradition} />
          </div>
          
          <div className="w-full lg:w-1/3">
            <div className="mb-6 md:mb-8 p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
              <h2 className={Typography.sidebarHeading}>
                Details
              </h2>
              
              {/* Founding Period */}
              {tradition.foundingPeriod && (
                <div className="mt-4">
                  <h3 className={Typography.sidebarSubheading}>Founding Period:</h3>
                  <p className={Typography.sidebarText}>{tradition.foundingPeriod}</p>
                </div>
              )}
              
              {/* Origin */}
              {tradition.origin && (
                <div className="mt-4">
                  <h3 className={Typography.sidebarSubheading}>Origin:</h3>
                  <p className={Typography.sidebarText}>{tradition.origin}</p>
                </div>
              )}
            </div>
            
            {/* Links Section */}
            {tradition.links && tradition.links.length > 0 && (
              <div className="mb-6 md:mb-8 p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
                <h2 className={Typography.sidebarHeading}>
                  Links
                </h2>
                <div className="mt-4">
                  <TraditionDetailSidebarLinks tradition={tradition} />
                </div>
              </div>
            )}
            
            <div className="mb-6 md:mb-8 p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
              <h2 className={Typography.sidebarHeading}>
                Actions
              </h2>
              <div className="space-y-2 font-inter">
                <FavoriteButton 
                  type="tradition" 
                  id={tradition._id} 
                  size="default"
                  showText={true}
                  className="flex items-center justify-center w-full py-2 px-4 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors font-inter"
                />
              </div>
            </div>
            
            {tradition.relatedTraditions && tradition.relatedTraditions.length > 0 && (
              <div className="mb-6 md:mb-8 p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
                <h2 className={Typography.sidebarHeading}>
                  Related Traditions
                </h2>
                <div className="flex flex-wrap gap-2 font-inter">
                  {tradition.relatedTraditions.map((relatedTradition, index) => {
                    // Handle both object and string/id references
                    const traditionName = relatedTradition.name || 'Related Tradition';
                    const traditionSlug = relatedTradition.slug || relatedTradition;
                    
                    return (
                      <Link 
                        key={index}
                        href={`/traditions/${traditionSlug}`}
                        className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md text-xs hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                      >
                        {traditionName}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default TraditionDetailPage;
