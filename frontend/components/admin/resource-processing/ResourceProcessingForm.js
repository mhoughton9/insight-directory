import { useState } from 'react';
import BookProcessingForm from './forms/BookProcessingForm';
import VideoChannelProcessingForm from './forms/VideoChannelProcessingForm';
import PodcastProcessingForm from './forms/PodcastProcessingForm';
import WebsiteProcessingForm from './forms/WebsiteProcessingForm';
import BlogProcessingForm from './forms/BlogProcessingForm';
import PracticeProcessingForm from './forms/PracticeProcessingForm';
import RetreatCenterProcessingForm from './forms/RetreatCenterProcessingForm';
import AppProcessingForm from './forms/AppProcessingForm';

const ResourceProcessingForm = ({ resource, onSuccess, onNext }) => {
  const [processingNotes, setProcessingNotes] = useState(resource.processingNotes || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);

      const finalData = {
        ...formData,
        processingNotes,
        ...(formData.bookDetails && { bookDetails: formData.bookDetails }),
        ...(formData.videoChannelDetails && { videoChannelDetails: formData.videoChannelDetails }),
        ...(formData.podcastDetails && { podcastDetails: formData.podcastDetails }),
        ...(formData.websiteDetails && { websiteDetails: formData.websiteDetails }),
        ...(formData.blogDetails && { blogDetails: formData.blogDetails }),
        ...(formData.practiceDetails && { practiceDetails: formData.practiceDetails }),
        ...(formData.retreatCenterDetails && { retreatCenterDetails: formData.retreatCenterDetails }),
        ...(formData.appDetails && { appDetails: formData.appDetails })
      };

      const response = await fetch(`/api/admin/process/resource/${resource._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process resource');
      }

      if (onSuccess) {
        onSuccess(data.progress, data.typeCounts);
      }

    } catch (err) {
      console.error('Error processing resource:', err);
      setError(err.message || 'Failed to process resource');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  const renderResourceForm = () => {
    const type = resource.type ? resource.type.trim() : ''; // Trim whitespace defensively
    switch (type) { // Use the trimmed type
      case 'book':
        return <BookProcessingForm resource={resource} onSubmit={handleSubmit} submitting={submitting} />;
      case 'video':
        return <VideoChannelProcessingForm resource={resource} onSubmit={handleSubmit} submitting={submitting} />;
      case 'podcast':
        return <PodcastProcessingForm resource={resource} onSubmit={handleSubmit} submitting={submitting} />;
      case 'website':
        return <WebsiteProcessingForm resource={resource} onSubmit={handleSubmit} submitting={submitting} />;
      case 'blog':
        return <BlogProcessingForm resource={resource} onSubmit={handleSubmit} submitting={submitting} />;
      case 'practice':
        return <PracticeProcessingForm resource={resource} onSubmit={handleSubmit} submitting={submitting} />;
      case 'retreat':
        return <RetreatCenterProcessingForm resource={resource} onSubmit={handleSubmit} submitting={submitting} />;
      case 'app':
        return <AppProcessingForm resource={resource} onSubmit={handleSubmit} submitting={submitting} />;
      default:
        // Log the problematic type with quotes
        console.error(`Unknown or mismatched resource type encountered: "${type}"`);
        return <p className="text-red-500">Unknown resource type: {type}</p>;
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Review & Process: {resource.title} ({resource.type})</h3>
        <p className="text-sm text-gray-600 mb-1">ID: {resource._id}</p>
        {resource.url && (
          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
            Visit Resource Link
          </a>
        )}
      </div>

      {renderResourceForm()}

      <div className="mt-6 mb-6">
        <label htmlFor="processingNotes" className="block text-sm font-medium text-gray-700 mb-1">Admin Processing Notes</label>
        <textarea
          id="processingNotes"
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={processingNotes}
          onChange={(e) => setProcessingNotes(e.target.value)}
          placeholder="Add any notes relevant to processing this resource..."
        ></textarea>
      </div>

      <div className="mb-6">
        <button
          onClick={handleNext}
          disabled={submitting}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-200 mr-2"
        >
          Next
        </button>
        <span className="text-sm text-gray-500">Move to the next resource without processing</span>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
    </div>
  );
};

export default ResourceProcessingForm;
