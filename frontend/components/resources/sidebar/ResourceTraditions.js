import React from 'react';
import Link from 'next/link';

/**
 * ResourceTraditions component
 * Displays resource traditions in a consistent format
 * @param {Object} props - Component props
 * @param {Array} props.traditions - Array of tradition objects
 */
const ResourceTraditions = ({ traditions }) => {
  if (!traditions || traditions.length === 0) return null;
  
  return (
    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200">Traditions</h3>
      <div className="flex flex-wrap gap-2">
        {traditions.map(tradition => (
          <Link 
            key={tradition._id} 
            href={`/traditions/${tradition.slug}`}
            className="px-3 py-1 bg-white dark:bg-neutral-700 rounded-full text-sm hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors border border-neutral-200 dark:border-neutral-600 hover:text-brand-purple hover:border-brand-purple dark:hover:border-brand-purple"
          >
            {tradition.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ResourceTraditions;
