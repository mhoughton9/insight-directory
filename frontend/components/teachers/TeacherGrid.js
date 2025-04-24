import React from 'react';
import TeacherCard from './TeacherCard';
import { Heading, Text } from '../ui/Typography';

/**
 * TeacherGrid component
 * Displays a responsive grid of teacher cards
 */
const TeacherGrid = React.memo(function TeacherGrid({ teachers = [], isLoading = false }) {
  if (isLoading && teachers.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <TeacherCardSkeleton key={index} />
        ))}
      </div>
    );
  }
  
  if (!teachers.length && !isLoading) {
    return (
      <div className="py-12 text-center bg-card-bg border border-card-border rounded-lg">
        <Heading as="h3" size="md" className="mb-2 text-text-heading">
          No teachers found
        </Heading>
        <Text size="md" className="text-text-muted">
          Try adjusting your search terms.
        </Text>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {teachers.map(teacher => (
        <TeacherCard 
          key={teacher._id} 
          teacher={teacher} 
        />
      ))}
    </div>
  );
});

export default TeacherGrid;

/**
 * TeacherCardSkeleton component
 * Displays a loading placeholder for teacher cards
 */
function TeacherCardSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm overflow-hidden h-full animate-pulse">
      {/* Card Header with Image */}
      <div className="aspect-square w-full bg-neutral-200 dark:bg-neutral-700"></div>
      
      {/* Card Content */}
      <div className="p-4">
        <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6 mb-4"></div>
        
        {/* Traditions */}
        <div className="flex flex-wrap gap-1 mt-auto">
          <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded-full w-16"></div>
          <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded-full w-20"></div>
        </div>
      </div>
    </div>
  );
}
