import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

/**
 * Admin Dashboard Component
 * 
 * Displays resource metrics and provides quick access to admin functions
 */
const Dashboard = () => {
  const { user } = useUser();
  const [resourceStats, setResourceStats] = useState(null);
  const [suggestionStats, setSuggestionStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch resource statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch resource statistics from the API
        const response = await fetch(`/api/admin/resources/stats?clerkId=${user.id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch resource statistics');
        }
        
        setResourceStats(data.stats);

        // Fetch suggestion statistics
        const suggestionResponse = await fetch(`/api/admin/suggestions/stats?clerkId=${user.id}`);
        const suggestionData = await suggestionResponse.json();
        
        if (!suggestionResponse.ok) {
          throw new Error(suggestionData.message || 'Failed to fetch suggestion statistics');
        }
        
        setSuggestionStats(suggestionData.data);
      } catch (err) {
        console.error('Error fetching statistics:', err);
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
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Add New Resource
        </Link>
      </div>

      {/* Resource Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-medium mb-4">Resource Statistics</h2>
        
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 py-4">{error}</div>
        ) : resourceStats ? (
          <div className="space-y-6">
            {/* Status Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="text-sm text-gray-500 mb-1">Total Resources</div>
                <div className="text-2xl font-semibold">{resourceStats.total || 0}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-md">
                <div className="text-sm text-gray-500 mb-1">Published</div>
                <div className="text-2xl font-semibold">{resourceStats.published || 0}</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-md">
                <div className="text-sm text-gray-500 mb-1">Pending</div>
                <div className="text-2xl font-semibold">{resourceStats.pending || 0}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-md">
                <div className="text-sm text-gray-500 mb-1">Resource Types</div>
                <div className="text-2xl font-semibold">{resourceStats.typeCount || 0}</div>
              </div>
            </div>
            
            {/* Type Breakdown */}
            {resourceStats.byType && resourceStats.byType.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Resources by Type</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {resourceStats.byType.map((item) => (
                    <div key={item.type} className="bg-gray-50 p-4 rounded-md">
                      <div className="text-sm text-gray-500 mb-1">{item.type}</div>
                      <div className="text-xl font-medium">{item.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 py-4">No resource statistics available</div>
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
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-blue-800">
                  You have {suggestionStats.new} new suggestion{suggestionStats.new !== 1 ? 's' : ''} to review
                </span>
              </div>
              <Link 
                href="/admin/suggestions?status=new" 
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
              >
                Review Now
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link 
            href="/admin/resources" 
            className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <h3 className="font-medium mb-1">Manage Resources</h3>
            <p className="text-sm text-gray-600">View, edit, and delete resources</p>
          </Link>
          
          <Link 
            href="/admin/bulk-import" 
            className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <h3 className="font-medium mb-1">Bulk Import</h3>
            <p className="text-sm text-gray-600">Import multiple resources at once</p>
          </Link>
          
          <Link 
            href="/admin/suggestions" 
            className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <h3 className="font-medium mb-1">User Suggestions</h3>
            <p className="text-sm text-gray-600">Review and process user suggestions</p>
            {suggestionStats && suggestionStats.new > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                {suggestionStats.new} new
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
