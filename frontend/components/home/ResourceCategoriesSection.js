import Link from 'next/link';
import React from 'react';
import { normalizeResourceType, formatResourceType } from '../../utils/resource-utils';

/**
 * Resource Categories Section component for the home page
 * Displays a grid of resource types with icons and descriptions
 * @param {Object} props - Component props
 * @param {Array} props.resourceTypes - Array of resource type objects
 * @param {Array} props.brandColors - Array of brand colors for styling
 */
const ResourceCategoriesSection = ({ resourceTypes, brandColors }) => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center" style={{ fontFamily: 'Lora, serif' }}>
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {resourceTypes.map((type, index) => {
            // Assign colors from brand palette based on index
            const color = brandColors[index % brandColors.length];
            
            return (
              <Link 
                href={`/resources?type=${encodeURIComponent(normalizeResourceType(type.type))}`} 
                key={type.type}
                className="bg-white dark:bg-neutral-800 rounded-lg p-5 text-center shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-100 dark:border-neutral-700 transform hover:-translate-y-1"
              >
                <div className="flex justify-center items-center mb-3">
                  <div style={{ color }}>
                    {React.cloneElement(type.icon, { 
                      width: 36, 
                      height: 36, 
                      stroke: color,
                      className: "transition-all duration-300"
                    })}
                  </div>
                </div>
                <h3 className="font-medium mb-2 text-neutral-800 dark:text-neutral-200" style={{ fontFamily: 'Inter, sans-serif' }}>{formatResourceType(type.type)}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400" style={{ fontFamily: 'Inter, sans-serif' }}>{type.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResourceCategoriesSection;
