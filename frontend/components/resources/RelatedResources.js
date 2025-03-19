import Link from 'next/link';
import Image from 'next/image';
import ResourceTypeIcon from './ResourceTypeIcon';
import { formatResourceType } from '../../utils/resource-utils';

/**
 * RelatedResources component
 * Displays a grid of related resources
 * @param {Array} resources - Array of related resource objects
 */
export default function RelatedResources({ resources = [] }) {
  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {resources.map((resource) => (
        <Link 
          href={`/resources/${resource.slug}`} 
          key={resource._id}
          className="group bg-neutral-50 dark:bg-neutral-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="relative h-40 w-full bg-neutral-200 dark:bg-neutral-700">
            {resource.imageUrl ? (
              <Image
                src={resource.imageUrl}
                alt={resource.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full">
                <ResourceTypeIcon type={resource.type} size="lg" />
              </div>
            )}
          </div>
          
          <div className="p-4">
            <div className="flex items-center mb-2">
              <ResourceTypeIcon type={resource.type} />
              <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-2 capitalize">
                {formatResourceType(resource.type)}
              </span>
            </div>
            
            <h3 className="font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-brand-purple dark:group-hover:text-brand-purple transition-colors">
              {resource.title}
            </h3>
            
            {resource.teachers && resource.teachers.length > 0 && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                By {resource.teachers.map(t => t.name).join(', ')}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
