import { useState } from 'react';
import Image from 'next/image';

const AppProcessingForm = ({ 
  resource, 
  processingNotes,
  onSuccess, 
  submitting, 
  setSubmitting, 
  error, 
  setError 
}) => {
  const [formData, setFormData] = useState({
    appUrl: resource.url || '',
    imageUrl: resource.imageUrl || '',
    platforms: resource.appDetails?.platforms || [],
    hasFreeVersion: resource.appDetails?.hasFreeVersion || false,
    hasPaidVersion: resource.appDetails?.hasPaidVersion || false,
    appStoreUrl: resource.appDetails?.appStoreUrl || '',
    playStoreUrl: resource.appDetails?.playStoreUrl || ''
  });
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'platforms') {
      // Handle the platforms checkboxes
      const platformValue = value;
      const updatedPlatforms = [...formData.platforms];
      
      if (checked) {
        if (!updatedPlatforms.includes(platformValue)) {
          updatedPlatforms.push(platformValue);
        }
      } else {
        const index = updatedPlatforms.indexOf(platformValue);
        if (index > -1) {
          updatedPlatforms.splice(index, 1);
        }
      }
      
      setFormData(prev => ({
        ...prev,
        platforms: updatedPlatforms
      }));
    } else {
      // Handle other form fields
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Prepare the data for submission
      const appData = {
        processed: true,
        processingNotes,
        url: formData.appUrl.trim(),
        imageUrl: formData.imageUrl.trim(),
        appDetails: {
          platforms: formData.platforms,
          hasFreeVersion: formData.hasFreeVersion,
          hasPaidVersion: formData.hasPaidVersion,
          appStoreUrl: formData.appStoreUrl.trim(),
          playStoreUrl: formData.playStoreUrl.trim()
        }
      };
      
      // Submit the data
      const response = await fetch(`/api/admin/process/${resource._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process app');
      }
      
      onSuccess('App processed successfully!');
    } catch (err) {
      console.error('Error processing app:', err);
      setError(err.message || 'Failed to process app');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - App Details */}
        <div>
          <h3 className="text-xl font-medium mb-4">App Details</h3>
          
          {/* App URL */}
          <div className="mb-4">
            <label htmlFor="appUrl" className="block text-sm font-medium text-gray-700 mb-1">
              App Website URL
            </label>
            <input
              type="url"
              id="appUrl"
              name="appUrl"
              value={formData.appUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
              required
            />
          </div>
          
          {/* Platforms */}
          <div className="mb-4">
            <h4 className="text-md font-medium mb-2">Available Platforms</h4>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="platform-ios"
                  name="platforms"
                  value="ios"
                  checked={formData.platforms.includes('ios')}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="platform-ios" className="ml-2 block text-sm text-gray-700">
                  iOS
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="platform-android"
                  name="platforms"
                  value="android"
                  checked={formData.platforms.includes('android')}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="platform-android" className="ml-2 block text-sm text-gray-700">
                  Android
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="platform-web"
                  name="platforms"
                  value="web"
                  checked={formData.platforms.includes('web')}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="platform-web" className="ml-2 block text-sm text-gray-700">
                  Web
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="platform-desktop"
                  name="platforms"
                  value="desktop"
                  checked={formData.platforms.includes('desktop')}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="platform-desktop" className="ml-2 block text-sm text-gray-700">
                  Desktop
                </label>
              </div>
            </div>
          </div>
          
          {/* App Store URLs */}
          {(formData.platforms.includes('ios') || formData.platforms.includes('android')) && (
            <div className="space-y-4 mb-4">
              {formData.platforms.includes('ios') && (
                <div>
                  <label htmlFor="appStoreUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    App Store URL (iOS)
                  </label>
                  <input
                    type="url"
                    id="appStoreUrl"
                    name="appStoreUrl"
                    value={formData.appStoreUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://apps.apple.com/app/..."
                  />
                </div>
              )}
              
              {formData.platforms.includes('android') && (
                <div>
                  <label htmlFor="playStoreUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Play Store URL (Android)
                  </label>
                  <input
                    type="url"
                    id="playStoreUrl"
                    name="playStoreUrl"
                    value={formData.playStoreUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://play.google.com/store/apps/..."
                  />
                </div>
              )}
            </div>
          )}
          
          {/* Pricing Options */}
          <div className="mb-4">
            <h4 className="text-md font-medium mb-2">Pricing Options</h4>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasFreeVersion"
                  name="hasFreeVersion"
                  checked={formData.hasFreeVersion}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="hasFreeVersion" className="ml-2 block text-sm text-gray-700">
                  Has free version/tier
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasPaidVersion"
                  name="hasPaidVersion"
                  checked={formData.hasPaidVersion}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="hasPaidVersion" className="ml-2 block text-sm text-gray-700">
                  Has paid version/subscription
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - App Image */}
        <div>
          <h3 className="text-xl font-medium mb-4">App Image</h3>
          
          {/* Image URL */}
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              App Image URL
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
                  alt="App image preview" 
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/images/placeholder-app.png';
                  }}
                />
              </div>
            ) : (
              <div className="h-[250px] w-full mx-auto bg-gray-200 flex items-center justify-center border border-gray-300 rounded">
                <p className="text-gray-500 text-center px-4">No app image</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>The app image should be the app icon, screenshot, or promotional image.</p>
            <p className="mt-2">Recommended dimensions: 1200 u00d7 630 pixels (16:9 ratio)</p>
          </div>
          
          {/* Store Links */}
          {(formData.appStoreUrl || formData.playStoreUrl) && (
            <div className="mt-6">
              <h4 className="text-md font-medium mb-2">App Store Links</h4>
              <div className="space-y-2">
                {formData.appStoreUrl && (
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.79 1.18-.12 2.29-.84 3.46-.75 1.57.12 2.78.88 3.54 2.18-3.2 1.9-2.62 6.46.92 7.87-.71 1.53-1.66 3.03-3 3.88zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.26 2.01-1.76 4.07-3.74 4.25z"/>
                    </svg>
                    <a 
                      href={formData.appStoreUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View on App Store
                    </a>
                  </div>
                )}
                
                {formData.playStoreUrl && (
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3.18 20.83c.55.34 1.2.54 1.89.54.34 0 .69-.05 1.03-.15L6 21.2v-14.6l-3.03 1.58c-.56.29-.97.83-1.13 1.47-.16.64-.07 1.31.24 1.88l4.72 8.4c-.35.19-.75.29-1.14.29-.28 0-.55-.05-.82-.15-.83-.31-1.48-1-1.73-1.86-.25-.86-.13-1.77.33-2.52l3.28-5.8c.16-.28.51-.37.78-.22.28.16.37.51.22.78l-3.28 5.8c-.3.49-.38 1.11-.2 1.67.18.57.6 1.03 1.17 1.24.57.21 1.19.17 1.72-.12.53-.29.92-.8 1.09-1.38l-4.72-8.4c-.21-.38-.27-.82-.18-1.24.09-.42.35-.79.72-.99l4.6-2.4c.37-.19.8-.23 1.2-.11.4.12.75.37.98.71l6.82 9.97 1.41-2.35L6.61 3.29l-4.15 2.17c-.56.29-1.03.74-1.35 1.29-.32.55-.49 1.17-.49 1.81v12.27z"/>
                      <path d="M16.74 21.94c-1.27 0-2.49-.47-3.44-1.32l-3.97-3.57 2.31-1.21 3.97 3.57c.62.56 1.43.86 2.26.86.84 0 1.64-.3 2.26-.86l3.97-3.57 2.31 1.21-3.97 3.57c-.94.85-2.17 1.32-3.44 1.32z"/>
                    </svg>
                    <a 
                      href={formData.playStoreUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View on Play Store
                    </a>
                  </div>
                )}
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
          {submitting ? 'Processing...' : 'Process App'}
        </button>
      </div>
    </form>
  );
};

export default AppProcessingForm;
