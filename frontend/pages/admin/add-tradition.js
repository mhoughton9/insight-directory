import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import TraditionForm from '@/components/admin/TraditionForm';

/**
 * Add Tradition Page
 * 
 * Page for creating a new tradition
 */
const AddTraditionPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Handle form submission
  const handleSave = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Ensure slug is generated from name if not present
      if (!formData.slug && formData.name) {
        formData.slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      }
      
      // Build query string with clerk ID for authentication
      let queryParams = new URLSearchParams();
      queryParams.append('clerkId', user.id);
      
      // Send request to create tradition
      const response = await fetch(`/api/admin/traditions?${queryParams.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create tradition');
      }
      
      // Redirect to traditions management page
      router.push('/admin/traditions');
    } catch (err) {
      console.error('Error creating tradition:', err);
      setError(err.message);
      throw err; // Re-throw to let the form component handle the error
    } finally {
      setLoading(false);
    }
  };
  
  // Handle cancellation
  const handleCancel = () => {
    router.push('/admin/traditions');
  };
  
  return (
    <AdminLayout>
      <Head>
        <title>Add Tradition | Awakening Resources Directory</title>
      </Head>
      
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Add Tradition</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create a new spiritual tradition in the directory
          </p>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <TraditionForm
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </AdminLayout>
  );
};

export default AddTraditionPage;
