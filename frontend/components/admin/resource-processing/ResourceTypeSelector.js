import React from 'react';

const ResourceTypeSelector = ({ selectedType, typeCounts, onTypeChange, formatResourceType }) => {
  // Resource types in the system
  const resourceTypes = [
    { id: '', label: 'All Resources' },
    { id: 'book', label: 'Books' },
    { id: 'videoChannel', label: 'Video Channels' },
    { id: 'podcast', label: 'Podcasts' },
    { id: 'website', label: 'Websites' },
    { id: 'blog', label: 'Blogs' },
    { id: 'practice', label: 'Practices' },
    { id: 'retreatCenter', label: 'Retreat Centers' },
    { id: 'app', label: 'Apps' }
  ];

  // Find unprocessed count for a specific type (now only uses 'count' from aggregation)
  const getUnprocessedCountForType = (type) => {
    const found = typeCounts.find(item => item._id === type);
    return found ? (found.count || 0) : 0; // 'count' represents unprocessed
  };

  // Get total unprocessed count across all types
  const getTotalUnprocessedCount = () => {
    return typeCounts.reduce((sum, item) => sum + (item.count || 0), 0);
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-medium mb-3">Select Resource Type to Process</h2>
      
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {resourceTypes.map((type) => {
          const unprocessedCount = type.id === '' ? getTotalUnprocessedCount() : getUnprocessedCountForType(type.id);
          const isActive = selectedType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => onTypeChange(type.id)}
              className={`
                p-2 rounded-lg border text-left transition-all text-sm
                ${isActive 
                  ? 'border-blue-500 bg-blue-50 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
              `}
              disabled={unprocessedCount === 0}
            >
              <div className="font-medium">{type.label}</div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">
                  {unprocessedCount} unprocessed
                </span>
                {unprocessedCount > 0 && (
                  <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                    {isActive ? 'Selected' : 'Select'}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceTypeSelector;
