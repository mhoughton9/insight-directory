import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import ResourceEditModal from '@/components/admin/ResourceEditModal';

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [typeCounts, setTypeCounts] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);

  // Fetch resources based on selected type
  const fetchResources = async (type = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const url = type ? `/api/admin/resources?type=${type}` : '/api/admin/resources';
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch resources');
      }
      
      setResources(data.resources);
      setTypeCounts(data.typeCounts);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError(err.message || 'Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  // Handle type filter change
  const handleTypeChange = (type) => {
    setSelectedType(type);
    fetchResources(type);
  };

  // Open edit modal for a resource
  const handleEditResource = (resource) => {
    setCurrentResource(resource);
    setEditModalOpen(true);
  };

  // Handle resource update
  const handleResourceUpdate = (updatedResource) => {
    // Update the resource in the list
    setResources(prevResources => 
      prevResources.map(resource => 
        resource._id === updatedResource._id ? updatedResource : resource
      )
    );
  };

  // Format resource type for display
  const formatResourceType = (type) => {
    switch (type) {
      case 'book':
        return 'Book';
      case 'videoChannel':
        return 'Video Channel';
      case 'podcast':
        return 'Podcast';
      case 'website':
        return 'Website';
      case 'blog':
        return 'Blog';
      case 'practice':
        return 'Practice';
      case 'retreatCenter':
        return 'Retreat Center';
      case 'app':
        return 'App';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Load resources on component mount
  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <Head>
        <title>Resource Management | Insight Directory Admin</title>
        <meta name="description" content="Admin tool for managing resources" />
      </Head>

      <h1 className="text-3xl font-semibold mb-6 text-center">Resource Management</h1>
      
      {/* Type Filter Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          <button
            onClick={() => handleTypeChange('')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg ${selectedType === '' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
          >
            All Resources
          </button>
          
          {typeCounts.map((typeCount) => (
            <button
              key={typeCount._id}
              onClick={() => handleTypeChange(typeCount._id)}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg ${selectedType === typeCount._id ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              {formatResourceType(typeCount._id)} ({typeCount.count})
            </button>
          ))}
        </div>
      </div>

      {/* Resource Table */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading resources...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No resources found.
        </div>
      ) : (
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
                  Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {formatResourceType(resource.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {resource.type === 'book' && (
                      <div>
                        {resource.bookDetails?.author && (
                          <div>
                            <span className="font-medium">Author:</span> {Array.isArray(resource.bookDetails.author) 
                              ? resource.bookDetails.author.join(', ')
                              : resource.bookDetails.author}
                          </div>
                        )}
                        {resource.bookDetails?.yearPublished && (
                          <div>
                            <span className="font-medium">Year:</span> {resource.bookDetails.yearPublished}
                          </div>
                        )}
                        {resource.bookDetails?.pages && (
                          <div>
                            <span className="font-medium">Pages:</span> {resource.bookDetails.pages}
                          </div>
                        )}
                      </div>
                    )}
                    {resource.type === 'podcast' && (
                      <div>
                        {resource.podcastDetails?.host && (
                          <div>
                            <span className="font-medium">Host:</span> {resource.podcastDetails.host}
                          </div>
                        )}
                      </div>
                    )}
                    {resource.type === 'videoChannel' && (
                      <div>
                        {resource.videoChannelDetails?.channelName && (
                          <div>
                            <span className="font-medium">Channel:</span> {resource.videoChannelDetails.channelName}
                          </div>
                        )}
                        {resource.videoChannelDetails?.creator && (
                          <div>
                            <span className="font-medium">Creator:</span> {resource.videoChannelDetails.creator}
                          </div>
                        )}
                        {resource.videoChannelDetails?.platform && (
                          <div>
                            <span className="font-medium">Platform:</span> {resource.videoChannelDetails.platform}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditResource(resource)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && currentResource && (
        <ResourceEditModal
          resource={currentResource}
          onClose={() => setEditModalOpen(false)}
          onSave={handleResourceUpdate}
        />
      )}
    </div>
  );
};

// Wrap with AdminLayout
const ProtectedResourceManagement = () => (
  <AdminLayout>
    <ResourceManagement />
  </AdminLayout>
);

export default ProtectedResourceManagement;
