import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
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

        console.log('Syncing user with our backend:', userData);

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
          console.error('Error response from sync API:', await response.text());
        }
      } catch (error) {
        console.error('Error syncing user:', error);
      } finally {
        setLoading(false);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user, getToken]);

  // Fetch user favorites
  const fetchFavorites = async () => {
    if (!isSignedIn || !user) return;

    try {
      console.log('Fetching favorites for user:', user.id);
      const response = await fetch(`/api/users/favorites?clerkId=${user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Favorites data received:', data);
        setFavorites(data.favorites || {
          resources: [],
          teachers: [],
          traditions: []
        });
      } else {
        console.error('Error fetching favorites:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

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

  // Debounced toggle favorite implementation
  const toggleFavorite = useCallback(async (type, id, action) => {
    if (!isSignedIn || !user) return false;

    // Create a unique key for this toggle operation
    const toggleKey = getToggleKey(type, id);
    
    // Determine action if not provided
    if (!action) {
      const typeKey = `${type}s`; // Convert 'resource' to 'resources', etc.
      const isFavorited = favorites[typeKey]?.includes(id) || false;
      action = isFavorited ? 'remove' : 'add';
    }

    // If there's already a pending operation for this item, cancel it
    if (pendingToggles.current[toggleKey]) {
      console.log('Cancelling pending toggle operation for:', toggleKey);
      pendingToggles.current[toggleKey] = null;
      
      // Update UI to show we're processing the new request
      setPendingRequests(prev => ({
        ...prev,
        [toggleKey]: true
      }));
      
      return false;
    }

    try {
      // Mark this toggle as pending
      pendingToggles.current[toggleKey] = true;
      setPendingRequests(prev => ({
        ...prev,
        [toggleKey]: true
      }));

      // Optimistically update UI
      const currentFavorites = {...favorites};
      const typeKey = `${type}s`; // Convert 'resource' to 'resources', etc.
      
      if (action === 'remove') {
        // Remove from favorites
        currentFavorites[typeKey] = currentFavorites[typeKey].filter(itemId => itemId !== id);
      } else {
        // Add to favorites
        if (!currentFavorites[typeKey].includes(id)) {
          currentFavorites[typeKey] = [...currentFavorites[typeKey], id];
        }
      }
      
      setFavorites(currentFavorites);

      console.log('Toggling favorite:', { type, id, action, clerkId: user.id });
      
      // Send to API
      const response = await fetch('/api/users/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clerkId: user.id,
          type,
          id,
          action
        })
      });

      if (!response.ok) {
        console.error('Error response from API:', await response.text());
        // Revert on error
        setFavorites({...favorites});
        return false;
      }
      
      const data = await response.json();
      console.log('Toggle favorite response:', data);
      
      // Update favorites from the server response to ensure consistency
      setFavorites(data.favorites || {
        resources: [],
        teachers: [],
        traditions: []
      });

      return true;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert on error
      setFavorites({...favorites});
      return false;
    } finally {
      // Clean up pending state
      pendingToggles.current[toggleKey] = null;
      setPendingRequests(prev => ({
        ...prev,
        [toggleKey]: false
      }));
    }
  }, [isSignedIn, user, favorites]);

  // Check if an item is favorited
  const isItemFavorited = useCallback((type, id) => {
    const typeKey = `${type}s`; // Convert 'resource' to 'resources', etc.
    return favorites[typeKey]?.includes(id) || false;
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