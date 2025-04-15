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
import TeacherDetailContent from '../../components/teachers/TeacherDetailContent';
import TeacherDetailSidebarLinks from '../../components/teachers/sidebar/TeacherDetailSidebarLinks';
import { getTeacherImageContainerStyles } from '../../utils/teacher-utils';

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
          setTeacher(teacherData);
          setError(null);
          
          // Future implementation: fetch teacher resources when API is ready
        } else {
          setError('Teacher not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load teacher');
      } finally {
        setLoadingTeacher(false);
      }
    };
    
    // Function placeholder for future API implementation
    const fetchTeacherResources = async (teacherId) => {
      try {
        setLoadingResources(true);
        // Future implementation: fetch teacher resources when API is ready
        setResources([]);
      } catch (error) {
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
              <div className="flex items-center space-x-4">
                {teacher.imageUrl && (
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden border border-neutral-100 dark:border-neutral-800 shadow-sm flex-shrink-0">
                    <Image
                      src={teacher.imageUrl}
                      alt={`${teacher.name} Portrait`}
                      layout="fill"
                      objectFit="cover"
                      onError={(e) => { e.target.style.display = 'none'; }} // Hide if image fails to load
                    />
                  </div>
                )}
                <h1 className={Typography.pageTitle}>
                  {teacher.name}
                </h1>
              </div>
            </div>
            
            {/* Removed birth/death year display as it's already shown in the sidebar */}
            
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
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 md:py-1 -mt-2">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <div className="w-full lg:w-2/3">
            {/* Teacher Detail Content */}
            <TeacherDetailContent teacher={teacher} />
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
              <div className="mb-6 md:mb-8 p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
                <h2 className={Typography.sidebarHeading}>
                  Links
                </h2>
                <div className="mt-4">
                  <TeacherDetailSidebarLinks teacher={teacher} />
                </div>
              </div>
            )}
            
            <div className={Typography.cardContainer}>
              <h2 className={Typography.sidebarHeading}>
                Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full py-2 px-4 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center font-inter">
                  <FavoriteButton 
                    type="teacher" 
                    id={teacher._id} 
                    size="default"
                    showText={true}
                    className="flex items-center justify-center w-full"
                  />
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
