import React from 'react';
import PropTypes from 'prop-types';
import { Search } from 'lucide-react';

/**
 * A text input component for search functionality.
 *
 * @param {string} value - The current value of the search input.
 * @param {function} onChange - Callback function triggered when the input value changes.
 * @param {string} [placeholder='Search...'] - Placeholder text for the input.
 * @param {string} [ariaLabel='Search items'] - Accessible label for the input.
 * @param {string} [className=''] - Additional CSS classes for the container div.
 */
const SearchInput = ({ value, onChange, placeholder = 'Search...', ariaLabel = 'Search items', className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <label htmlFor="search-input" className="sr-only">{ariaLabel}</label>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-text-secondary" aria-hidden="true" />
      </div>
      <input
        type="text"
        id="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="block w-full pl-10 pr-3 py-2 border border-card-border rounded-md leading-tight bg-card-bg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
        style={{
          // Optional: Add specific styles if needed
        }}
      />
    </div>
  );
};

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
};

export default SearchInput;
