import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProtected from '@/components/admin/AdminProtected';
import ResourceForm from '@/components/admin/ResourceForm';

/**
 * Edit Resource Page
 * 
 * Allows administrators to edit existing resources
 */
const EditResourcePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the resource data
  useEffect(() => {
    const fetchResource = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the resource data from the API
        const response = await fetch(`/api/admin/resources/${id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch resource');
        }
        
        setResource(data.resource);
      } catch (err) {
        console.error('Error fetching resource:', err);
        setError(err.message || 'Failed to fetch resource');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResource();
  }, [id]);

  // Handle form submission
  const handleSaveResource = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Log the form data being sent
      console.log('Updating resource data:', formData);
      
      // Send the data to the API
      const response = await fetch(`/api/admin/resources/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.message || 'Failed to update resource');
      }
      
      // Redirect to the resources page on success
      router.push('/admin/resources');
    } catch (err) {
      console.error('Error updating resource:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    router.push('/admin/resources');
  };

  return (
    <AdminProtected>
      <AdminLayout>
        <Head>
          <title>Edit Resource | Insight Directory</title>
          <meta name="description" content="Edit resource for Insight Directory" />
        </Head>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Edit Resource</h1>
          </div>
          
          {loading && !resource ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          ) : resource ? (
            <ResourceForm 
              resource={resource} 
              onSave={handleSaveResource} 
              onCancel={handleCancel}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              Resource not found.
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminProtected>
  );
};

export default EditResourcePage;
