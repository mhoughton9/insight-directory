import React from 'react';
import { getMetadataFields } from '../../../utils/resource-helpers';

/**
 * ResourceMetadata component
 * Displays resource-specific metadata in a consistent format
 * @param {Object} props - Component props
 * @param {Object} props.resource - Resource data object
 */
const ResourceMetadata = ({ resource }) => {
  if (!resource) return null;
  
  const resourceType = resource.type || 'unknown';
  const metadataFields = getMetadataFields(resourceType);
  
  // Filter out fields with null or undefined values
  const fieldsToShow = metadataFields.filter(field => {
    const value = field.value(resource);
    return value !== null && value !== undefined || field.showAlways;
  });
  
  if (fieldsToShow.length === 0) return null;
  
  return (
    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200">Resource Info</h3>
      <div className="space-y-3 text-sm">
        {fieldsToShow.map((field, index) => {
          const value = field.value(resource);
          
          if (field.isArray && Array.isArray(value)) {
            return (
              <div key={index} className="flex flex-col">
                <span className="text-neutral-600 dark:text-neutral-400 mb-2">{field.label}</span>
                <div className="space-y-1">
                  {value.map((item, i) => (
                    <div 
                      key={i} 
                      className="text-neutral-800 dark:text-neutral-200 pl-2 border-l-2 border-brand-purple"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          
          return (
            <div key={index} className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">{field.label}</span>
              <span className="text-neutral-800 dark:text-neutral-200">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceMetadata;
