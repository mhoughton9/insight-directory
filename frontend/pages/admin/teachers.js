import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

/**
 * Teacher Management Page
 * 
 * Displays a table of teachers with filtering options
 */
const TeacherManagementPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Fetch teachers on component mount
  useEffect(() => {
    const fetchTeachers = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Build query string with clerk ID for authentication
        let queryParams = new URLSearchParams();
        queryParams.append('clerkId', user.id);
        
        const response = await fetch(`/api/admin/teachers?${queryParams.toString()}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch teachers');
        }
        
        setTeachers(data.teachers || []);
      } catch (err) {
        console.error('Error fetching teachers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeachers();
  }, [user]);
  
  // Handle teacher deletion
  const handleDeleteTeacher = async (teacherId) => {
    if (!confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Include clerk ID for authentication
      let queryParams = new URLSearchParams();
      queryParams.append('clerkId', user.id);
      
      const response = await fetch(`/api/admin/teachers/${teacherId}?${queryParams.toString()}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete teacher');
      }
      
      // Remove the deleted teacher from the state
      setTeachers(teachers.filter(teacher => teacher._id !== teacherId));
    } catch (err) {
      console.error('Error deleting teacher:', err);
      alert(`Error: ${err.message}`);
    }
  };
  
  // Filter teachers based on search term and status
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'all' || 
     (statusFilter === 'posted' && teacher.processed) ||
     (statusFilter === 'pending' && !teacher.processed))
  );
  
  return (
    <AdminLayout>
      <Head>
        <title>Teacher Management | Insight Directory</title>
        <meta name="description" content="Manage teachers for Insight Directory" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Teacher Management</h1>
          <Link 
            href="/admin/add-teacher"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm"
          >
            Add New Teacher
          </Link>
        </div>
        
        {/* Search and filter */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search teachers..."
              className="w-full p-3 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="posted">Posted</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
        
        {/* Teachers table */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No teachers match your search.' : 'No teachers found. Add your first teacher!'}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Traditions
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Years
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {teacher.imageUrl ? (
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={teacher.imageUrl} 
                              alt={teacher.name} 
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                            <div className="hidden h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0 items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 dark:text-neutral-500">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-shrink-0 h-10 w-10 mr-3 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center">
                            <span className="text-neutral-500 dark:text-neutral-400 text-sm">{teacher.name.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                          <div className="text-sm text-gray-500">{teacher.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {teacher.traditions?.length > 0 
                          ? teacher.traditions.map(t => t.name || t).join(', ')
                          : <span className="text-gray-400 italic">None</span>
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {teacher.country || <span className="text-gray-400 italic">Unknown</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {teacher.birthYear ? (
                          teacher.deathYear ? 
                            `${teacher.birthYear}–${teacher.deathYear}` : 
                            `${teacher.birthYear}–present`
                        ) : (
                          <span className="text-gray-400 italic">Unknown</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex px-2 py-1 text-sm rounded-full ${teacher.processed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {teacher.processed ? 'Posted' : 'Pending'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/admin/edit-teacher/${teacher._id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteTeacher(teacher._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TeacherManagementPage;
