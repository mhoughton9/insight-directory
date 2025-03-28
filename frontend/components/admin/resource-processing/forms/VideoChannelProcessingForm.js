import { useState } from 'react';
import Image from 'next/image';

const VideoChannelProcessingForm = ({ 
  resource, 
  processingNotes,
  onSuccess, 
  submitting, 
  setSubmitting, 
  error, 
  setError 
}) => {
  const [formData, setFormData] = useState({
    channelUrl: resource.url || '',
    imageUrl: resource.imageUrl || '',
    platform: resource.videoChannelDetails?.platform || 'youtube',
    channelId: resource.videoChannelDetails?.channelId || '',
    featuredVideoUrl: resource.videoChannelDetails?.featuredVideoUrl || ''
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
      const videoChannelData = {
        processed: true,
        processingNotes,
        url: formData.channelUrl.trim(),
        imageUrl: formData.imageUrl.trim(),
        videoChannelDetails: {
          platform: formData.platform,
          channelId: formData.channelId.trim(),
          featuredVideoUrl: formData.featuredVideoUrl.trim()
        }
      };
      
      // Submit the data
      const response = await fetch(`/api/admin/process/${resource._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(videoChannelData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process video channel');
      }
      
      onSuccess('Video channel processed successfully!');
    } catch (err) {
      console.error('Error processing video channel:', err);
      setError(err.message || 'Failed to process video channel');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Channel Details */}
        <div>
          <h3 className="text-xl font-medium mb-4">Video Channel Details</h3>
          
          {/* Channel URL */}
          <div className="mb-4">
            <label htmlFor="channelUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Channel URL
            </label>
            <input
              type="url"
              id="channelUrl"
              name="channelUrl"
              value={formData.channelUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://youtube.com/c/channelname"
              required
            />
          </div>
          
          {/* Platform */}
          <div className="mb-4">
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
              Platform
            </label>
            <select
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
              <option value="rumble">Rumble</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          {/* Channel ID */}
          <div className="mb-4">
            <label htmlFor="channelId" className="block text-sm font-medium text-gray-700 mb-1">
              Channel ID (optional)
            </label>
            <input
              type="text"
              id="channelId"
              name="channelId"
              value={formData.channelId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., UC1234abcd"
            />
          </div>
          
          {/* Featured Video URL */}
          <div className="mb-4">
            <label htmlFor="featuredVideoUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Featured Video URL (optional)
            </label>
            <input
              type="url"
              id="featuredVideoUrl"
              name="featuredVideoUrl"
              value={formData.featuredVideoUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://youtube.com/watch?v=videoId"
            />
          </div>
        </div>
        
        {/* Right Column - Channel Image */}
        <div>
          <h3 className="text-xl font-medium mb-4">Channel Image</h3>
          
          {/* Image URL */}
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Channel Image URL
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
              <div className="relative h-[200px] w-[200px] mx-auto border border-gray-300 rounded-full overflow-hidden">
                <Image 
                  src={formData.imageUrl} 
                  alt="Channel image preview" 
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/images/placeholder-channel.png';
                  }}
                />
              </div>
            ) : (
              <div className="h-[200px] w-[200px] mx-auto bg-gray-200 flex items-center justify-center border border-gray-300 rounded-full">
                <p className="text-gray-500 text-center px-4">No channel image</p>
              </div>
            )}
          </div>
          
          {/* Video Preview */}
          {formData.featuredVideoUrl && (
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-2">Featured Video Preview</h4>
              <div className="aspect-video w-full bg-gray-100 border border-gray-300 rounded overflow-hidden">
                {formData.featuredVideoUrl.includes('youtube.com') || formData.featuredVideoUrl.includes('youtu.be') ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(formData.featuredVideoUrl)}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500">Preview not available</p>
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
          {submitting ? 'Processing...' : 'Process Video Channel'}
        </button>
      </div>
    </form>
  );
};

// Helper function to extract YouTube video ID from URL
function getYouTubeVideoId(url) {
  if (!url) return '';
  
  // Regular expression to extract the YouTube video ID
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    return match[2];
  }
  
  return '';
}

export default VideoChannelProcessingForm;
