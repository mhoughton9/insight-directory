import { clerkClient, useAuth } from '@clerk/nextjs';

// Utility function to create the full API URL
export const createApiUrl = (path) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  // Ensure the path starts with a '/' and remove any trailing '/' from baseUrl
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBaseUrl}${cleanPath}`;
};

// Utility function to add Authorization header with Clerk JWT
export const withAuth = async (options = {}) => {
  const { getToken } = useAuth(); // This needs to be called within a component or custom hook
  
  // Note: This implementation detail might need adjustment
  // Ideally, getToken is accessed closer to the component layer
  // For a standalone utility, we might need a different approach or pass getToken
  // For now, assuming this utility might be refactored or used within a context
  // where useAuth is available.
  
  // Placeholder: In a real scenario, you'd get the token here.
  // const token = await getToken(); 
  // This line will cause an error if called directly outside a component/hook.
  // A better pattern might be to have a hook that provides fetchWithAuth.
  
  // For demonstration, let's assume a way to get the token exists
  // This part needs careful implementation depending on where it's called from
  let token = null;
  try {
    // THIS IS CONCEPTUAL - Direct useAuth().getToken() call won't work here.
    // You need to get the token from where useAuth() is properly used (e.g., component state or context).
    // const { getToken: getAuthToken } = useAuth(); // Cannot call hooks here
    // token = await getAuthToken();
    console.warn('withAuth utility needs token retrieval implementation specific to its usage context.');
  } catch (error) {
    console.error('Error obtaining Clerk token in withAuth utility:', error);
  }

  const headers = {
    ...options.headers,
  };

  // if (token) { // Add header only if token exists
  //   headers['Authorization'] = `Bearer ${token}`;
  // }

  return {
    ...options,
    headers,
  };
};

// Utility function to make authenticated fetch requests
export const fetchWithAuth = async (url, options = {}, getAuthToken) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (typeof getAuthToken !== 'function') {
    throw new Error('getAuthToken function must be provided to fetchWithAuth');
  }

  try {
    const token = await getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('Clerk token not available for fetchWithAuth call to:', url);
      // Depending on requirements, you might throw an error here
      // throw new Error('Authentication token not available'); 
    }
  } catch (error) {
    console.error('Error getting Clerk token for fetch:', error);
    throw new Error('Failed to obtain authentication token');
  }

  const fetchOptions = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, fetchOptions);
    // Basic response handling - can be expanded
    // if (!response.ok) {
    //   const errorData = await response.json().catch(() => ({ message: 'Request failed with status: ' + response.status }));
    //   throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    // }
    return response; // Return the raw response for further handling
  } catch (error) {
    console.error('Fetch error in fetchWithAuth:', error);
    throw error; // Re-throw the error for the caller to handle
  }
};
