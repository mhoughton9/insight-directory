/**
 * Example component demonstrating the centralized error handling system
 */

import React, { useState, useEffect } from 'react';
import resourcesService from '../../services/api/resources';
import teachersService from '../../services/api/teachers';
import traditionsService from '../../services/api/traditions';
import { useApiCall, ErrorMessage } from '../../utils/errorHandling';
import { Heading, Text } from '../ui/Typography';

const ErrorHandlingExample = () => {
  // Using the useApiCall hook for resources
  const {
    isLoading: isLoadingResources,
    error: resourcesError,
    errorMessage: resourcesErrorMessage,
    execute: fetchResources
  } = useApiCall(resourcesService.getAll);

  // Using the useApiCall hook for teachers
  const {
    isLoading: isLoadingTeachers,
    error: teachersError,
    errorMessage: teachersErrorMessage,
    execute: fetchTeachers
  } = useApiCall(teachersService.getAll);

  // State for resources and teachers
  const [resources, setResources] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      // Fetch resources
      const resourcesData = await fetchResources();
      if (resourcesData) {
        setResources(resourcesData.resources || []);
      }

      // Fetch teachers
      const teachersData = await fetchTeachers();
      if (teachersData) {
        setTeachers(teachersData || []);
      }
    };

    loadData();
  }, []);

  // Example of handling an error manually
  const handleInvalidRequest = async () => {
    try {
      // Intentionally call an endpoint with an invalid ID
      await resourcesService.getById('invalid-id');
    } catch (error) {
      // The error is already handled by the API client
      // We can display it using our ErrorMessage component
      console.log('Error handled:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Heading level={1} className="mb-6">Error Handling Example</Heading>
      
      {/* Resources Section */}
      <div className="mb-8">
        <Heading level={2} className="mb-4">Resources</Heading>
        
        {isLoadingResources ? (
          <Text>Loading resources...</Text>
        ) : resourcesError ? (
          <ErrorMessage error={resourcesError} className="mb-4" />
        ) : (
          <div>
            <Text className="mb-2">Loaded {resources.length} resources successfully</Text>
            <ul className="list-disc pl-5">
              {resources.slice(0, 3).map(resource => (
                <li key={resource._id}>{resource.title}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Teachers Section */}
      <div className="mb-8">
        <Heading level={2} className="mb-4">Teachers</Heading>
        
        {isLoadingTeachers ? (
          <Text>Loading teachers...</Text>
        ) : teachersError ? (
          <ErrorMessage error={teachersError} className="mb-4" />
        ) : (
          <div>
            <Text className="mb-2">Loaded {teachers.length} teachers successfully</Text>
            <ul className="list-disc pl-5">
              {teachers.slice(0, 3).map(teacher => (
                <li key={teacher._id}>{teacher.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Error Trigger Button */}
      <div className="mt-8">
        <Heading level={2} className="mb-4">Test Error Handling</Heading>
        <button 
          onClick={handleInvalidRequest}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Trigger Invalid Request
        </button>
        <Text className="mt-2 text-gray-600">
          Click the button above to test the error handling system with an invalid resource ID.
        </Text>
      </div>
    </div>
  );
};

export default ErrorHandlingExample;
