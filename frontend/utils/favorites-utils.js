/**
 * Utilities for handling favorites operations
 */

/**
 * Favorite types
 */
export const FAVORITE_TYPES = {
  RESOURCE: 'resource',
  TEACHER: 'teacher',
  TRADITION: 'tradition'
};

/**
 * Favorite actions
 */
export const FAVORITE_ACTIONS = {
  ADD: 'add',
  REMOVE: 'remove'
};

/**
 * Toggle a favorite item
 * @param {Object} params - Toggle parameters
 * @param {string} params.type - Type of item (resource, teacher, tradition)
 * @param {string} params.id - ID of the item
 * @param {string} [params.action] - Action to perform (add, remove)
 * @returns {Promise<Object>} API response
 */
export const toggleFavorite = async ({ type, id, action }) => {
  try {
    const response = await fetch('/api/users/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type, id, action })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update favorite');
    }

    return await response.json();
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

/**
 * Get user favorites
 * @returns {Promise<Object>} User favorites
 */
export const getUserFavorites = async () => {
  try {
    const response = await fetch('/api/users/favorites');

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get favorites');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
};

/**
 * Check if an item is in the user's favorites
 * @param {Object} params - Check parameters
 * @param {Object} params.favorites - User favorites object
 * @param {string} params.type - Type of item (resource, teacher, tradition)
 * @param {string} params.id - ID of the item
 * @returns {boolean} True if item is favorited
 */
export const isFavorited = ({ favorites, type, id }) => {
  if (!favorites || !id) return false;
  
  const arrayKey = type === FAVORITE_TYPES.RESOURCE
    ? 'resources'
    : type === FAVORITE_TYPES.TEACHER
      ? 'teachers'
      : 'traditions';
  
  return favorites[arrayKey]?.some(itemId => String(itemId) === String(id)) || false;
};
