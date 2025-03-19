import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * ResourceTeachers component
 * Displays resource teachers or notable guests in a consistent format
 * @param {Object} props - Component props
 * @param {Array} props.teachers - Array of teacher objects
 * @param {String} props.resourceType - Type of resource
 */
const ResourceTeachers = ({ teachers, resourceType }) => {
  if (!teachers || teachers.length === 0) return null;
  
  // Don't show for books as they have authors in metadata
  if (resourceType === 'book') return null;
  
  const sectionTitle = resourceType === 'podcast' ? 'Notable Guests' : 'Teachers';
  
  return (
    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200">
        {sectionTitle}
      </h3>
      <div className="space-y-4">
        {teachers.map(teacher => (
          <Link 
            key={teacher._id} 
            href={`/teachers/${teacher.slug}`}
            className="flex items-center gap-3 group"
          >
            {teacher.imageUrl ? (
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image 
                  src={teacher.imageUrl} 
                  alt={teacher.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                {teacher.name.charAt(0)}
              </div>
            )}
            <span className="text-neutral-800 dark:text-neutral-200 group-hover:text-brand-purple transition-colors">
              {teacher.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ResourceTeachers;
