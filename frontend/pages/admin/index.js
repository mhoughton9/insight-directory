import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminDashboard = () => {
  const [resourceProgress, setResourceProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch progress data
  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/process/progress');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch progress data');
      }
      
      setResourceProgress(data.progress);
    } catch (err) {
      console.error('Error fetching progress:', err);
      setError(err.message || 'Failed to fetch progress data');
    } finally {
      setLoading(false);
    }
  };

  // Load progress on component mount
  useEffect(() => {
    fetchProgress();
  }, []);

  return (
    <AdminLayout>
      <Head>
        <title>Admin Dashboard | Insight Directory</title>
        <meta name="description" content="Admin dashboard for Insight Directory" />
      </Head>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-semibold mb-6 text-center">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-medium mb-4">New Resource Processing</h2>
            <p className="text-gray-600 mb-4">
              Process new resources of all types (books, videos, podcasts, etc.) before they appear on the public site.
            </p>
            
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 mb-4">{error}</div>
            ) : resourceProgress ? (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress: {resourceProgress.processed} of {resourceProgress.total} resources processed</span>
                  <span>
                    {resourceProgress.remaining} unprocessed, {resourceProgress.skipped || 0} skipped
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${resourceProgress.total > 0 ? (resourceProgress.processed / resourceProgress.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ) : null}
            
            <Link 
              href="/admin/resource-processor" 
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-200"
            >
              Go to Resource Processor
            </Link>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-medium mb-4">Resource Management</h2>
            <p className="text-gray-600 mb-4">
              View and edit all resources in the directory. Filter by resource type and make changes to any field.
            </p>
            <Link 
              href="/admin/resources" 
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition duration-200"
            >
              Manage Resources
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-medium mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link 
              href="/" 
              className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              <h3 className="font-medium mb-1">View Website</h3>
              <p className="text-sm text-gray-600">Go to the public-facing website</p>
            </Link>
            
            <Link 
              href="/admin/resource-processor" 
              className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              <h3 className="font-medium mb-1">Resource Processor</h3>
              <p className="text-sm text-gray-600">Process new resources</p>
            </Link>
            
            <Link 
              href="/admin/resources" 
              className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              <h3 className="font-medium mb-1">Resource Management</h3>
              <p className="text-sm text-gray-600">Edit existing resources</p>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
