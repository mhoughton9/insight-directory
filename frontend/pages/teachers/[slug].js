import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import teachersService from '../../services/api/teachers';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import * as Typography from '../../components/common/TypographyStyles';
import FavoriteButton from '../../components/ui/FavoriteButton';

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
    return <LoadingSkeleton type="teacher" />;
  }
  
  if (error || !teacher) {
    return (
      <ErrorMessage
        title="Teacher Not Found"
        message={error || 'The teacher you are looking for does not exist or has been removed.'}
        linkHref="/teachers"
        linkText="Browse Teachers"
        onRetry={() => {
          setError(null);
          setLoadingTeacher(true);
          fetchTeacher();
        }}
      />
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
      
      <header className="w-full bg-gradient-to-r from-brand-start via-brand-mid to-brand-end bg-opacity-10 dark:bg-opacity-5 py-6 md:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-4 font-inter overflow-x-auto pb-1 scrollbar-hide">
            <Link href="/" className={Typography.breadcrumbItem}>
              Home
            </Link>
            <span>/</span>
            <Link 
              href="/teachers"
              className={Typography.breadcrumbItem}
            >
              Teachers
            </Link>
            <span>/</span>
            <span className={Typography.breadcrumbText}>
              {teacher.name}
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            {/* Teacher image (if available) */}
            {teacher.imageUrl && (
              <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-lg overflow-hidden relative flex-shrink-0 border border-neutral-200 dark:border-neutral-700 shadow-sm transition-transform hover:scale-105">
                <Image 
                  src={teacher.imageUrl} 
                  alt={teacher.name}
                  fill
                  sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className={Typography.pageTitle}>
                {teacher.name}
              </h1>
              
              {(teacher.birthYear || teacher.deathYear) && (
                <p className={Typography.metadataText}>
                  {teacher.birthYear || '?'} - {teacher.deathYear || 'Present'}
                </p>
              )}
              
              {teacher.traditions && teacher.traditions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 max-w-full overflow-hidden">
                  {teacher.traditions.map((tradition, index) => (
                    <Link 
                      key={index}
                      href={`/traditions/${tradition.slug || tradition}`}
                      className={Typography.tagPill}
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="w-full lg:w-2/3">
            <div className={Typography.cardContainer}>
              <h2 className={Typography.sectionHeading}>
                Biography
              </h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                {teacher.biographyFull ? (
                  teacher.biographyFull.split('\n\n').map((paragraph, index) => (
                    <p key={index} className={`${Typography.bodyText} mb-4 last:mb-0`}>{paragraph}</p>
                  ))
                ) : teacher.biography ? (
                  <p className={Typography.bodyText}>{teacher.biography}</p>
                ) : (
                  <p className={Typography.emptyStateText}>
                    No biography available for this teacher.
                  </p>
                )}
              </div>
            </div>
            
            <div className={Typography.cardContainer}>
              <h2 className={Typography.sectionHeading}>
                Resources by {teacher.name}
              </h2>
              
              {/* Resources section temporarily disabled until API endpoint is implemented */}
              <p className={Typography.emptyStateText}>
                Resources for this teacher will be available soon.
              </p>
            </div>
            
            <div className={Typography.cardContainer}>
              <h2 className={Typography.sectionHeading}>
                Comments
              </h2>
              <p className={Typography.emptyStateText}>
                Comments feature coming soon...
              </p>
            </div>
          </div>
          
          <div className="w-full lg:w-1/3">
            <div className={Typography.cardContainer}>
              <h2 className={Typography.sidebarHeading}>
                Details
              </h2>
              
              {(teacher.birthYear || teacher.deathYear) && (
                <div className="mb-3 font-inter">
                  <p className={Typography.detailValue}>
                    <span className={Typography.detailLabel}>Years: </span>
                    {teacher.birthYear || '?'} - {teacher.deathYear || 'Present'}
                  </p>
                </div>
              )}
              
              {teacher.country && (
                <div className="mb-3 font-inter">
                  <p className={Typography.detailValue}>
                    <span className={Typography.detailLabel}>Location: </span>
                    {teacher.country}
                  </p>
                </div>
              )}
              
              {teacher.notableTeachings && (
                <div className="mb-3 font-inter">
                  <p className={Typography.detailValue}>
                    <span className={Typography.detailLabel}>Notable Teachings: </span>
                    {Array.isArray(teacher.notableTeachings) 
                      ? teacher.notableTeachings.join(', ') 
                      : teacher.notableTeachings}
                  </p>
                </div>
              )}
              
              {teacher.influences && (
                <div className="mb-3 font-inter">
                  <p className={Typography.detailValue}>
                    <span className={Typography.detailLabel}>Influences: </span>
                    {Array.isArray(teacher.influences) 
                      ? teacher.influences.join(', ') 
                      : teacher.influences}
                  </p>
                </div>
              )}
            </div>
            
            {teacher.links && teacher.links.length > 0 && (
              <div className={Typography.cardContainer}>
                <h2 className={Typography.sidebarHeading}>
                  Links
                </h2>
                <ul className="space-y-2">
                  {teacher.links.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`${Typography.linkText} flex items-center overflow-hidden`}
                      >
                        {/* Icon based on link type */}
                        {link.type === 'website' && (
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        )}
                        {link.type === 'youtube' && (
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23.498 6.186a3.016 3.016 0 000 6.364L12 20.364l-7.682-7.682a3.016 3.016 0 00-6.364 0L3.34 16.868a3.016 3.016 0 000 6.364l7.682 7.682a3.016 3.016 0 006.364 0L23.498 6.186z" />
                          </svg>
                        )}
                        {link.type === 'article' && (
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        )}
                        <span className="truncate">{link.title || link.url}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className={Typography.cardContainer}>
              <h2 className={Typography.sidebarHeading}>
                Actions
              </h2>
              <div className="space-y-3">
                <FavoriteButton 
                  type="teacher" 
                  id={teacher._id} 
                  className="w-full"
                  showText={true}
                />
              </div>
            </div>
            
            {teacher.traditions && teacher.traditions.length > 0 && (
              <div className="mb-6 md:mb-8 p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
                <h2 className="text-2xl font-medium mb-4 text-neutral-800 dark:text-neutral-200 font-lora">
                  Traditions
                </h2>
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
          </div>
        </div>
      </main>
    </>
  );
};

export default TeacherDetailPage;
