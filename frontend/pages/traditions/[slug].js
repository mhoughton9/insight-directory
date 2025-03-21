import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import traditionsService from '../../services/api/traditions';

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
          console.error('Error fetching tradition by slug, will try to find in all traditions:', slugError);
          
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
          console.log('Tradition loaded:', traditionData.name);
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
        console.error('Error fetching tradition:', err);
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
        console.error('Error fetching tradition resources:', resourceErr);
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
        console.error('Error fetching tradition teachers:', teachersErr);
        setTeachers([]);
      } finally {
        setLoadingTeachers(false);
      }
    };
    
    fetchTradition();
  }, [slug]);
  
  if (loadingTradition) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse">
          <div className="flex items-center gap-2 text-sm mb-4">
            <div className="h-4 w-10 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
            <span>/</span>
            <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
            <span>/</span>
            <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="flex-1">
              <div className="h-8 w-64 bg-neutral-200 dark:bg-neutral-700 rounded mb-4"></div>
              <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-4"></div>
              <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
              <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded mb-6"></div>
              
              <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-700 rounded mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                ))}
              </div>
            </div>
            
            <div className="w-full lg:w-1/3">
              <div className="h-6 w-24 bg-neutral-200 dark:bg-neutral-700 rounded mb-4"></div>
              <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded mb-6"></div>
              
              <div className="h-6 w-24 bg-neutral-200 dark:bg-neutral-700 rounded mb-4"></div>
              <div className="flex flex-wrap gap-2 mb-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-6 w-16 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !tradition) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-medium text-neutral-800 dark:text-neutral-200 mb-4 font-lora">
          Tradition Not Found
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8 font-inter">
          {error || 'The tradition you are looking for does not exist or has been removed.'}
        </p>
        <Link 
          href="/traditions"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-purple hover:bg-brand-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple transition-colors font-inter"
        >
          Browse Traditions
        </Link>
      </div>
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
      
      <header className="w-full bg-gradient-to-r from-brand-start via-brand-mid to-brand-end bg-opacity-10 dark:bg-opacity-5 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-4 font-inter">
            <Link href="/" className="hover:text-brand-purple transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link 
              href="/traditions"
              className="hover:text-brand-purple transition-colors"
            >
              Traditions
            </Link>
            <span>/</span>
            <span className="text-neutral-500 dark:text-neutral-500 truncate max-w-[150px] md:max-w-xs">
              {tradition.name}
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {tradition.imageUrl && (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden relative flex-shrink-0 border border-neutral-200 dark:border-neutral-700 shadow-sm transition-transform hover:scale-105">
                <Image 
                  src={tradition.imageUrl} 
                  alt={tradition.name}
                  fill
                  sizes="(max-width: 768px) 96px, 128px"
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium text-neutral-800 dark:text-neutral-200 font-lora">
                {tradition.name}
              </h1>
              
              {(tradition.foundingPeriod) && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-inter">
                  {tradition.foundingPeriod}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <div className="mb-8 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
              <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200 font-lora">
                About {tradition.name}
              </h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none font-inter">
                {tradition.descriptionFull ? (
                  tradition.descriptionFull.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
                  ))
                ) : tradition.description ? (
                  <p>{tradition.description}</p>
                ) : (
                  <p className="text-neutral-600 dark:text-neutral-400 italic">
                    No description available for this tradition.
                  </p>
                )}
              </div>
            </div>
            
            <div className="mb-8 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
              <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200 font-lora">
                Teachers in {tradition.name}
              </h2>
              
              {/* Teachers section temporarily disabled until API endpoint is implemented */}
              <p className="text-neutral-600 dark:text-neutral-400 italic font-inter">
                Teachers for this tradition will be available soon.
              </p>
            </div>
            
            <div className="mb-8 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
              <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200 font-lora">
                Resources for {tradition.name}
              </h2>
              
              {/* Resources section temporarily disabled until API endpoint is implemented */}
              <p className="text-neutral-600 dark:text-neutral-400 italic font-inter">
                Resources for this tradition will be available soon.
              </p>
            </div>
            
            {/* Comments Section */}
            <div className="mb-8 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
              <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200 font-lora">
                Comments
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 italic font-inter">
                Comments feature coming soon...
              </p>
            </div>
          </div>
          
          <div className="w-full lg:w-1/3">
            <div className="mb-6 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
              <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200 font-lora border-b border-neutral-100 dark:border-neutral-800 pb-2">
                Details
              </h3>
              
              {tradition.foundingPeriod && (
                <div className="mb-3 font-inter">
                  <p className="text-neutral-800 dark:text-neutral-200">
                    <span className="text-neutral-500 dark:text-neutral-400">Founding Period: </span>
                    {tradition.foundingPeriod}
                  </p>
                </div>
              )}
              
              {tradition.origin && (
                <div className="mb-3 font-inter">
                  <p className="text-neutral-800 dark:text-neutral-200">
                    <span className="text-neutral-500 dark:text-neutral-400">Origin: </span>
                    {tradition.origin}
                  </p>
                </div>
              )}
              
              {tradition.keyTeachings && tradition.keyTeachings.length > 0 && (
                <div className="mb-3 font-inter">
                  <p className="text-neutral-800 dark:text-neutral-200">
                    <span className="text-neutral-500 dark:text-neutral-400">Key Teachings: </span>
                    {Array.isArray(tradition.keyTeachings) 
                      ? tradition.keyTeachings.join(', ') 
                      : tradition.keyTeachings}
                  </p>
                </div>
              )}
            </div>
            
            <div className="mb-6 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
              <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200 font-lora border-b border-neutral-100 dark:border-neutral-800 pb-2">
                Actions
              </h3>
              <div className="space-y-2 font-inter">
                <button 
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  aria-label="Add to favorites"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Add to Favorites</span>
                </button>
                
                <button 
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  aria-label="Share tradition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
            
            {tradition.relatedTraditions && tradition.relatedTraditions.length > 0 && (
              <div className="mb-6 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
                <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200 font-lora border-b border-neutral-100 dark:border-neutral-800 pb-2">
                  Related Traditions
                </h3>
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
