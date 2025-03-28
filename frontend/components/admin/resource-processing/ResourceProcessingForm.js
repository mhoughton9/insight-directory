import { useState } from 'react';
import BookProcessingForm from './forms/BookProcessingForm';
import VideoChannelProcessingForm from './forms/VideoChannelProcessingForm';
import PodcastProcessingForm from './forms/PodcastProcessingForm';
import WebsiteProcessingForm from './forms/WebsiteProcessingForm';
import BlogProcessingForm from './forms/BlogProcessingForm';
import PracticeProcessingForm from './forms/PracticeProcessingForm';
import RetreatCenterProcessingForm from './forms/RetreatCenterProcessingForm';
import AppProcessingForm from './forms/AppProcessingForm';

const ResourceProcessingForm = ({ resource, onSuccess, onSkip }) => {
  const [processingNotes, setProcessingNotes] = useState(resource.processingNotes || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Handle skipping the current resource
  const handleSkip = async () => {
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await fetch(`/api/admin/process/${resource._id}/skip`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ processingNotes })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to skip resource');
      }
      
      // Explicitly fetch the next resource instead of relying on the parent component
      const type = resource.type;
      const nextResourceResponse = await fetch(`/api/admin/process/next-unprocessed?type=${type}`);
      const nextResourceData = await nextResourceResponse.json();
      
      if (!nextResourceResponse.ok) {
        throw new Error(nextResourceData.message || 'Failed to fetch next resource');
      }
      
      // Pass the progress data and the next resource data to the parent component
      onSkip(data.progress, data.typeCounts, nextResourceData.resource);
    } catch (err) {
      console.error('Error skipping resource:', err);
      setError(err.message || 'Failed to skip resource');
    } finally {
      setSubmitting(false);
    }
  };

  // Render the appropriate form based on resource type
  const renderResourceForm = () => {
    switch (resource.type) {
      case 'book':
        return (
          <BookProcessingForm 
            resource={resource} 
            processingNotes={processingNotes}
            setProcessingNotes={setProcessingNotes}
            onSuccess={onSuccess}
            submitting={submitting}
            setSubmitting={setSubmitting}
            error={error}
            setError={setError}
          />
        );
      case 'videoChannel':
        return (
          <VideoChannelProcessingForm 
            resource={resource} 
            processingNotes={processingNotes}
            setProcessingNotes={setProcessingNotes}
            onSuccess={onSuccess}
            submitting={submitting}
            setSubmitting={setSubmitting}
            error={error}
            setError={setError}
          />
        );
      case 'podcast':
        return (
          <PodcastProcessingForm 
            resource={resource} 
            processingNotes={processingNotes}
            setProcessingNotes={setProcessingNotes}
            onSuccess={onSuccess}
            submitting={submitting}
            setSubmitting={setSubmitting}
            error={error}
            setError={setError}
          />
        );
      case 'website':
        return (
          <WebsiteProcessingForm 
            resource={resource} 
            processingNotes={processingNotes}
            setProcessingNotes={setProcessingNotes}
            onSuccess={onSuccess}
            submitting={submitting}
            setSubmitting={setSubmitting}
            error={error}
            setError={setError}
          />
        );
      case 'blog':
        return (
          <BlogProcessingForm 
            resource={resource} 
            processingNotes={processingNotes}
            setProcessingNotes={setProcessingNotes}
            onSuccess={onSuccess}
            submitting={submitting}
            setSubmitting={setSubmitting}
            error={error}
            setError={setError}
          />
        );
      case 'practice':
        return (
          <PracticeProcessingForm 
            resource={resource} 
            processingNotes={processingNotes}
            setProcessingNotes={setProcessingNotes}
            onSuccess={onSuccess}
            submitting={submitting}
            setSubmitting={setSubmitting}
            error={error}
            setError={setError}
          />
        );
      case 'retreatCenter':
        return (
          <RetreatCenterProcessingForm 
            resource={resource} 
            processingNotes={processingNotes}
            setProcessingNotes={setProcessingNotes}
            onSuccess={onSuccess}
            submitting={submitting}
            setSubmitting={setSubmitting}
            error={error}
            setError={setError}
          />
        );
      case 'app':
        return (
          <AppProcessingForm 
            resource={resource} 
            processingNotes={processingNotes}
            setProcessingNotes={setProcessingNotes}
            onSuccess={onSuccess}
            submitting={submitting}
            setSubmitting={setSubmitting}
            error={error}
            setError={setError}
          />
        );
      default:
        return (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p>Unknown resource type: {resource.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-medium mb-2">{resource.title || 'Untitled Resource'}</h2>
        <p className="text-gray-600 mb-2">Type: {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</p>
        <p className="text-gray-600 mb-2">ID: {resource._id}</p>
        
        {resource.description && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-gray-700">{resource.description}</p>
          </div>
        )}
      </div>

      {/* Processing Notes */}
      <div className="mb-6">
        <label htmlFor="processingNotes" className="block text-sm font-medium text-gray-700 mb-1">
          Processing Notes (internal only)
        </label>
        <textarea
          id="processingNotes"
          value={processingNotes}
          onChange={(e) => setProcessingNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="Add any notes about processing this resource..."
        />
      </div>

      {/* Skip Button */}
      <div className="mb-6">
        <button
          onClick={handleSkip}
          disabled={submitting}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-200 mr-2"
        >
          {submitting ? 'Skipping...' : 'Skip for Now'}
        </button>
        <span className="text-sm text-gray-500">Skip this resource and come back to it later</span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Resource-specific Form */}
      {renderResourceForm()}
    </div>
  );
};

export default ResourceProcessingForm;
