import { useState, useRef, useEffect } from 'react';
import { FilterIcon, XIcon, ChevronDownIcon } from '../ui/Icons';
import { formatResourceType } from '../../utils/resource-utils';

/**
 * FilterBar component
 * Provides filtering and sorting options for resources
 * Enhanced for better mobile responsiveness
 */
export default function FilterBar({
  resourceTypes = [], 
  traditions = [], 
  teachers = [],
  tags = [],
  onFilterChange,
  activeFilters = {},
  hideResourceTypeFilter = false
}) {
  // Initialize state from props, but only once
  const [selectedTypes, setSelectedTypes] = useState(activeFilters.types || []);
  const [selectedTradition, setSelectedTradition] = useState(activeFilters.traditions?.[0] || '');
  const [selectedTeacher, setSelectedTeacher] = useState(activeFilters.teachers?.[0] || '');
  const [selectedTags, setSelectedTags] = useState(activeFilters.tags || []);
  const [sortOption, setSortOption] = useState(activeFilters.sort || 'newest');
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    types: true,
    traditions: true,
    teachers: true,
    tags: true
  });
  
  // Flag to prevent infinite loops when updating filters
  const isUpdatingRef = useRef(false);
  
  // Maximum number of tags that can be selected
  const MAX_TAG_SELECTIONS = 3;
  
  // Update local state when activeFilters prop changes
  useEffect(() => {
    if (!activeFilters || isUpdatingRef.current) return;
    
    setSelectedTypes(activeFilters.types || []);
    setSelectedTradition(activeFilters.traditions?.[0] || '');
    setSelectedTeacher(activeFilters.teachers?.[0] || '');
    setSelectedTags(activeFilters.tags || []);
    setSortOption(activeFilters.sort || 'newest');
  }, [activeFilters]);
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const handleTypeChange = (type) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    setSelectedTypes(newTypes);
    updateFilters({ 
      types: newTypes, 
      traditions: selectedTradition ? [selectedTradition] : [], 
      teachers: selectedTeacher ? [selectedTeacher] : [], 
      tags: selectedTags, 
      sort: sortOption 
    });
  };
  
  const handleTraditionChange = (e) => {
    const tradition = e.target.value;
    setSelectedTradition(tradition === 'all' ? '' : tradition);
    updateFilters({ 
      types: selectedTypes, 
      traditions: tradition === 'all' ? [] : [tradition], 
      teachers: selectedTeacher ? [selectedTeacher] : [], 
      tags: selectedTags, 
      sort: sortOption 
    });
  };
  
  const handleTeacherChange = (e) => {
    const teacher = e.target.value;
    setSelectedTeacher(teacher === 'all' ? '' : teacher);
    updateFilters({ 
      types: selectedTypes, 
      traditions: selectedTradition ? [selectedTradition] : [], 
      teachers: teacher === 'all' ? [] : [teacher], 
      tags: selectedTags, 
      sort: sortOption 
    });
  };
  
  const handleTagChange = (tag) => {
    // If tag is already selected, remove it
    if (selectedTags.includes(tag)) {
      const newTags = selectedTags.filter(t => t !== tag);
      setSelectedTags(newTags);
      updateFilters({ 
        types: selectedTypes, 
        traditions: selectedTradition ? [selectedTradition] : [], 
        teachers: selectedTeacher ? [selectedTeacher] : [], 
        tags: newTags, 
        sort: sortOption 
      });
      return;
    }
    
    // If max tags are already selected, don't add more
    if (selectedTags.length >= MAX_TAG_SELECTIONS) {
      return;
    }
    
    // Add the new tag
    const newTags = [...selectedTags, tag];
    setSelectedTags(newTags);
    updateFilters({ 
      types: selectedTypes, 
      traditions: selectedTradition ? [selectedTradition] : [], 
      teachers: selectedTeacher ? [selectedTeacher] : [], 
      tags: newTags, 
      sort: sortOption 
    });
  };
  
  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    updateFilters({ 
      types: selectedTypes, 
      traditions: selectedTradition ? [selectedTradition] : [], 
      teachers: selectedTeacher ? [selectedTeacher] : [], 
      tags: selectedTags, 
      sort: option 
    });
  };
  
  const updateFilters = (filters) => {
    if (onFilterChange) {
      // Set flag to prevent infinite loops
      isUpdatingRef.current = true;
      onFilterChange(filters);
      // Reset flag after a short delay
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  };
  
  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedTradition('');
    setSelectedTeacher('');
    setSelectedTags([]);
    setSortOption('newest');
    updateFilters({ types: [], traditions: [], teachers: [], tags: [], sort: 'newest' });
  };
  
  const hasActiveFilters = selectedTypes.length > 0 || 
                           selectedTradition || 
                           selectedTeacher || 
                           selectedTags.length > 0 || 
                           sortOption !== 'newest';
  
  // Get total count of active filters
  const getActiveFilterCount = () => {
    return selectedTypes.length + 
           (selectedTradition ? 1 : 0) + 
           (selectedTeacher ? 1 : 0) + 
           selectedTags.length + 
           (sortOption !== 'newest' ? 1 : 0);
  };

  return (
    <div className="mb-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium flex items-center">
          <FilterIcon size={18} className="mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-brand-purple text-white">
              {getActiveFilterCount()}
            </span>
          )}
        </h2>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center text-sm text-neutral-700 dark:text-neutral-300 md:hidden"
            aria-expanded={isOpen}
            aria-controls="filter-panels"
          >
            <span className="ml-1">{isOpen ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className="flex items-center text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
              aria-label="Clear all filters"
            >
              <XIcon size={16} className="mr-1" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Sort Options - Always visible */}
      <div className="mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="sort-select" className="text-sm font-medium mr-1">Sort by:</label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={handleSortChange}
            className="
              bg-neutral-100 dark:bg-neutral-800 
              text-neutral-900 dark:text-white 
              text-sm rounded-md 
              border-none
              py-1.5 px-3
              focus:ring-2 focus:ring-brand-purple focus:ring-opacity-50
              cursor-pointer
              flex-grow md:flex-grow-0
            "
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">Alphabetical (A-Z)</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>
      
      {/* Filter Panels */}
      <div id="filter-panels" className={`space-y-4 ${!isOpen && 'hidden md:block'}`}>
        {/* Active Filters Summary - Mobile Only */}
        {hasActiveFilters && (
          <div className="md:hidden mb-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-medium mb-2">Active Filters:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedTypes.map(type => (
                <span 
                  key={`active-${type}`}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-brand-purple text-white"
                >
                  {formatResourceType(type)}
                  <button 
                    onClick={() => handleTypeChange(type)}
                    className="ml-1"
                    aria-label={`Remove ${type} filter`}
                  >
                    <XIcon size={12} />
                  </button>
                </span>
              ))}
              {selectedTradition && (
                <span 
                  key={`active-${selectedTradition}`}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-brand-purple text-white"
                >
                  {selectedTradition}
                  <button 
                    onClick={() => {
                      setSelectedTradition('');
                      updateFilters({ 
                        types: selectedTypes, 
                        traditions: [], 
                        teachers: selectedTeacher ? [selectedTeacher] : [], 
                        tags: selectedTags, 
                        sort: sortOption 
                      });
                    }}
                    className="ml-1"
                    aria-label={`Remove ${selectedTradition} filter`}
                  >
                    <XIcon size={12} />
                  </button>
                </span>
              )}
              {selectedTeacher && (
                <span 
                  key={`active-${selectedTeacher}`}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-brand-purple text-white"
                >
                  {selectedTeacher}
                  <button 
                    onClick={() => {
                      setSelectedTeacher('');
                      updateFilters({ 
                        types: selectedTypes, 
                        traditions: selectedTradition ? [selectedTradition] : [], 
                        teachers: [], 
                        tags: selectedTags, 
                        sort: sortOption 
                      });
                    }}
                    className="ml-1"
                    aria-label={`Remove ${selectedTeacher} filter`}
                  >
                    <XIcon size={12} />
                  </button>
                </span>
              )}
              {selectedTags.map(tag => (
                <span 
                  key={`active-${tag}`}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-brand-purple text-white"
                >
                  {tag}
                  <button 
                    onClick={() => handleTagChange(tag)}
                    className="ml-1"
                    aria-label={`Remove ${tag} filter`}
                  >
                    <XIcon size={12} />
                  </button>
                </span>
              ))}
              {sortOption !== 'newest' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-brand-purple text-white">
                  Sort: {sortOption}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Resource Types */}
        {!hideResourceTypeFilter && resourceTypes.length > 0 && (
          <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <button 
              onClick={() => toggleSection('types')} 
              className="flex items-center justify-between w-full text-left mb-2"
              aria-expanded={expandedSections.types}
              aria-controls="resource-type-filters"
            >
              <h3 className="text-sm font-medium">Resource Type</h3>
              <ChevronDownIcon 
                size={16} 
                className={`transform transition-transform ${expandedSections.types ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {expandedSections.types && (
              <div id="resource-type-filters" className="flex flex-wrap gap-2 mt-2">
                {resourceTypes.map(type => (
                  <label 
                    key={type} 
                    className={`
                      inline-flex items-center px-3 py-1.5 rounded-full text-sm
                      ${selectedTypes.includes(type) 
                        ? 'bg-brand-purple text-white' 
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'}
                      cursor-pointer transition-colors hover:opacity-90
                    `}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeChange(type)}
                      aria-label={`Filter by ${formatResourceType(type)}`}
                    />
                    {formatResourceType(type)}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Traditions - Changed to Single-Select Picklist */}
        {traditions.length > 0 && (
          <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <button 
              onClick={() => toggleSection('traditions')} 
              className="flex items-center justify-between w-full text-left mb-2"
              aria-expanded={expandedSections.traditions}
              aria-controls="tradition-filters"
            >
              <h3 className="text-sm font-medium">Tradition</h3>
              <ChevronDownIcon 
                size={16} 
                className={`transform transition-transform ${expandedSections.traditions ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {expandedSections.traditions && (
              <div id="tradition-filters" className="mt-2">
                <select
                  value={selectedTradition || 'all'}
                  onChange={handleTraditionChange}
                  className="
                    w-full
                    bg-neutral-100 dark:bg-neutral-800 
                    text-neutral-900 dark:text-white 
                    text-sm rounded-md 
                    border-none
                    py-2 px-3
                    focus:ring-2 focus:ring-brand-purple focus:ring-opacity-50
                    cursor-pointer
                  "
                >
                  <option value="all">All Traditions</option>
                  {traditions.map(tradition => (
                    <option key={tradition} value={tradition}>
                      {tradition}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
        
        {/* Teachers - Changed to Single-Select Picklist */}
        {teachers.length > 0 && (
          <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <button 
              onClick={() => toggleSection('teachers')} 
              className="flex items-center justify-between w-full text-left mb-2"
              aria-expanded={expandedSections.teachers}
              aria-controls="teacher-filters"
            >
              <h3 className="text-sm font-medium">Teacher</h3>
              <ChevronDownIcon 
                size={16} 
                className={`transform transition-transform ${expandedSections.teachers ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {expandedSections.teachers && (
              <div id="teacher-filters" className="mt-2">
                <select
                  value={selectedTeacher || 'all'}
                  onChange={handleTeacherChange}
                  className="
                    w-full
                    bg-neutral-100 dark:bg-neutral-800 
                    text-neutral-900 dark:text-white 
                    text-sm rounded-md 
                    border-none
                    py-2 px-3
                    focus:ring-2 focus:ring-brand-purple focus:ring-opacity-50
                    cursor-pointer
                  "
                >
                  <option value="all">All Teachers</option>
                  {teachers.map(teacher => (
                    <option key={teacher} value={teacher}>
                      {teacher}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
        
        {/* Tags - Changed to Multi-Select with Limit */}
        {tags.length > 0 && (
          <div className="pb-3">
            <button 
              onClick={() => toggleSection('tags')} 
              className="flex items-center justify-between w-full text-left mb-2"
              aria-expanded={expandedSections.tags}
              aria-controls="tag-filters"
            >
              <h3 className="text-sm font-medium">
                Tags 
                <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">
                  (Select up to {MAX_TAG_SELECTIONS})
                </span>
              </h3>
              <ChevronDownIcon 
                size={16} 
                className={`transform transition-transform ${expandedSections.tags ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {expandedSections.tags && (
              <div id="tag-filters" className="flex flex-wrap gap-2 mt-2 max-h-40 overflow-y-auto pr-1">
                {tags.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  const isDisabled = !isSelected && selectedTags.length >= MAX_TAG_SELECTIONS;
                  
                  return (
                    <label 
                      key={tag} 
                      className={`
                        inline-flex items-center px-3 py-1.5 rounded-full text-sm
                        ${isSelected 
                          ? 'bg-brand-purple text-white' 
                          : isDisabled
                            ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer hover:opacity-90'}
                        transition-colors
                      `}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => handleTagChange(tag)}
                        aria-label={`Filter by ${tag}`}
                      />
                      {tag}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
