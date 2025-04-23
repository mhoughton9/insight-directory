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
      
      <header className="w-full bg-bg-primary py-6 md:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm mb-4 font-inter overflow-x-auto pb-1 scrollbar-hide" style={{ color: 'var(--text-secondary)' }}>
            <Link href="/" className="hover:text-brand-purple transition-colors whitespace-nowrap">
              Home
            </Link>
            <span>/</span>
            <Link 
              href="/teachers"
              className="hover:text-brand-purple transition-colors whitespace-nowrap"
            >
              Teachers
            </Link>
            <span>/</span>
            <span className="truncate max-w-[120px] sm:max-w-[150px] md:max-w-xs whitespace-nowrap" style={{ opacity: 0.8 }}>
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
            <div className="mb-6 md:mb-8 p-4 sm:p-6 rounded-lg shadow-sm border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)' }}>
              <h2 className={Typography.sidebarHeading}>
                Details
              </h2>
              
              {(teacher.birthYear || teacher.deathYear) && (
                <div className="mb-3 font-inter text-text-primary">
                  <p className="text-text-primary">
                    <span className="text-text-secondary font-medium">Years: </span>
                    {teacher.birthYear || '?'} - {teacher.deathYear || 'Present'}
                  </p>
                </div>
              )}
              
              {teacher.country && (
                <div className="mb-3 font-inter text-text-primary">
                  <p className="text-text-primary">
                    <span className="text-text-secondary font-medium">Location: </span>
                    {teacher.country}
                  </p>
                </div>
              )}
              
              {teacher.notableTeachings && (
                <div className="mb-3 font-inter text-text-primary">
                  <p className="text-text-primary">
                    <span className="text-text-secondary font-medium">Notable Teachings: </span>
                    {Array.isArray(teacher.notableTeachings) 
                      ? teacher.notableTeachings.join(', ') 
                      : teacher.notableTeachings}
                  </p>
                </div>
              )}
              
              {teacher.influences && (
                <div className="mb-3 font-inter text-text-primary">
                  <p className="text-text-primary">
                    <span className="text-text-secondary font-medium">Influences: </span>
                    {Array.isArray(teacher.influences) 
                      ? teacher.influences.join(', ') 
                      : teacher.influences}
                  </p>
                </div>
              )}
            </div>
            
            {teacher.links && teacher.links.length > 0 && (
              <div className="mb-6 md:mb-8 p-4 sm:p-6 rounded-lg shadow-sm border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)' }}>
                <h2 className={Typography.sidebarHeading}>
                  Links
                </h2>
                <div className="mt-4">
                  <TeacherDetailSidebarLinks teacher={teacher} />
                </div>
              </div>
            )}
            
            <div className="mb-6 md:mb-8 p-4 sm:p-6 rounded-lg shadow-sm border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)' }}>
              <h2 className={Typography.sidebarHeading}>
                Actions
              </h2>
              <div className="space-y-3">
                <FavoriteButton 
                  type="teacher" 
                  id={teacher._id} 
                  size="default"
                  showText={true}
                  className="flex items-center justify-center w-full py-2 px-4 rounded-md transition-colors font-inter hover:!bg-[var(--dark-surface-hover)]"
                  style={{ 
                    backgroundColor: 'var(--surface)', 
                    color: 'var(--text-primary)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default TeacherDetailPage;
