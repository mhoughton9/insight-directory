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
    // Outer section: Apply background and vertical padding/margin, make it full width
    <section className="py-12 my-8 bg-[var(--theme-bg-deep)]">
      {/* Inner container: Constrain content width and center it */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Heading as="h2" size="3xl" className="mb-6 text-center">
            Resource Categories
          </Heading>
          <Text size="xl" className="text-caption-color max-w-3xl mx-auto">
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
                <div className="bg-[var(--theme-surface-primary)] border border-[var(--theme-border-subtle)] rounded-xl overflow-hidden h-full transition-all duration-300 hover:bg-[var(--theme-surface-hover)]">
                  {/* Card Content */}
                  <div className="p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 mb-4 flex items-center justify-center relative z-10">
                      <div style={{ color }}>
                        {React.cloneElement(type.icon, { 
                          width: 48, 
                          height: 48, 
                          stroke: color,
                          strokeWidth: 2.5,
                          className: "transition-all duration-300"
                        })}
                      </div>
                    </div>
                    <Heading as="h3" size="lg" className="mb-2">
                      {getPluralResourceType(type.type)}
                    </Heading>
                    <Text size="sm" className="text-caption-color">
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
