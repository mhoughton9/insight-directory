import React from 'react';
import Link from 'next/link';

/**
 * ResourceDetailSidebarTags component
 * Displays tags, traditions, and teachers associated with a resource
 * @param {Object} props - Component props
 * @param {Object} props.resource - Resource data object
 */
const ResourceDetailSidebarTags = ({ resource }) => {
  if (!resource) return null;
  
  const hasTags = resource.tags && resource.tags.length > 0;
  const hasTraditions = resource.traditions && resource.traditions.length > 0;
  const hasTeachers = resource.teachers && resource.teachers.length > 0;
  
  if (!hasTags && !hasTraditions && !hasTeachers) return null;
  
  return (
    <div>
      {/* Tags */}
      {hasTags && (
        <div className="mb-4">
          <h4 className="text-sm text-neutral-500 dark:text-neutral-400 mb-2 font-inter">Topics</h4>
          <div className="flex flex-wrap gap-2">
            {resource.tags.map((tag, index) => (
              <Link 
                key={index}
                href={`/resources/tag/${tag.slug || tag}`}
                className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md text-xs hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors font-inter"
              >
                {tag.name || tag}
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Traditions */}
      {hasTraditions && (
        <div className="mb-4">
          <h4 className="text-sm text-neutral-500 dark:text-neutral-400 mb-2 font-inter">Traditions</h4>
          <div className="flex flex-wrap gap-2">
            {resource.traditions.map((tradition, index) => (
              <Link 
                key={index}
                href={`/traditions/${tradition.slug || tradition}`}
                className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md text-xs hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors font-inter"
              >
                {tradition.name || tradition}
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Teachers */}
      {hasTeachers && (
        <div>
          <h4 className="text-sm text-neutral-500 dark:text-neutral-400 mb-2 font-inter">Teachers</h4>
          <div className="flex flex-wrap gap-2">
            {resource.teachers.map((teacher, index) => (
              <Link 
                key={index}
                href={`/teachers/${teacher.slug || teacher}`}
                className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md text-xs hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors font-inter"
              >
                {teacher.name || teacher}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceDetailSidebarTags;
