/**
 * API Services Index
 * Exports all API services for easy importing
 */

import apiClient from './client';
import resourcesService from './resources';
import teachersService from './teachers';
import traditionsService from './traditions';

export {
  apiClient,
  resourcesService,
  teachersService,
  traditionsService
};

// Default export for convenience
export default {
  resources: resourcesService,
  teachers: teachersService,
  traditions: traditionsService
};
