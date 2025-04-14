/**
 * Authentication helpers for working with Clerk
 */
import { useUser, useAuth } from '@clerk/nextjs';

/**
 * Hook to get authentication headers for API requests
 * @returns {Object} Object containing auth headers and user info
 */
export const useAuthHeaders = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  
  // Default headers with no auth
  const headers = {};
  
  // Add auth headers if user is signed in
  const getHeaders = async () => {
    if (isLoaded && isSignedIn && user) {
      // Get the Clerk JWT token
      const token = await getToken();
      
      // Add Clerk session token as Bearer token
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Add Clerk user ID for backend identification - REMOVED as backend uses token only
      // headers['x-clerk-user-id'] = user.id;
    }
    
    return headers;
  };
  
  return {
    getHeaders,
    isAuthenticated: isLoaded && isSignedIn,
    isLoading: !isLoaded,
    userId: isLoaded && isSignedIn ? user.id : null
  };
};

/**
 * Check if a user can perform an action on a comment
 * @param {Object} comment - The comment object
 * @param {Object} user - The current user from Clerk
 * @returns {Object} Object with permissions
 */
export const getCommentPermissions = (comment, user) => {
  if (!comment || !user) {
    return {
      canEdit: false,
      canDelete: false,
      canReport: false,
      isOwner: false
    };
  }
  
  // Check if user is the comment owner
  const isOwner = comment.user?._id === user.id || 
                 comment.user?.clerkId === user.id;
  
  // Check if comment is still editable (within 3 days)
  const now = new Date();
  const createdAt = new Date(comment.createdAt);
  const diffTime = Math.abs(now - createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isEditable = diffDays <= 3;
  
  return {
    canEdit: isOwner && isEditable,
    canDelete: isOwner,
    canReport: !isOwner, // Only non-owners can report
    isOwner
  };
};
