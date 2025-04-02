import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProtected from '@/components/admin/AdminProtected';
import TeacherForm from '@/components/admin/TeacherForm';

/**
 * Add Teacher Page
 * 
 * Allows administrators to create new teachers
 */
const AddTeacherPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form submission
  const handleSaveTeacher = async (formData) => {
    if (!user) {
      setError('Authentication required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Log the form data being sent
      console.log('Submitting teacher data:', formData);
      
      // Build query string with clerk ID for authentication
      let queryParams = new URLSearchParams();
      queryParams.append('clerkId', user.id);
      
      // Send the data to the API
      const response = await fetch(`/api/admin/teachers?${queryParams.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.message || 'Failed to create teacher');
      }
      
      // Redirect to the teachers page on success
      router.push('/admin/teachers');
    } catch (err) {
      console.error('Error creating teacher:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminProtected>
      <AdminLayout>
        <Head>
          <title>Add Teacher | Insight Directory</title>
          <meta name="description" content="Add a new teacher to Insight Directory" />
        </Head>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Add New Teacher</h1>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <TeacherForm 
              onSave={handleSaveTeacher} 
              onCancel={() => router.push('/admin/teachers')}
            />
          </div>
        </div>
      </AdminLayout>
    </AdminProtected>
  );
};

export default AddTeacherPage;
