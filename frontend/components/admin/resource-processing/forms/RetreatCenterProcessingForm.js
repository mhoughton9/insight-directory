import { useState } from 'react';
import Image from 'next/image';

const RetreatCenterProcessingForm = ({ 
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
    location: resource.retreatCenterDetails?.location || '',
    offersSilentRetreats: resource.retreatCenterDetails?.offersSilentRetreats || false,
    offersGuidedRetreats: resource.retreatCenterDetails?.offersGuidedRetreats || false,
    accommodationType: resource.retreatCenterDetails?.accommodationType || 'shared',
    priceRange: resource.retreatCenterDetails?.priceRange || 'moderate'
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
      const retreatCenterData = {
        processed: true,
        processingNotes,
        url: formData.websiteUrl.trim(),
        imageUrl: formData.imageUrl.trim(),
        retreatCenterDetails: {
          location: formData.location.trim(),
          offersSilentRetreats: formData.offersSilentRetreats,
          offersGuidedRetreats: formData.offersGuidedRetreats,
          accommodationType: formData.accommodationType,
          priceRange: formData.priceRange
        }
      };
      
      // Submit the data
      const response = await fetch(`/api/admin/process/${resource._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(retreatCenterData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process retreat center');
      }
      
      onSuccess('Retreat center processed successfully!');
    } catch (err) {
      console.error('Error processing retreat center:', err);
      setError(err.message || 'Failed to process retreat center');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Retreat Center Details */}
        <div>
          <h3 className="text-xl font-medium mb-4">Retreat Center Details</h3>
          
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
          
          {/* Location */}
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Bali, Indonesia"
              required
            />
          </div>
          
          {/* Retreat Types */}
          <div className="mb-4">
            <h4 className="text-md font-medium mb-2">Retreat Types</h4>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="offersSilentRetreats"
                  name="offersSilentRetreats"
                  checked={formData.offersSilentRetreats}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="offersSilentRetreats" className="ml-2 block text-sm text-gray-700">
                  Offers silent retreats
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="offersGuidedRetreats"
                  name="offersGuidedRetreats"
                  checked={formData.offersGuidedRetreats}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="offersGuidedRetreats" className="ml-2 block text-sm text-gray-700">
                  Offers guided retreats
                </label>
              </div>
            </div>
          </div>
          
          {/* Accommodation Type */}
          <div className="mb-4">
            <label htmlFor="accommodationType" className="block text-sm font-medium text-gray-700 mb-1">
              Accommodation Type
            </label>
            <select
              id="accommodationType"
              name="accommodationType"
              value={formData.accommodationType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="shared">Shared Rooms</option>
              <option value="private">Private Rooms</option>
              <option value="both">Both Shared and Private</option>
              <option value="camping">Camping/Outdoor</option>
              <option value="luxury">Luxury</option>
              <option value="various">Various Options</option>
            </select>
          </div>
          
          {/* Price Range */}
          <div className="mb-4">
            <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <select
              id="priceRange"
              name="priceRange"
              value={formData.priceRange}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="budget">Budget ($ - $$)</option>
              <option value="moderate">Moderate ($$ - $$$)</option>
              <option value="premium">Premium ($$$ - $$$$)</option>
              <option value="luxury">Luxury ($$$$$)</option>
              <option value="donation">Donation-based</option>
              <option value="various">Various Price Points</option>
            </select>
          </div>
        </div>
        
        {/* Right Column - Retreat Center Image */}
        <div>
          <h3 className="text-xl font-medium mb-4">Retreat Center Image</h3>
          
          {/* Image URL */}
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Retreat Center Image URL
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
                  alt="Retreat center image preview" 
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/images/placeholder-retreat.png';
                  }}
                />
              </div>
            ) : (
              <div className="h-[250px] w-full mx-auto bg-gray-200 flex items-center justify-center border border-gray-300 rounded">
                <p className="text-gray-500 text-center px-4">No retreat center image</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>The image should showcase the retreat center's facilities, surroundings, or meditation spaces.</p>
            <p className="mt-2">Recommended dimensions: 1200 u00d7 800 pixels (3:2 ratio)</p>
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
                    Visit Retreat Center Website
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
      </div>
      
      {/* Submit Button */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
        >
          {submitting ? 'Processing...' : 'Process Retreat Center'}
        </button>
      </div>
    </form>
  );
};

export default RetreatCenterProcessingForm;
