/**
 * Frontend error handling utilities
 * Provides consistent error handling for API errors in UI components
 */

import React, { useState } from 'react';

/**
 * Display an error message based on an API error response
 * @param {Object} error - Error object from API client
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // If it's a standardized API error from our client
  if (error.isApiError) {
    return error.message;
  }
  
  // Handle network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  
  // Handle timeout errors
  if (error.name === 'AbortError') {
    return 'The request timed out. Please try again.';
  }
  
  // Default error message
  return error.message || 'An unexpected error occurred';
};

/**
 * Hook for handling API loading states and errors
 * @param {Function} apiCall - Async function that makes an API call
 * @param {Object} options - Options for the hook
 * @returns {Object} - Loading state, error state, and execute function
 */
export const useApiCall = (apiCall, options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const execute = async (...args) => {
    try {
      setIsLoading(true);
      setError(null);
      return await apiCall(...args);
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return { isLoading, error, errorMessage: error ? getErrorMessage(error) : null, execute };
};

/**
 * Component for displaying API errors
 * @param {Object} props - Component props
 * @param {Object} props.error - Error object
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element|null} - Error message component or null if no error
 */
export const ErrorMessage = ({ error, className = '' }) => {
  if (!error) return null;
  
  return (
    <div className={`text-red-600 text-sm mt-2 ${className}`}>
      {getErrorMessage(error)}
    </div>
  );
};

export default {
  getErrorMessage,
  useApiCall,
  ErrorMessage
};
