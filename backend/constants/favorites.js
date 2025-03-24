/**
 * Constants related to favorites functionality
 */

const FAVORITE_TYPES = {
  RESOURCE: 'resource',
  TEACHER: 'teacher',
  TRADITION: 'tradition'
};

const FAVORITE_ACTIONS = {
  ADD: 'add',
  REMOVE: 'remove'
};

const FAVORITE_ARRAY_FIELDS = {
  [FAVORITE_TYPES.RESOURCE]: 'favoriteResources',
  [FAVORITE_TYPES.TEACHER]: 'favoriteTeachers',
  [FAVORITE_TYPES.TRADITION]: 'favoriteTraditions'
};

module.exports = {
  FAVORITE_TYPES,
  FAVORITE_ACTIONS,
  FAVORITE_ARRAY_FIELDS,
  
  // Helper function to validate favorite type
  isValidType: (type) => Object.values(FAVORITE_TYPES).includes(type),
  
  // Helper function to validate favorite action
  isValidAction: (action) => Object.values(FAVORITE_ACTIONS).includes(action),
  
  // Helper function to get array field name for a type
  getArrayField: (type) => FAVORITE_ARRAY_FIELDS[type] || null
};
