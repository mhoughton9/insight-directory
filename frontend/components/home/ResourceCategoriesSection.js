import Link from 'next/link';
import React from 'react';
import { normalizeResourceType, formatResourceType } from '../../utils/resource-utils';
import { Heading, Text } from '../ui/Typography';

/**
 * Get plural form of resource type for display
 * @param {string} type - Resource type
 * @returns {string} - Pluralized resource type
 */
const getPluralResourceType = (type) => {
  switch (type) {
    case 'Book': return 'Books';
    case 'Video Channel': return 'Video Channels';
    case 'Podcast': return 'Podcasts';
    case 'Website': return 'Websites';
    case 'Blog': return 'Blogs';
    case 'Practice': return 'Practices';
    case 'App': return 'Apps';
    case 'Retreat Center': return 'Retreat Centers';
    default: return `${type}s`; // Default pluralization
  }
};

/**
 * Resource Categories Section component for the home page
 * Displays a grid of resource types with icons and descriptions
 * @param {Object} props - Component props
 * @param {Array} props.resourceTypes - Array of resource type objects
 * @param {Array} props.brandColors - Array of brand colors for styling
 */
const ResourceCategoriesSection = ({ resourceTypes, brandColors }) => {
  return (
    <section className="py-12 my-8 mx-auto max-w-[95%] bg-white dark:bg-neutral-900 rounded-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Heading as="h2" size="3xl" className="mb-6 text-center">
            Resource Categories
          </Heading>
          <Text size="xl" className="text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Explore our collection of resources by category
          </Text>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resourceTypes.map((type, index) => {
            const normalizedType = normalizeResourceType(type.type);
            // Assign colors from brand palette based on index
            const color = brandColors[index % brandColors.length];
            
            return (
              <Link 
                key={index} 
                href={`/resources/type/${normalizedType}`} 
                className="block h-full"
              >
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden h-full transition-all duration-200 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700">
                  {/* Card Content */}
                  <div className="p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 mb-4 flex items-center justify-center relative z-10">
                      <div style={{ color }}>
                        {React.cloneElement(type.icon, { 
                          width: 48, 
                          height: 48, 
                          stroke: color,
                          className: "transition-all duration-300"
                        })}
                      </div>
                    </div>
                    <Heading as="h3" size="lg" className="text-neutral-900 dark:text-white mb-2">
                      {getPluralResourceType(type.type)}
                    </Heading>
                    <Text size="sm" className="text-neutral-700 dark:text-neutral-300">
                      {type.description}
                    </Text>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResourceCategoriesSection;
