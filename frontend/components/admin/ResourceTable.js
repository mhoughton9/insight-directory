import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { formatResourceType } from './utils/resource-type-utils';
import { useAuthHeaders } from '@/utils/auth-helpers';

/**
 * Resource Table Component
 * 
 * Displays a table of resources with basic filtering by type and status
 */
const ResourceTable = () => {
  const { user } = useUser();
  const { getHeaders: getAuthHeadersFunction } = useAuthHeaders();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [resourceTypes, setResourceTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch resources based on filters
  useEffect(() => {
    const fetchResources = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Build query string based on filters
        let queryParams = new URLSearchParams();
        queryParams.append('clerkId', user.id);
        if (selectedType) queryParams.append('type', selectedType);
        if (selectedStatus) queryParams.append('processed', selectedStatus);
        if (searchTerm) queryParams.append('search', searchTerm);
        
        // Fetch resources from the API
        const response = await fetch(`/api/admin/resources?${queryParams.toString()}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch resources');
        }
        
        setResources(data.resources || []);
        
        // Set resource types if not already set
        if (resourceTypes.length === 0 && data.typeCounts) {
          // Extract the types from typeCounts and set them
          const types = data.typeCounts.map(item => item._id);
          setResourceTypes(types);
        }
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError(err.message || 'Failed to fetch resources');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, [user, selectedType, selectedStatus, searchTerm]);

  // Handle resource deletion
  const handleDeleteResource = async (resourceId) => {
    if (!user) return;

    if (!window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      return;
    }

    const headers = await getAuthHeadersFunction();
    if (!headers) {
      alert('Authentication failed. Cannot delete resource.');
      return;
    }

    try {
      const response = await fetch(`/api/admin/resources/${resourceId}`, {
        method: 'DELETE',
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      // Remove the deleted resource from the state
      setResources(resources.filter(resource => resource._id !== resourceId));
    } catch (err) {
      console.error('Error deleting resource:', err);
      alert(`Error: ${err.message || 'Failed to delete resource'}`);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Resource Management</h2>
        <Link 
          href="/admin/add-resource" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm"
        >
          Add New Resource
        </Link>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1">
          Search Resources
        </label>
        <input
          id="search-input"
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Search by title, description, or tags"
        />
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Resource Type
          </label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {resourceTypes.map((type) => (
              <option key={type} value={type}>
                {formatResourceType(type)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="true">Posted</option>
            <option value="false">Pending</option>
          </select>
        </div>
      </div>
      
      {/* Resources Table */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 py-4">{error}</div>
      ) : resources.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resources.map((resource) => (
                <tr key={resource._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatResourceType(resource.type)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${resource.processed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {resource.processed ? 'Posted' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(resource.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      href={`/admin/edit-resource/${resource._id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteResource(resource._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No resources found. {selectedType || selectedStatus || searchTerm ? 'Try adjusting your filters.' : ''}
        </div>
      )}
    </div>
  );
};

export default ResourceTable;
