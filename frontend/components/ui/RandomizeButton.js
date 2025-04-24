import React from 'react';
import PropTypes from 'prop-types';
import { Shuffle } from 'lucide-react';

/**
 * A button component to trigger randomization of a list.
 *
 * @param {function} onClick - Callback function triggered when the button is clicked.
 * @param {string} [label='Randomize'] - Text label for the button (optional, icon is primary).
 * @param {string} [ariaLabel='Randomize list order'] - Accessible label for the button.
 * @param {string} [className=''] - Additional CSS classes for the button element.
 */
const RandomizeButton = ({ onClick, label, ariaLabel = 'Randomize list order', className = '' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center px-3 py-2 border border-card-border rounded-md shadow-sm text-sm font-medium text-text-primary bg-card-bg hover:!bg-[var(--dark-surface-hover)] focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-blue-500 ${className}`}
      title={ariaLabel} // Tooltip for clarity
    >
      <Shuffle className="h-4 w-4" aria-hidden="true" />
      {label && <span className="ml-2">{label}</span>}
    </button>
  );
};

RandomizeButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
};

export default RandomizeButton;
