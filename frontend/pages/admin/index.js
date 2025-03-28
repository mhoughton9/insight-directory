import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const AdminDashboard = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch progress data
  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/books/progress');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch progress data');
      }
      
      setProgress(data.progress);
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>Admin Dashboard | Insight Directory</title>
        <meta name="description" content="Admin dashboard for Insight Directory" />
      </Head>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-semibold mb-6 text-center">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-medium mb-4">Book Data Management</h2>
              <p className="text-gray-600 mb-4">
                Process Amazon book data including affiliate links, ISBNs, and cover images.
              </p>
              
              {loading ? (
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                  <span>Loading progress...</span>
                </div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : progress ? (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress: {progress.processed} of {progress.total} books</span>
                    <span>{progress.percentComplete}% complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${progress.percentComplete}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{progress.unprocessed} books remaining</p>
                </div>
              ) : null}
              
              <Link 
                href="/admin/book-manager"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-200"
              >
                Process Books
              </Link>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-medium mb-4">Admin Tools</h2>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link 
                    href="/"
                    className="text-blue-500 hover:text-blue-700 transition duration-200"
                  >
                    Return to Homepage
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/resources"
                    className="text-blue-500 hover:text-blue-700 transition duration-200"
                  >
                    View All Resources
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-medium text-yellow-800 mb-2">Note</h3>
            <p className="text-yellow-700 text-sm">
              This admin tool is for development use only and is not protected by authentication.
              Use it only in a secure environment.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
