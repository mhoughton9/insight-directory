import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

/**
 * Tradition Management Page
 * 
 * Displays a table of traditions with filtering options
 */
const TraditionManagementPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [traditions, setTraditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Fetch traditions on component mount
  useEffect(() => {
    const fetchTraditions = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Build query string with clerk ID for authentication
        let queryParams = new URLSearchParams();
        queryParams.append('clerkId', user.id);
        
        const response = await fetch(`/api/admin/traditions?${queryParams.toString()}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch traditions');
        }
        
        setTraditions(data.traditions || []);
      } catch (err) {
        console.error('Error fetching traditions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTraditions();
  }, [user]);

  // Handle tradition deletion
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this tradition? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Build query string with clerk ID for authentication
      let queryParams = new URLSearchParams();
      queryParams.append('clerkId', user.id);
      
      const response = await fetch(`/api/admin/traditions/${id}?${queryParams.toString()}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete tradition');
      }
      
      // Remove deleted tradition from state
      setTraditions(traditions.filter(tradition => tradition._id !== id));
    } catch (err) {
      console.error('Error deleting tradition:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // Filter traditions based on search term and status
  const filteredTraditions = traditions.filter(tradition => {
    // Filter by search term
    const matchesSearch = 
      tradition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tradition.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tradition.origin && tradition.origin.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by status
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'posted' && tradition.processed) ||
      (statusFilter === 'pending' && !tradition.processed);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <Head>
        <title>Manage Traditions | Awakening Resources Directory</title>
      </Head>
      
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Traditions</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage spiritual traditions in the directory
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href="/admin/add-tradition"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add New Tradition
            </Link>
          </div>
        </div>
        
        {/* Filters */}
        <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Search</label>
            <input
              type="text"
              id="search"
              placeholder="Search traditions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          
          <div className="w-full sm:w-48">
            <label htmlFor="status-filter" className="sr-only">Status</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="posted">Posted</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
        
        {/* Traditions Table */}
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                {loading ? (
                  <div className="p-6 text-center">Loading traditions...</div>
                ) : error ? (
                  <div className="p-6 text-center text-red-500">{error}</div>
                ) : filteredTraditions.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    {searchTerm || statusFilter !== 'all' ? 
                      'No traditions match your filters' : 
                      'No traditions found. Add your first tradition!'}
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Origin</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Founding Period</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredTraditions.map((tradition) => (
                        <tr key={tradition._id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {tradition.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {tradition.origin || '-'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {tradition.foundingPeriod || '-'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tradition.processed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {tradition.processed ? 'Posted' : 'Pending'}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end space-x-3">
                              <Link
                                href={`/admin/edit-tradition/${tradition._id}`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(tradition._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TraditionManagementPage;
