import { useState } from 'react';
import Image from 'next/image';

const BlogProcessingForm = ({ 
  resource, 
  processingNotes,
  onSuccess, 
  submitting, 
  setSubmitting, 
  error, 
  setError 
}) => {
  const [formData, setFormData] = useState({
    blogUrl: resource.url || '',
    imageUrl: resource.imageUrl || '',
    authorName: resource.blogDetails?.authorName || '',
    frequency: resource.blogDetails?.frequency || 'monthly',
    featuredPostUrl: resource.blogDetails?.featuredPostUrl || ''
  });
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Prepare the data for submission
      const blogData = {
        processed: true,
        processingNotes,
        url: formData.blogUrl.trim(),
        imageUrl: formData.imageUrl.trim(),
        blogDetails: {
          authorName: formData.authorName.trim(),
          frequency: formData.frequency,
          featuredPostUrl: formData.featuredPostUrl.trim()
        }
      };
      
      // Submit the data
      const response = await fetch(`/api/admin/process/${resource._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(blogData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process blog');
      }
      
      onSuccess('Blog processed successfully!');
    } catch (err) {
      console.error('Error processing blog:', err);
      setError(err.message || 'Failed to process blog');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Blog Details */}
        <div>
          <h3 className="text-xl font-medium mb-4">Blog Details</h3>
          
          {/* Blog URL */}
          <div className="mb-4">
            <label htmlFor="blogUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Blog URL
            </label>
            <input
              type="url"
              id="blogUrl"
              name="blogUrl"
              value={formData.blogUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/blog"
              required
            />
          </div>
          
          {/* Author Name */}
          <div className="mb-4">
            <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">
              Author Name
            </label>
            <input
              type="text"
              id="authorName"
              name="authorName"
              value={formData.authorName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>
          
          {/* Frequency */}
          <div className="mb-4">
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
              Posting Frequency
            </label>
            <select
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="irregular">Irregular</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          {/* Featured Post URL */}
          <div className="mb-4">
            <label htmlFor="featuredPostUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Featured Post URL (optional)
            </label>
            <input
              type="url"
              id="featuredPostUrl"
              name="featuredPostUrl"
              value={formData.featuredPostUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/blog/featured-post"
            />
          </div>
          
          {/* Blog Preview */}
          <div className="mt-6">
            <h4 className="text-md font-medium mb-2">Blog Preview</h4>
            <div className="border border-gray-300 rounded overflow-hidden">
              {formData.blogUrl ? (
                <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
                  <a 
                    href={formData.blogUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visit Blog
                  </a>
                </div>
              ) : (
                <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">No blog URL provided</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column - Blog Image */}
        <div>
          <h3 className="text-xl font-medium mb-4">Blog Image</h3>
          
          {/* Image URL */}
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Blog Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>
          
          {/* Image Preview */}
          <div className="mt-4">
            {formData.imageUrl ? (
              <div className="relative h-[250px] w-full mx-auto border border-gray-300 rounded overflow-hidden">
                <Image 
                  src={formData.imageUrl} 
                  alt="Blog image preview" 
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/images/placeholder-blog.png';
                  }}
                />
              </div>
            ) : (
              <div className="h-[250px] w-full mx-auto bg-gray-200 flex items-center justify-center border border-gray-300 rounded">
                <p className="text-gray-500 text-center px-4">No blog image</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>The blog image should be a screenshot, header image, or logo that represents the blog.</p>
            <p className="mt-2">Recommended dimensions: 1200 u00d7 630 pixels (16:9 ratio)</p>
          </div>
          
          {/* Featured Post Preview */}
          {formData.featuredPostUrl && (
            <div className="mt-6">
              <h4 className="text-md font-medium mb-2">Featured Post</h4>
              <div className="border border-gray-300 rounded p-4">
                <p className="text-sm text-gray-600 mb-2">Featured post URL:</p>
                <a 
                  href={formData.featuredPostUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm break-all"
                >
                  {formData.featuredPostUrl}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
        >
          {submitting ? 'Processing...' : 'Process Blog'}
        </button>
      </div>
    </form>
  );
};

export default BlogProcessingForm;
