import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import teachersService from '../../services/api/teachers';

/**
 * TeacherDetailPage component
 * Displays detailed information about a specific teacher
 */
const TeacherDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  
  const [teacher, setTeacher] = useState(null);
  const [resources, setResources] = useState([]);
  const [loadingTeacher, setLoadingTeacher] = useState(true);
  const [loadingResources, setLoadingResources] = useState(false); 
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!slug) return;
    
    const fetchTeacher = async () => {
      try {
        setLoadingTeacher(true);
        
        let response;
        try {
          response = await teachersService.getById(slug);
        } catch (slugError) {
          console.error('Error fetching teacher by slug, will try to find in all teachers:', slugError);
          
          const allTeachers = await teachersService.getAll();
          const teachersArray = Array.isArray(allTeachers) ? allTeachers : 
                              (allTeachers.teachers && Array.isArray(allTeachers.teachers)) ? 
                              allTeachers.teachers : [];
          
          const foundTeacher = teachersArray.find(t => 
            t.slug === slug || 
            t.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') === slug ||
            t._id === slug
          );
          
          if (foundTeacher) {
            response = { teacher: foundTeacher };
          } else {
            throw new Error('Teacher not found');
          }
        }
        
        const teacherData = response.teacher || response;
        
        if (teacherData) {
          console.log('Teacher loaded:', teacherData.name);
          setTeacher(teacherData);
          setError(null);
          
          // Resources API endpoint is not implemented yet
          // Uncomment this when the API is ready
          // if (teacherData._id) {
          //   fetchTeacherResources(teacherData._id);
          // }
        } else {
          setError('Teacher not found');
        }
      } catch (err) {
        console.error('Error fetching teacher:', err);
        setError(err.message || 'Failed to load teacher');
      } finally {
        setLoadingTeacher(false);
      }
    };
    
    // This function is disabled until the API endpoint is implemented
    const fetchTeacherResources = async (teacherId) => {
      try {
        setLoadingResources(true);
        // Temporarily disabled until API endpoint is implemented
        // const resourcesResponse = await teachersService.getResources(teacherId);
        // const resourcesData = resourcesResponse.resources || resourcesResponse || [];
        // setResources(resourcesData);
        setResources([]);
      } catch (resourceErr) {
        console.error('Error fetching teacher resources:', resourceErr);
        setResources([]);
      } finally {
        setLoadingResources(false);
      }
    };
    
    fetchTeacher();
  }, [slug]);
  
  if (loadingTeacher) {
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
  
  if (error || !teacher) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-medium text-neutral-800 dark:text-neutral-200 mb-4 font-lora">
          Teacher Not Found
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8 font-inter">
          {error || 'The teacher you are looking for does not exist or has been removed.'}
        </p>
        <Link 
          href="/teachers"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-purple hover:bg-brand-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple transition-colors font-inter"
        >
          Browse Teachers
        </Link>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{teacher.name} | Insight Directory</title>
        <meta 
          name="description" 
          content={teacher.biography ? teacher.biography.substring(0, 160) : `Learn about ${teacher.name}, a spiritual teacher and their teachings.`}
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
              href="/teachers"
              className="hover:text-brand-purple transition-colors"
            >
              Teachers
            </Link>
            <span>/</span>
            <span className="text-neutral-500 dark:text-neutral-500 truncate max-w-[150px] md:max-w-xs">
              {teacher.name}
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {teacher.imageUrl && (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden relative flex-shrink-0 border border-neutral-200 dark:border-neutral-700 shadow-sm transition-transform hover:scale-105">
                <Image 
                  src={teacher.imageUrl} 
                  alt={teacher.name}
                  fill
                  sizes="(max-width: 768px) 96px, 128px"
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium text-neutral-800 dark:text-neutral-200 font-lora">
                {teacher.name}
              </h1>
              
              {(teacher.birthYear || teacher.deathYear) && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-inter">
                  {teacher.birthYear || '?'} - {teacher.deathYear || 'Present'}
                </p>
              )}
              
              {teacher.traditions && teacher.traditions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {teacher.traditions.map((tradition, index) => (
                    <Link 
                      key={index}
                      href={`/traditions/${tradition.slug || tradition}`}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-purple bg-opacity-10 text-brand-purple dark:bg-opacity-20 hover:bg-opacity-20 transition-colors font-inter"
                    >
                      {tradition.name || tradition}
                    </Link>
                  ))}
                </div>
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
                Biography
              </h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none font-inter">
                {teacher.biography ? (
                  <p>{teacher.biography}</p>
                ) : (
                  <p className="text-neutral-600 dark:text-neutral-400 italic">
                    No biography available for this teacher.
                  </p>
                )}
              </div>
            </div>
            
            <div className="mb-8 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
              <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200 font-lora">
                Resources by {teacher.name}
              </h2>
              
              {/* Resources section temporarily disabled until API endpoint is implemented */}
              <p className="text-neutral-600 dark:text-neutral-400 italic font-inter">
                Resources for this teacher will be available soon.
              </p>
            </div>
          </div>
          
          <div className="w-full lg:w-1/3">
            <div className="mb-6 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
              <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200 font-lora border-b border-neutral-100 dark:border-neutral-800 pb-2">
                Details
              </h3>
              
              {(teacher.birthYear || teacher.deathYear) && (
                <div className="mb-3 font-inter">
                  <p className="text-neutral-800 dark:text-neutral-200">
                    <span className="text-neutral-500 dark:text-neutral-400">Years: </span>
                    {teacher.birthYear || '?'} - {teacher.deathYear || 'Present'}
                  </p>
                </div>
              )}
              
              {teacher.country && (
                <div className="mb-3 font-inter">
                  <p className="text-neutral-800 dark:text-neutral-200">
                    <span className="text-neutral-500 dark:text-neutral-400">Location: </span>
                    {teacher.country}
                  </p>
                </div>
              )}
              
              {teacher.notableTeachings && (
                <div className="mb-3 font-inter">
                  <p className="text-neutral-800 dark:text-neutral-200">
                    <span className="text-neutral-500 dark:text-neutral-400">Notable Teachings: </span>
                    {Array.isArray(teacher.notableTeachings) 
                      ? teacher.notableTeachings.join(', ') 
                      : teacher.notableTeachings}
                  </p>
                </div>
              )}
            </div>
            
            {teacher.links && teacher.links.length > 0 && (
              <div className="mb-6 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
                <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200 font-lora border-b border-neutral-100 dark:border-neutral-800 pb-2">
                  Links
                </h3>
                <div className="space-y-2 font-inter">
                  {teacher.links.map((link, index) => {
                    if (!link || (!link.url && !link.href)) return null;
                    
                    const url = link.url || link.href;
                    const label = link.label || link.title || (() => {
                      try {
                        return new URL(url).hostname.replace('www.', '');
                      } catch (e) {
                        return url;
                      }
                    })();
                    
                    return (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-brand-purple hover:text-brand-purple-dark transition-colors group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2 flex-shrink-0 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>{label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
            
            {teacher.traditions && teacher.traditions.length > 0 && (
              <div className="mb-6 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
                <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200 font-lora border-b border-neutral-100 dark:border-neutral-800 pb-2">
                  Traditions
                </h3>
                <div className="flex flex-wrap gap-2 font-inter">
                  {teacher.traditions.map((tradition, index) => (
                    <Link 
                      key={index}
                      href={`/traditions/${tradition.slug || tradition}`}
                      className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md text-xs hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    >
                      {tradition.name || tradition}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            <div className="p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
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
                  aria-label="Share teacher"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default TeacherDetailPage;
