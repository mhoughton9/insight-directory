import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProtected from '@/components/admin/AdminProtected';
import ResourceForm from '@/components/admin/ResourceForm';

/**
 * Add Resource Page
 * 
 * Allows administrators to create new resources of any type
 */
const AddResourcePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form submission
  const handleSaveResource = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Log the form data being sent
      console.log('Submitting resource data:', formData);
      
      // Send the data to the API
      const response = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.message || 'Failed to create resource');
      }
      
      // Redirect to the resources page on success
      router.push('/admin/resources');
    } catch (err) {
      console.error('Error creating resource:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminProtected>
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Add New Resource</h1>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <ResourceForm 
              onSave={handleSaveResource} 
              onCancel={() => router.push('/admin/resources')}
            />
          </div>
        </div>
      </AdminLayout>
    </AdminProtected>
  );
};

export default AddResourcePage;
