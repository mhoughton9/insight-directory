import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import ResourceTypeSelector from '@/components/admin/resource-processing/ResourceTypeSelector';
import ResourceProcessingForm from '@/components/admin/resource-processing/ResourceProcessingForm';
import { useUser } from '@clerk/nextjs';
import { useAuthHeaders } from '@/utils/auth-helpers';

const ResourceProcessor = () => {
  const { user } = useUser();
  const [currentResource, setCurrentResource] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ processed: 0, total: 0, remaining: 0, skipped: 0 });
  const [successMessage, setSuccessMessage] = useState('');
  const [typeCounts, setTypeCounts] = useState([]);
  const { getHeaders: getAuthHeadersFunction } = useAuthHeaders();

  // Fetch the next unprocessed resource
  const fetchNextResource = useCallback(async (type = selectedType, currentResourceId = null) => { 
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage('');
      
      const headers = await getAuthHeadersFunction();
      if (!headers) {
        setError('Authentication failed.');
        setLoading(false);
        return;
      }
      
      let url = type 
        ? `/api/admin/process/next-unprocessed?type=${type}` 
        : `/api/admin/process/next-unprocessed`;
      
      // Add currentResourceId if provided to fetch the *next* one
      if (currentResourceId) {
        url += `&currentResourceId=${currentResourceId}`;
      }
      
      const response = await fetch(url, { headers });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch next resource');
      }
      
      setProgress(data.progress);
      setTypeCounts(data.typeCounts || []);
      
      if (data.allProcessed) {
        setCurrentResource(null);
        setError(type 
          ? `All ${type} resources have been processed!` 
          : 'All resources have been processed!');
      } else if (data.resource) {
        setCurrentResource(data.resource);
      } else {
        setCurrentResource(null);
        setError('No resources found to process');
      }
    } catch (err) {
      console.error('Error fetching next resource:', err);
      setError(err.message || 'Failed to fetch next resource');
    } finally {
      setLoading(false);
    }
  }, [selectedType, user]);

  // Fetch processing progress and type counts
  const fetchProgress = useCallback(async () => {
    if (!user) return;
    try {
      const headers = await getAuthHeadersFunction();
      if (!headers) {
        setProgressError('Authentication failed.');
        setProgressLoading(false);
        return;
      }
      
      const response = await fetch(`/api/admin/process/progress`, { headers });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch progress');
      }
      
      setProgress(data.progress);
      setTypeCounts(data.typeCounts || []);
    } catch (err) {
      console.error('Error fetching progress:', err);
      // Don't set error state here to avoid disrupting the main flow
    }
  }, [user]);

  // Handle resource type change
  const handleTypeChange = (type) => {
    setSelectedType(type);
    fetchNextResource(type);
  };

  // Handle successful processing
  const handleProcessingSuccess = (message) => {
    setSuccessMessage(message);
    
    // Wait a moment before fetching the next resource
    setTimeout(() => {
      const processedResourceId = currentResource?._id;
      
      if (processedResourceId) {
        fetchNextResource(selectedType, processedResourceId);
      } else {
        // Fallback if ID was somehow lost
        fetchNextResource(selectedType);
      }
    }, 1500);
  };

  // Handle clicking the "Next" button in the form
  const handleNext = () => {
    // Fetch the next resource *after* the current one
    if (currentResource?._id) {
        fetchNextResource(selectedType, currentResource._id);
    } else {
        // If there's no current resource (e.g., at the end), fetch the first one again?
        // Or maybe disable the button? For now, fetch first.
        fetchNextResource(selectedType);
    }
  };

  // Format resource type for display
  const formatResourceType = (type) => {
    switch (type) {
      case 'book':
        return 'Book';
      case 'videoChannel':
        return 'Video Channel';
      case 'podcast':
        return 'Podcast';
      case 'website':
        return 'Website';
      case 'blog':
        return 'Blog';
      case 'practice':
        return 'Practice';
      case 'retreatCenter':
        return 'Retreat Center';
      case 'app':
        return 'App';
      default:
        return type ? type.charAt(0).toUpperCase() + type.slice(1) : 'All';
    }
  };

  // Load first resource and progress on component mount
  useEffect(() => {
    if (user) {
      fetchProgress();
      fetchNextResource();
    }
  }, [user]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <Head>
        <title>New Resource Processing | Insight Directory Admin</title>
        <meta name="description" content="Admin tool for processing new resources" />
      </Head>

      <h1 className="text-3xl font-semibold mb-6 text-center">New Resource Processing</h1>
      
      {/* Resource Type Selector */}
      <ResourceTypeSelector 
        selectedType={selectedType}
        typeCounts={typeCounts}
        onTypeChange={handleTypeChange}
        formatResourceType={formatResourceType}
      />
      
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress: {progress.processed} of {progress.total} resources processed</span>
          <span>
            {progress.remaining} unprocessed, {progress.skipped || 0} skipped
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progress.total > 0 ? (progress.processed / progress.total) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading next resource...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          {error.includes('have been processed') && (
            <div className="mt-4">
              <p className="text-green-600 font-medium mb-4">All resources of this type have been processed!</p>
              <Link 
                href="/admin" 
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-200"
              >
                Return to Admin Dashboard
              </Link>
            </div>
          )}
        </div>
      ) : currentResource ? (
        <div>
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}
          
          <ResourceProcessingForm
            resource={currentResource}
            onSuccess={handleProcessingSuccess}
            onNext={handleNext}
            onSkip={(progressData, typeCountsData, nextResource) => {
              // Update progress and typeCounts with the data from the API
              if (progressData) setProgress(progressData);
              if (typeCountsData) setTypeCounts(typeCountsData);
              
              setSuccessMessage('Resource skipped successfully');
              
              // Wait a moment before setting the next resource
              setTimeout(() => {
                if (nextResource) {
                  setCurrentResource(nextResource);
                  setError(null);
                } else {
                  // If no next resource, fetch the next resource normally
                  fetchNextResource();
                }
              }, 1500);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

// Wrap with AdminLayout
const ProtectedResourceProcessor = () => (
  <AdminLayout>
    <ResourceProcessor />
  </AdminLayout>
);

export default ProtectedResourceProcessor;
