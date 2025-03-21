import React from 'react';
import Link from 'next/link';

/**
 * ErrorMessage component
 * Displays a standardized error message with optional retry functionality
 * @param {Object} props - Component props
 * @param {string} props.title - Error title
 * @param {string} props.message - Error message
 * @param {string} props.linkHref - URL for the action button
 * @param {string} props.linkText - Text for the action button
 * @param {Function} props.onRetry - Optional retry function
 */
const ErrorMessage = ({ 
  title = 'Not Found', 
  message = 'The item you are looking for does not exist or has been removed.',
  linkHref = '/',
  linkText = 'Go Back',
  onRetry = null
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h2 className="text-2xl font-medium text-neutral-800 dark:text-neutral-200 mb-4 font-lora">
        {title}
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8 font-inter">
        {message}
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link 
          href={linkHref}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-purple hover:bg-brand-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple transition-colors font-inter"
        >
          {linkText}
        </Link>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 dark:border-neutral-700 text-base font-medium rounded-md text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple transition-colors font-inter"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
