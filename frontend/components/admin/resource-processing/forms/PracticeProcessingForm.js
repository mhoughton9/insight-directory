import { useState } from 'react';
import Image from 'next/image';

const PracticeProcessingForm = ({ 
  resource, 
  processingNotes,
  onSuccess, 
  submitting, 
  setSubmitting, 
  error, 
  setError 
}) => {
  const [formData, setFormData] = useState({
    practiceUrl: resource.url || '',
    imageUrl: resource.imageUrl || '',
    practiceType: resource.practiceDetails?.practiceType || 'meditation',
    difficulty: resource.practiceDetails?.difficulty || 'beginner',
    duration: resource.practiceDetails?.duration || '',
    isGuided: resource.practiceDetails?.isGuided || false
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
      const practiceData = {
        processed: true,
        processingNotes,
        url: formData.practiceUrl.trim(),
        imageUrl: formData.imageUrl.trim(),
        practiceDetails: {
          practiceType: formData.practiceType,
          difficulty: formData.difficulty,
          duration: formData.duration.trim(),
          isGuided: formData.isGuided
        }
      };
      
      // Submit the data
      const response = await fetch(`/api/admin/process/${resource._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(practiceData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process practice');
      }
      
      onSuccess('Practice processed successfully!');
    } catch (err) {
      console.error('Error processing practice:', err);
      setError(err.message || 'Failed to process practice');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Practice Details */}
        <div>
          <h3 className="text-xl font-medium mb-4">Practice Details</h3>
          
          {/* Practice URL */}
          <div className="mb-4">
            <label htmlFor="practiceUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Practice URL (optional)
            </label>
            <input
              type="url"
              id="practiceUrl"
              name="practiceUrl"
              value={formData.practiceUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/practice"
            />
          </div>
          
          {/* Practice Type */}
          <div className="mb-4">
            <label htmlFor="practiceType" className="block text-sm font-medium text-gray-700 mb-1">
              Practice Type
            </label>
            <select
              id="practiceType"
              name="practiceType"
              value={formData.practiceType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="meditation">Meditation</option>
              <option value="inquiry">Self-Inquiry</option>
              <option value="yoga">Yoga</option>
              <option value="breathwork">Breathwork</option>
              <option value="bodywork">Bodywork</option>
              <option value="contemplation">Contemplation</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          {/* Difficulty */}
          <div className="mb-4">
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="all-levels">All Levels</option>
            </select>
          </div>
          
          {/* Duration */}
          <div className="mb-4">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration (e.g., "10 minutes", "1 hour daily")
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 20 minutes daily"
            />
          </div>
          
          {/* Is Guided */}
          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isGuided"
                name="isGuided"
                checked={formData.isGuided}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isGuided" className="ml-2 block text-sm text-gray-700">
                Is this a guided practice?
              </label>
            </div>
          </div>
        </div>
        
        {/* Right Column - Practice Image */}
        <div>
          <h3 className="text-xl font-medium mb-4">Practice Image</h3>
          
          {/* Image URL */}
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Practice Image URL
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
                  alt="Practice image preview" 
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/images/placeholder-practice.png';
                  }}
                />
              </div>
            ) : (
              <div className="h-[250px] w-full mx-auto bg-gray-200 flex items-center justify-center border border-gray-300 rounded">
                <p className="text-gray-500 text-center px-4">No practice image</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>The practice image should represent the type of practice (meditation, yoga, etc.)</p>
            <p className="mt-2">Recommended dimensions: 1200 × 800 pixels (3:2 ratio)</p>
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
          {submitting ? 'Processing...' : 'Process Practice'}
        </button>
      </div>
    </form>
  );
};

export default PracticeProcessingForm;
