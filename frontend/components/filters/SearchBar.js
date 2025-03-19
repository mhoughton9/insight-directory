import { useState, useEffect, useRef } from 'react';
import { SearchIcon, XIcon } from '../ui/Icons';

/**
 * SearchBar component
 * Provides a search input with debounce functionality
 * Enhanced for mobile responsiveness and accessibility
 */
export default function SearchBar({ onSearch, initialQuery = '', placeholder = 'Search resources...', className = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const searchTimeout = useRef(null);
  const inputRef = useRef(null);
  
  // Debounce search to avoid excessive API calls
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      if (onSearch) {
        onSearch(query);
      }
    }, 300); // 300ms debounce delay
    
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [query, onSearch]);
  
  // Handle input change
  const handleChange = (e) => {
    setQuery(e.target.value);
  };
  
  // Clear search input
  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };
  
  return (
    <form 
      onSubmit={handleSubmit}
      className={`w-full ${className}`}
      role="search"
    >
      <div className={`
        relative flex items-center w-full rounded-lg 
        border transition-all duration-200
        ${isFocused 
          ? 'border-brand-purple shadow-sm' 
          : 'border-neutral-300 dark:border-neutral-700'}
        bg-white dark:bg-neutral-800
      `}>
        <div className="flex-shrink-0 pl-3">
          <SearchIcon 
            size={18} 
            className="text-neutral-500 dark:text-neutral-400" 
          />
        </div>
        
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="
            w-full py-2 px-3 text-sm
            bg-transparent focus:outline-none
            text-neutral-900 dark:text-white
            placeholder-neutral-500 dark:placeholder-neutral-400
          "
          aria-label="Search resources"
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="
              flex-shrink-0 pr-3
              text-neutral-500 dark:text-neutral-400
              hover:text-neutral-700 dark:hover:text-neutral-200
              transition-colors
            "
            aria-label="Clear search"
          >
            <XIcon size={18} />
          </button>
        )}
        
        <button 
          type="submit" 
          className="sr-only"
          aria-label="Submit search"
        >
          Search
        </button>
      </div>
    </form>
  );
}
