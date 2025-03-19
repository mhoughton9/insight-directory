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
    <section className="py-12 bg-white dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-normal text-neutral-800 dark:text-neutral-100 mb-4" style={{ fontFamily: 'Lora, serif' }}>
            Resource Categories
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Explore our collection of awakening resources by category
          </p>
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
                className="group bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:bg-white dark:hover:bg-neutral-700 flex flex-col items-center text-center h-full border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 overflow-hidden relative"
                style={{
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300" 
                  style={{ 
                    background: `linear-gradient(135deg, ${color}22, transparent 70%)`,
                    borderRadius: 'inherit'
                  }}
                ></div>
                <div className="w-16 h-16 mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 relative z-10">
                  <div style={{ color }}>
                    {React.cloneElement(type.icon, { 
                      width: 48, 
                      height: 48, 
                      stroke: color,
                      className: "transition-all duration-300"
                    })}
                  </div>
                </div>
                <h3 className="text-xl font-medium text-neutral-800 dark:text-neutral-200 mb-2 relative z-10" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {formatResourceType(type.type)}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm flex-grow relative z-10" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {type.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResourceCategoriesSection;
