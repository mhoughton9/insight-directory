import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProtected from '@/components/admin/AdminProtected';
import TeacherForm from '@/components/admin/TeacherForm';

/**
 * Edit Teacher Page
 * 
 * Allows administrators to edit existing teachers
 */
const EditTeacherPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the teacher data
  useEffect(() => {
    const fetchTeacher = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Build query string with clerk ID for authentication
        let queryParams = new URLSearchParams();
        queryParams.append('clerkId', user.id);
        
        // Fetch the teacher data from the API
        const response = await fetch(`/api/admin/teachers/${id}?${queryParams.toString()}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch teacher');
        }
        
        setTeacher(data.teacher);
      } catch (err) {
        console.error('Error fetching teacher:', err);
        setError(err.message || 'Failed to fetch teacher');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeacher();
  }, [id, user]);

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
      console.log('Updating teacher data:', formData);
      
      // Build query string with clerk ID for authentication
      let queryParams = new URLSearchParams();
      queryParams.append('clerkId', user.id);
      
      // Send the data to the API
      const response = await fetch(`/api/admin/teachers/${id}?${queryParams.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.message || 'Failed to update teacher');
      }
      
      // Redirect to the teachers page on success
      router.push('/admin/teachers');
    } catch (err) {
      console.error('Error updating teacher:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    router.push('/admin/teachers');
  };

  return (
    <AdminProtected>
      <AdminLayout>
        <Head>
          <title>Edit Teacher | Insight Directory</title>
          <meta name="description" content="Edit teacher for Insight Directory" />
        </Head>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Edit Teacher</h1>
          </div>
          
          {loading && !teacher ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          ) : teacher ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <TeacherForm 
                teacher={teacher} 
                onSave={handleSaveTeacher} 
                onCancel={handleCancel}
              />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Teacher not found.
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminProtected>
  );
};

export default EditTeacherPage;
