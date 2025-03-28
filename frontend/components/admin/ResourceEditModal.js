import { useState, useEffect } from 'react';

const ResourceEditModal = ({ resource, onClose, onSave }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize form data when resource changes
  useEffect(() => {
    if (resource) {
      // Create a copy of the resource for editing
      setFormData({
        title: resource.title || '',
        description: resource.description || '',
        url: resource.url || '',
        imageUrl: resource.imageUrl || '',
        // Book-specific fields
        ...(resource.type === 'book' && {
          'bookDetails.author': Array.isArray(resource.bookDetails?.author)
            ? resource.bookDetails.author.join(', ')
            : resource.bookDetails?.author || '',
          'bookDetails.yearPublished': resource.bookDetails?.yearPublished || '',
          'bookDetails.pages': resource.bookDetails?.pages || '',
          'bookDetails.publisher': resource.bookDetails?.publisher || '',
          isbn: resource.isbn || ''
        }),
        // Podcast-specific fields
        ...(resource.type === 'podcast' && {
          'podcastDetails.host': resource.podcastDetails?.host || '',
          'podcastDetails.platform': resource.podcastDetails?.platform || ''
        }),
        // VideoChannel-specific fields
        ...(resource.type === 'videoChannel' && {
          'videoChannelDetails.channelName': resource.videoChannelDetails?.channelName || '',
          'videoChannelDetails.creator': resource.videoChannelDetails?.creator || '',
          'videoChannelDetails.platform': resource.videoChannelDetails?.platform || ''
        }),
        // Website-specific fields
        ...(resource.type === 'website' && {
          'websiteDetails.owner': resource.websiteDetails?.owner || ''
        }),
        // Blog-specific fields
        ...(resource.type === 'blog' && {
          'blogDetails.author': resource.blogDetails?.author || ''
        })
      });
    }
  }, [resource]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Transform form data to match the API expected structure
  const transformFormData = () => {
    const transformedData = { ...formData };
    
    // Handle nested fields
    Object.keys(transformedData).forEach(key => {
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        
        // Initialize parent object if it doesn't exist
        if (!transformedData[parent]) {
          transformedData[parent] = {};
        }
        
        // Set child property
        transformedData[parent][child] = transformedData[key];
        
        // Remove the dot notation property
        delete transformedData[key];
      }
    });
    
    // Handle author arrays for books
    if (resource.type === 'book' && transformedData.bookDetails?.author) {
      // Split by comma and trim whitespace
      transformedData.bookDetails.author = transformedData.bookDetails.author
        .split(',')
        .map(author => author.trim())
        .filter(author => author); // Remove empty strings
    }
    
    // Convert page count to number if present
    if (transformedData.bookDetails?.pages) {
      transformedData.bookDetails.pages = parseInt(transformedData.bookDetails.pages, 10);
    }
    
    return transformedData;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage('');
      
      const transformedData = transformFormData();
      
      const response = await fetch(`/api/admin/resources/${resource._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transformedData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update resource');
      }
      
      setSuccessMessage('Resource updated successfully!');
      
      // Notify parent component
      if (onSave) {
        onSave(data.resource);
      }
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error updating resource:', err);
      setError(err.message || 'Failed to update resource');
    } finally {
      setLoading(false);
    }
  };

  // Render form fields based on resource type
  const renderTypeSpecificFields = () => {
    switch (resource.type) {
      case 'book':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="bookDetails.author" className="block text-sm font-medium text-gray-700 mb-1">
                Author(s)
              </label>
              <input
                type="text"
                id="bookDetails.author"
                name="bookDetails.author"
                value={formData['bookDetails.author'] || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Author names (comma separated)"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="mb-4">
                <label htmlFor="bookDetails.yearPublished" className="block text-sm font-medium text-gray-700 mb-1">
                  Year Published
                </label>
                <input
                  type="text"
                  id="bookDetails.yearPublished"
                  name="bookDetails.yearPublished"
                  value={formData['bookDetails.yearPublished'] || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Year"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="bookDetails.pages" className="block text-sm font-medium text-gray-700 mb-1">
                  Page Count
                </label>
                <input
                  type="number"
                  id="bookDetails.pages"
                  name="bookDetails.pages"
                  value={formData['bookDetails.pages'] || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Number of pages"
                  min="1"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="bookDetails.publisher" className="block text-sm font-medium text-gray-700 mb-1">
                  Publisher
                </label>
                <input
                  type="text"
                  id="bookDetails.publisher"
                  name="bookDetails.publisher"
                  value={formData['bookDetails.publisher'] || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Publisher name"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
                ISBN
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="ISBN-10 or ISBN-13"
              />
            </div>
          </>
        );
        
      case 'podcast':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="podcastDetails.host" className="block text-sm font-medium text-gray-700 mb-1">
                Host
              </label>
              <input
                type="text"
                id="podcastDetails.host"
                name="podcastDetails.host"
                value={formData['podcastDetails.host'] || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Podcast host"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="podcastDetails.platform" className="block text-sm font-medium text-gray-700 mb-1">
                Platform
              </label>
              <input
                type="text"
                id="podcastDetails.platform"
                name="podcastDetails.platform"
                value={formData['podcastDetails.platform'] || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Spotify, Apple Podcasts, etc."
              />
            </div>
          </>
        );
        
      case 'videoChannel':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="videoChannelDetails.channelName" className="block text-sm font-medium text-gray-700 mb-1">
                Channel Name
              </label>
              <input
                type="text"
                id="videoChannelDetails.channelName"
                name="videoChannelDetails.channelName"
                value={formData['videoChannelDetails.channelName'] || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="YouTube channel name"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="videoChannelDetails.creator" className="block text-sm font-medium text-gray-700 mb-1">
                Creator
              </label>
              <input
                type="text"
                id="videoChannelDetails.creator"
                name="videoChannelDetails.creator"
                value={formData['videoChannelDetails.creator'] || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Channel creator"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="videoChannelDetails.platform" className="block text-sm font-medium text-gray-700 mb-1">
                Platform
              </label>
              <input
                type="text"
                id="videoChannelDetails.platform"
                name="videoChannelDetails.platform"
                value={formData['videoChannelDetails.platform'] || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="YouTube, Vimeo, etc."
              />
            </div>
          </>
        );
        
      case 'website':
        return (
          <div className="mb-4">
            <label htmlFor="websiteDetails.owner" className="block text-sm font-medium text-gray-700 mb-1">
              Owner/Organization
            </label>
            <input
              type="text"
              id="websiteDetails.owner"
              name="websiteDetails.owner"
              value={formData['websiteDetails.owner'] || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Website owner or organization"
            />
          </div>
        );
        
      case 'blog':
        return (
          <div className="mb-4">
            <label htmlFor="blogDetails.author" className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              id="blogDetails.author"
              name="blogDetails.author"
              value={formData['blogDetails.author'] || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Blog author"
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!resource) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Resource title"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Resource description"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Resource URL"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Image URL"
            />
          </div>
          
          {/* Render type-specific fields */}
          {renderTypeSpecificFields()}
          
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded mr-2 transition duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-200 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceEditModal;
