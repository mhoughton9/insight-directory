import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

/**
 * Admin Dashboard Component
 * 
 * Displays resource, teacher, and tradition metrics and provides quick access to admin functions
 */
const Dashboard = () => {
  const { user } = useUser();
  const [resourceStats, setResourceStats] = useState(null);
  const [teacherStats, setTeacherStats] = useState(null);
  const [traditionStats, setTraditionStats] = useState(null);
  const [suggestionStats, setSuggestionStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch resource statistics from the API
        try {
          const resourceResponse = await fetch(`/api/admin/resources/stats?clerkId=${user.id}`);
          const resourceData = await resourceResponse.json();
          
          if (!resourceResponse.ok) {
            console.error('Error fetching resource statistics:', resourceData.message);
          } else {
            setResourceStats(resourceData.stats);
          }
        } catch (err) {
          console.error('Error fetching resource statistics:', err);
        }

        // Fetch teacher statistics
        try {
          console.log('Fetching teacher statistics...');
          const teacherResponse = await fetch(`/api/admin/teachers/stats?clerkId=${user.id}`);
          const teacherData = await teacherResponse.json();
          
          console.log('Teacher stats response:', teacherData);
          
          if (!teacherResponse.ok) {
            console.error('Error fetching teacher statistics:', teacherData.message);
          } else if (teacherData.stats) {
            setTeacherStats(teacherData.stats);
          } else {
            console.error('Teacher stats missing in response:', teacherData);
            // Set default stats if missing
            setTeacherStats({ total: 0, published: 0, pending: 0 });
          }
        } catch (err) {
          console.error('Error fetching teacher statistics:', err);
          // Set default stats on error
          setTeacherStats({ total: 0, published: 0, pending: 0 });
        }

        // Fetch tradition statistics
        try {
          console.log('Fetching tradition statistics...');
          const traditionResponse = await fetch(`/api/admin/traditions/stats?clerkId=${user.id}`);
          const traditionData = await traditionResponse.json();
          
          console.log('Tradition stats response:', traditionData);
          
          if (!traditionResponse.ok) {
            console.error('Error fetching tradition statistics:', traditionData.message);
          } else if (traditionData.stats) {
            setTraditionStats(traditionData.stats);
          } else {
            console.error('Tradition stats missing in response:', traditionData);
            // Set default stats if missing
            setTraditionStats({ total: 0, published: 0, pending: 0 });
          }
        } catch (err) {
          console.error('Error fetching tradition statistics:', err);
          // Set default stats on error
          setTraditionStats({ total: 0, published: 0, pending: 0 });
        }

        // Fetch suggestion statistics
        try {
          const suggestionResponse = await fetch(`/api/admin/suggestions/stats?clerkId=${user.id}`);
          const suggestionData = await suggestionResponse.json();
          
          if (!suggestionResponse.ok) {
            console.error('Error fetching suggestion statistics:', suggestionData.message);
          } else {
            setSuggestionStats(suggestionData.data);
          }
        } catch (err) {
          console.error('Error fetching suggestion statistics:', err);
        }
      } catch (err) {
        console.error('Error in overall fetch operation:', err);
        setError(err.message || 'Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
        <Link 
          href="/admin/add-resource" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm"
        >
          Add New Resource
        </Link>
      </div>

      {/* Content Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-medium mb-6">Directory Content</h2>
        
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 py-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Resources Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Resources</h3>
              {resourceStats ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="text-sm text-gray-500 mb-1">Total</div>
                    <div className="text-2xl font-semibold">{resourceStats.total || 0}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-md">
                    <div className="text-sm text-gray-500 mb-1">Published</div>
                    <div className="text-2xl font-semibold">{resourceStats.published || 0}</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-md col-span-2">
                    <div className="text-sm text-gray-500 mb-1">Pending</div>
                    <div className="text-2xl font-semibold">{resourceStats.pending || 0}</div>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-gray-500 italic">Resource statistics unavailable</div>
              )}
              {resourceStats?.byType && resourceStats.byType.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">By Type</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {resourceStats.byType.slice(0, 4).map((item) => (
                      <div key={item.type} className="bg-gray-50 p-2 rounded-md">
                        <div className="text-xs text-gray-500 mb-1">{item.type}</div>
                        <div className="text-lg font-medium">{item.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Teachers Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Teachers</h3>
              {teacherStats ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="text-sm text-gray-500 mb-1">Total</div>
                    <div className="text-2xl font-semibold">{teacherStats.total || 0}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-md">
                    <div className="text-sm text-gray-500 mb-1">Published</div>
                    <div className="text-2xl font-semibold">{teacherStats.published || 0}</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-md col-span-2">
                    <div className="text-sm text-gray-500 mb-1">Pending</div>
                    <div className="text-2xl font-semibold">{teacherStats.pending || 0}</div>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-gray-500 italic">Teacher statistics unavailable</div>
              )}
            </div>
            
            {/* Traditions Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Traditions</h3>
              {traditionStats ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="text-sm text-gray-500 mb-1">Total</div>
                    <div className="text-2xl font-semibold">{traditionStats.total || 0}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-md">
                    <div className="text-sm text-gray-500 mb-1">Published</div>
                    <div className="text-2xl font-semibold">{traditionStats.published || 0}</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-md col-span-2">
                    <div className="text-sm text-gray-500 mb-1">Pending</div>
                    <div className="text-2xl font-semibold">{traditionStats.pending || 0}</div>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-gray-500 italic">Tradition statistics unavailable</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Suggestion Statistics */}
      {suggestionStats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-medium mb-4">User Suggestions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-sm text-gray-500 mb-1">Total</div>
              <div className="text-2xl font-semibold">{suggestionStats.total || 0}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="text-sm text-gray-500 mb-1">New</div>
              <div className="text-2xl font-semibold">{suggestionStats.new || 0}</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-md">
              <div className="text-sm text-gray-500 mb-1">Reviewed</div>
              <div className="text-2xl font-semibold">{suggestionStats.reviewed || 0}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <div className="text-sm text-gray-500 mb-1">Approved</div>
              <div className="text-2xl font-semibold">{suggestionStats.approved || 0}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-md">
              <div className="text-sm text-gray-500 mb-1">Rejected</div>
              <div className="text-2xl font-semibold">{suggestionStats.rejected || 0}</div>
            </div>
          </div>
          
          {/* New Suggestions Alert */}
          {suggestionStats.new > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>You have {suggestionStats.new} new user suggestion{suggestionStats.new !== 1 ? 's' : ''} to review.</span>
              </div>
              <Link href="/admin/suggestions" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Review now
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
