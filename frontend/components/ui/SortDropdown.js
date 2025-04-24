import React from 'react';
import PropTypes from 'prop-types';

/**
 * A dropdown component for selecting sort options.
 *
 * @param {object[]} options - Array of sort options. Each object should have `key` and `label` properties.
 * @param {string} value - The currently selected sort option key.
 * @param {function} onChange - Callback function triggered when the selection changes.
 * @param {string} [ariaLabel='Sort by'] - Accessible label for the dropdown.
 * @param {string} [className=''] - Additional CSS classes for the select element.
 */
const SortDropdown = ({ options, value, onChange, ariaLabel = 'Sort by', className = '' }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <label htmlFor="sort-select" className="sr-only">{ariaLabel}</label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className={`block appearance-none w-full bg-card-bg border border-card-border text-text-primary py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${className}`}
        style={{
          // Optional: Add specific styles if needed, potentially referencing CSS vars
        }}
      >
        {options.map((option) => (
          <option 
            key={option.key} 
            value={option.key}
            style={{
              backgroundColor: 'var(--dark-surface)', 
              color: 'var(--text-primary)'
            }}
          >
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-secondary">
        {/* Basic down arrow icon - replace with Lucide if preferred */}
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.516 7.548c.436-.446 1.043-.481 1.576 0L10 10.405l2.908-2.857c.533-.481 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615l-3.712 3.703c-.436.446-1.043.481-1.576 0l-3.712-3.703c-.408-.418-.436-1.17 0-1.615z"/></svg>
      </div>
    </div>
  );
};

SortDropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
};

export default SortDropdown;
