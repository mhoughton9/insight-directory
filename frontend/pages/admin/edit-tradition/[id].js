import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import TraditionForm from '@/components/admin/TraditionForm';

/**
 * Edit Tradition Page
 * 
 * Page for editing an existing tradition
 */
const EditTraditionPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();
  const [tradition, setTradition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch tradition data on component mount
  useEffect(() => {
    const fetchTradition = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        
        // Build query string with clerk ID for authentication
        let queryParams = new URLSearchParams();
        queryParams.append('clerkId', user.id);
        
        const response = await fetch(`/api/admin/traditions/${id}?${queryParams.toString()}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch tradition');
        }
        
        setTradition(data.tradition);
      } catch (err) {
        console.error('Error fetching tradition:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTradition();
  }, [id, user]);
  
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
      
      // Send request to update tradition
      const response = await fetch(`/api/admin/traditions/${id}?${queryParams.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update tradition');
      }
      
      // Redirect to traditions management page
      router.push('/admin/traditions');
    } catch (err) {
      console.error('Error updating tradition:', err);
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
        <title>Edit Tradition | Awakening Resources Directory</title>
      </Head>
      
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Tradition</h1>
          <p className="mt-2 text-sm text-gray-700">
            Update an existing spiritual tradition in the directory
          </p>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading tradition data...</p>
          </div>
        ) : !tradition ? (
          <div className="text-center py-12">
            <p className="text-red-500">Tradition not found</p>
          </div>
        ) : (
          <TraditionForm
            tradition={tradition}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default EditTraditionPage;
