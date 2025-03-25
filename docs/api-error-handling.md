# API Error Handling System

## Overview

This document describes the centralized API error handling system implemented for the Insight Directory. The system provides consistent error handling, logging, and retry mechanisms across all API requests.

## Components

### 1. Error Handling Utilities (`/frontend/services/api/utils/errorHandler.js`)

- **ApiError Class**: A standardized error structure with consistent properties and methods
- **processResponse**: Processes API responses and creates standardized error objects
- **logApiError**: Provides consistent error logging
- **handleApiError**: Transforms API errors into user-friendly messages

### 2. Retry Mechanism (`/frontend/services/api/utils/retry.js`)

- **retryRequest**: Implements exponential backoff retry logic for failed API requests
- Configurable retry count, delay, and retry conditions

### 3. Enhanced API Client (`/frontend/services/api/client.js`)

- Integrates error handling and retry utilities
- Provides consistent error handling across all HTTP methods
- Includes caching with proper invalidation

### 4. Frontend Error Handling (`/frontend/utils/errorHandling.js`)

- **getErrorMessage**: Converts API errors to user-friendly messages
- **useApiCall**: React hook for handling API loading states and errors
- **ErrorMessage**: React component for displaying error messages

## Usage Examples

### Making API Requests with Retry

```javascript
// In a service file
import apiClient from './client';

const getResource = async (id) => {
  return apiClient.get(`resources/${id}`, { retry: true });
};
```

### Using the Error Handling Hook in Components

```javascript
import { useApiCall } from '../../utils/errorHandling';
import resourcesService from '../../services/api/resources';

const MyComponent = () => {
  const {
    isLoading,
    error,
    errorMessage,
    execute: fetchResources
  } = useApiCall(resourcesService.getAll);

  useEffect(() => {
    fetchResources();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{errorMessage}</div>;

  return <div>Data loaded successfully</div>;
};
```

### Displaying Error Messages

```javascript
import { ErrorMessage } from '../../utils/errorHandling';

const MyComponent = ({ error }) => {
  return (
    <div>
      <h1>My Component</h1>
      <ErrorMessage error={error} />
    </div>
  );
};
```

## Best Practices

1. **Always use the API client** for making requests to ensure consistent error handling
2. **Enable retry for GET requests** that can be safely retried
3. **Use the useApiCall hook** in components to handle loading states and errors
4. **Display user-friendly error messages** using the ErrorMessage component
5. **Invalidate cache when needed** by passing `{ invalidateCache: true }` to mutation methods

## Error Structure

All API errors follow this structure:

```javascript
{
  name: 'ApiError',
  message: 'Error message',
  status: 404, // HTTP status code
  data: {}, // Original error data from the API
  endpoint: 'resources/123', // The API endpoint that was called
  timestamp: '2023-03-25T16:25:58.000Z' // When the error occurred
}
```

Frontend components receive a simplified version:

```javascript
{
  message: 'The requested resource could not be found.', // User-friendly message
  status: 404, // HTTP status code if available
  isApiError: true // Flag to identify API errors
}
