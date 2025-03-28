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

  // Find unprocessed count for a specific type (includes both unprocessed and skipped)
  const getUnprocessedCountForType = (type) => {
    const found = typeCounts.find(item => item._id === type);
    if (!found) return 0;
    
    // Count both unprocessed and skipped resources as unprocessed
    return (found.unprocessed || found.count || 0) + (found.skipped || 0);
  };

  // Get total unprocessed count across all types (includes both unprocessed and skipped)
  const getTotalUnprocessedCount = () => {
    return typeCounts.reduce((sum, item) => {
      // Count both unprocessed and skipped resources as unprocessed
      return sum + (item.unprocessed || item.count || 0) + (item.skipped || 0);
    }, 0);
  };

  // Get skipped count for a specific type (for display only)
  const getSkippedCountForType = (type) => {
    const found = typeCounts.find(item => item._id === type);
    return found ? (found.skipped || 0) : 0;
  };

  // Get total skipped count across all types (for display only)
  const getTotalSkippedCount = () => {
    return typeCounts.reduce((sum, item) => sum + (item.skipped || 0), 0);
  };

  // Get truly unprocessed count (not skipped) for a specific type (for display only)
  const getTrueUnprocessedCountForType = (type) => {
    const found = typeCounts.find(item => item._id === type);
    return found ? (found.unprocessed || found.count || 0) : 0;
  };

  // Get total truly unprocessed count (for display only)
  const getTotalTrueUnprocessedCount = () => {
    return typeCounts.reduce((sum, item) => sum + (item.unprocessed || item.count || 0), 0);
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-medium mb-3">Select Resource Type to Process</h2>
      
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {resourceTypes.map((type) => {
          // For enabling/disabling the button, we consider both unprocessed and skipped
          const unprocessedCount = type.id === '' ? getTotalUnprocessedCount() : getUnprocessedCountForType(type.id);
          
          // For display purposes, we show the breakdown
          const trueUnprocessedCount = type.id === '' ? getTotalTrueUnprocessedCount() : getTrueUnprocessedCountForType(type.id);
          const skippedCount = type.id === '' ? getTotalSkippedCount() : getSkippedCountForType(type.id);
          
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
                  {trueUnprocessedCount} unprocessed
                  {skippedCount > 0 && `, ${skippedCount} skipped`}
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
