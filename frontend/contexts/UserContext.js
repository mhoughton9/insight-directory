import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useAuthHeaders } from '@/utils/auth-helpers';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const { getHeaders: getAuthHeadersFunction } = useAuthHeaders();
  const [userProfile, setUserProfile] = useState(null);
  const [favorites, setFavorites] = useState({
    resources: [],
    teachers: [],
    traditions: []
  });
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState({});
  
  // Ref to store pending toggle operations
  const pendingToggles = useRef({});

  // Sync user with our database when they sign in
  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !isSignedIn) {
        setLoading(false);
        return;
      }

      try {
        // Get the Clerk JWT token
        const token = await getToken();
        
        // Prepare user data from Clerk
        const userData = {
          clerkId: user.id, // Explicitly include clerkId
          email: user.primaryEmailAddress?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl
        };

        // Sync with our backend
        const response = await fetch('/api/users/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(userData)
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.user);
          
          // Fetch user favorites
          await fetchFavorites();
        } else {
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user, getToken]);

  // Fetch user favorites
  const fetchFavorites = useCallback(async () => {
    if (!isSignedIn || !user) return;

    try {
      const headers = await getAuthHeadersFunction();
      if (!headers) {
        console.error('Failed to get auth headers for fetching favorites.');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`/api/users/favorites`, {
        headers: headers
      });
      
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || {
          resources: [],
          teachers: [],
          traditions: []
        });
      } else {
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, user, getAuthHeadersFunction]);

  // Add an item to favorites
  const addFavorite = async (type, id) => {
    return toggleFavorite(type, id, 'add');
  };

  // Remove an item from favorites
  const removeFavorite = async (type, id) => {
    return toggleFavorite(type, id, 'remove');
  };

  // Create a unique key for each toggle operation
  const getToggleKey = (type, id) => `${type}-${id}`;

  /**
   * Toggle favorite status for a resource, teacher, or tradition
   * @param {string} type - Type of item (resource, teacher, tradition)
   * @param {string} id - ID of the item
   * @returns {Promise<boolean>} - Success status
   */
  const toggleFavorite = useCallback(async (type, id) => {
    if (!isSignedIn || !user) {
      return false;
    }
    
    // Create a unique key for this toggle operation
    const toggleKey = `${type}-${id}`;
    
    // Check if this toggle is already in progress
    if (pendingToggles.current[toggleKey]) {
      return false;
    }
    
    try {
      // Mark this toggle as pending
      pendingToggles.current[toggleKey] = true;
      setPendingRequests(prev => ({
        ...prev,
        [toggleKey]: true
      }));

      // Store the original favorites state before optimistic update
      const originalFavorites = JSON.parse(JSON.stringify(favorites));
      
      // Determine if we're adding or removing based on current state
      const typeKey = `${type}s`; // Convert 'resource' to 'resources', etc.
      // Convert both to strings when checking inclusion
      const isFavorited = favorites[typeKey] && favorites[typeKey].some(itemId => String(itemId) === String(id));
      const action = isFavorited ? 'remove' : 'add';
      
      // Optimistically update UI
      const currentFavorites = {...favorites};
      
      if (action === 'remove') {
        // Remove from favorites using string comparison
        currentFavorites[typeKey] = currentFavorites[typeKey].filter(itemId => String(itemId) !== String(id));
      } else {
        // Add to favorites
        if (!currentFavorites[typeKey].some(itemId => String(itemId) === String(id))) {
          currentFavorites[typeKey] = [...currentFavorites[typeKey], id];
        }
      }
      
      setFavorites(currentFavorites);

      const headers = await getAuthHeadersFunction();
      if (!headers) {
        console.error('Failed to get auth headers for updating favorite status.');
        return false;
      }
      headers['Content-Type'] = 'application/json'; // Ensure content type is set
      
      // Send to API
      const response = await fetch('/api/users/favorites', {
        method: action === 'remove' ? 'DELETE' : 'POST', // Use correct method
        headers: {
          ...headers,
        },
        body: JSON.stringify({
          type,
          id,
        })
      });

      if (!response.ok) {
        // Get error details from response
        const errorData = await response.json();
        
        // Revert to original state on error
        setFavorites(originalFavorites);
        
        throw new Error(errorData.message || 'Failed to update favorite status');
      }
      
      const data = await response.json();
      
      // Update favorites from the server response to ensure consistency
      if (data.success && data.favorites) {
        setFavorites(data.favorites);
        
        // Dispatch a custom event to notify all components that favorites have changed
        const event = new CustomEvent('favorites-changed', { detail: data.favorites });
        window.dispatchEvent(event);
        
        return true;
      } else {
        // If the response doesn't include favorites or indicates failure
        setFavorites(originalFavorites);
        throw new Error(data.message || 'Failed to update favorite status');
      }
    } catch (error) {
      // Return false but don't throw so the component can handle it gracefully
      return false;
    } finally {
      // Clean up pending state
      pendingToggles.current[toggleKey] = null;
      setPendingRequests(prev => ({
        ...prev,
        [toggleKey]: false
      }));
    }
  }, [isSignedIn, user, favorites, getAuthHeadersFunction]);

  // Check if an item is favorited
  const isItemFavorited = useCallback((type, id) => {
    const typeKey = `${type}s`; // Convert 'resource' to 'resources', etc.
    return favorites[typeKey]?.some(itemId => String(itemId) === String(id)) || false;
  }, [favorites]);
  
  // Check if there's a pending request for an item
  const isItemPending = useCallback((type, id) => {
    const toggleKey = getToggleKey(type, id);
    return !!pendingRequests[toggleKey];
  }, [pendingRequests]);

  const value = {
    isLoaded,
    isSignedIn,
    user,
    userProfile,
    favorites,
    loading,
    fetchFavorites,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    isItemFavorited,
    isItemPending
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);

export default UserContext;