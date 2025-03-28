import { useState } from 'react';
import Image from 'next/image';

const WebsiteProcessingForm = ({ 
  resource, 
  processingNotes,
  onSuccess, 
  submitting, 
  setSubmitting, 
  error, 
  setError 
}) => {
  const [formData, setFormData] = useState({
    websiteUrl: resource.url || '',
    imageUrl: resource.imageUrl || '',
    hasEmailSignup: resource.websiteDetails?.hasEmailSignup || false,
    hasFreeContent: resource.websiteDetails?.hasFreeContent || true,
    hasPaidContent: resource.websiteDetails?.hasPaidContent || false
  });
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Prepare the data for submission
      const websiteData = {
        processed: true,
        processingNotes,
        url: formData.websiteUrl.trim(),
        imageUrl: formData.imageUrl.trim(),
        websiteDetails: {
          hasEmailSignup: formData.hasEmailSignup,
          hasFreeContent: formData.hasFreeContent,
          hasPaidContent: formData.hasPaidContent
        }
      };
      
      // Submit the data
      const response = await fetch(`/api/admin/process/${resource._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(websiteData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process website');
      }
      
      onSuccess('Website processed successfully!');
    } catch (err) {
      console.error('Error processing website:', err);
      setError(err.message || 'Failed to process website');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Website Details */}
        <div>
          <h3 className="text-xl font-medium mb-4">Website Details</h3>
          
          {/* Website URL */}
          <div className="mb-4">
            <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Website URL
            </label>
            <input
              type="url"
              id="websiteUrl"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
              required
            />
          </div>
          
          {/* Website Features */}
          <div className="mb-4">
            <h4 className="text-md font-medium mb-2">Website Features</h4>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasEmailSignup"
                  name="hasEmailSignup"
                  checked={formData.hasEmailSignup}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="hasEmailSignup" className="ml-2 block text-sm text-gray-700">
                  Has email signup/newsletter
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasFreeContent"
                  name="hasFreeContent"
                  checked={formData.hasFreeContent}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="hasFreeContent" className="ml-2 block text-sm text-gray-700">
                  Offers free content
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasPaidContent"
                  name="hasPaidContent"
                  checked={formData.hasPaidContent}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="hasPaidContent" className="ml-2 block text-sm text-gray-700">
                  Offers paid content/courses
                </label>
              </div>
            </div>
          </div>
          
          {/* Website Preview */}
          <div className="mt-6">
            <h4 className="text-md font-medium mb-2">Website Preview</h4>
            <div className="border border-gray-300 rounded overflow-hidden">
              {formData.websiteUrl ? (
                <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
                  <a 
                    href={formData.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              ) : (
                <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">No website URL provided</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column - Website Image */}
        <div>
          <h3 className="text-xl font-medium mb-4">Website Image</h3>
          
          {/* Image URL */}
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Website Image URL
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
                  alt="Website image preview" 
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/images/placeholder-website.png';
                  }}
                />
              </div>
            ) : (
              <div className="h-[250px] w-full mx-auto bg-gray-200 flex items-center justify-center border border-gray-300 rounded">
                <p className="text-gray-500 text-center px-4">No website image</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>The website image should be a screenshot or logo that represents the website.</p>
            <p className="mt-2">Recommended dimensions: 1200 × 630 pixels (16:9 ratio)</p>
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
        >
          {submitting ? 'Processing...' : 'Process Website'}
        </button>
      </div>
    </form>
  );
};

export default WebsiteProcessingForm;
