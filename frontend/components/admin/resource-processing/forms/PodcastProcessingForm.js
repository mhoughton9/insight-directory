import { useState } from 'react';
import Image from 'next/image';

const PodcastProcessingForm = ({ 
  resource, 
  processingNotes,
  onSuccess, 
  submitting, 
  setSubmitting, 
  error, 
  setError 
}) => {
  const [formData, setFormData] = useState({
    podcastUrl: resource.url || '',
    imageUrl: resource.imageUrl || '',
    platform: resource.podcastDetails?.platform || 'spotify',
    rssUrl: resource.podcastDetails?.rssUrl || '',
    featuredEpisodeUrl: resource.podcastDetails?.featuredEpisodeUrl || ''
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
      const podcastData = {
        processed: true,
        processingNotes,
        url: formData.podcastUrl.trim(),
        imageUrl: formData.imageUrl.trim(),
        podcastDetails: {
          platform: formData.platform,
          rssUrl: formData.rssUrl.trim(),
          featuredEpisodeUrl: formData.featuredEpisodeUrl.trim()
        }
      };
      
      // Submit the data
      const response = await fetch(`/api/admin/process/${resource._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(podcastData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process podcast');
      }
      
      onSuccess('Podcast processed successfully!');
    } catch (err) {
      console.error('Error processing podcast:', err);
      setError(err.message || 'Failed to process podcast');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Podcast Details */}
        <div>
          <h3 className="text-xl font-medium mb-4">Podcast Details</h3>
          
          {/* Podcast URL */}
          <div className="mb-4">
            <label htmlFor="podcastUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Podcast URL
            </label>
            <input
              type="url"
              id="podcastUrl"
              name="podcastUrl"
              value={formData.podcastUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://open.spotify.com/show/..."
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
              <option value="spotify">Spotify</option>
              <option value="apple">Apple Podcasts</option>
              <option value="google">Google Podcasts</option>
              <option value="stitcher">Stitcher</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          {/* RSS URL */}
          <div className="mb-4">
            <label htmlFor="rssUrl" className="block text-sm font-medium text-gray-700 mb-1">
              RSS Feed URL (optional)
            </label>
            <input
              type="url"
              id="rssUrl"
              name="rssUrl"
              value={formData.rssUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://feeds.example.com/podcast.xml"
            />
          </div>
          
          {/* Featured Episode URL */}
          <div className="mb-4">
            <label htmlFor="featuredEpisodeUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Featured Episode URL (optional)
            </label>
            <input
              type="url"
              id="featuredEpisodeUrl"
              name="featuredEpisodeUrl"
              value={formData.featuredEpisodeUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://open.spotify.com/episode/..."
            />
          </div>
        </div>
        
        {/* Right Column - Podcast Image */}
        <div>
          <h3 className="text-xl font-medium mb-4">Podcast Image</h3>
          
          {/* Image URL */}
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Podcast Image URL
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
              <div className="relative h-[300px] w-[300px] mx-auto border border-gray-300 rounded overflow-hidden">
                <Image 
                  src={formData.imageUrl} 
                  alt="Podcast image preview" 
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/images/placeholder-podcast.png';
                  }}
                />
              </div>
            ) : (
              <div className="h-[300px] w-[300px] mx-auto bg-gray-200 flex items-center justify-center border border-gray-300 rounded">
                <p className="text-gray-500 text-center px-4">No podcast image</p>
              </div>
            )}
          </div>
          
          {/* Embed Preview */}
          {formData.platform === 'spotify' && formData.featuredEpisodeUrl && formData.featuredEpisodeUrl.includes('spotify.com/episode/') && (
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-2">Featured Episode Preview</h4>
              <div className="w-full bg-gray-100 border border-gray-300 rounded overflow-hidden">
                <iframe 
                  src={`https://open.spotify.com/embed/episode/${getSpotifyEpisodeId(formData.featuredEpisodeUrl)}`} 
                  width="100%" 
                  height="152" 
                  frameBorder="0" 
                  allowtransparency="true" 
                  allow="encrypted-media"
                ></iframe>
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
          {submitting ? 'Processing...' : 'Process Podcast'}
        </button>
      </div>
    </form>
  );
};

// Helper function to extract Spotify episode ID from URL
function getSpotifyEpisodeId(url) {
  if (!url) return '';
  
  // Extract the episode ID from a Spotify URL
  const match = url.match(/episode\/([a-zA-Z0-9]+)/);
  return match ? match[1] : '';
}

export default PodcastProcessingForm;
