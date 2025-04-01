import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProtected from '@/components/admin/AdminProtected';
import SuggestionsList from '@/components/admin/suggestions/SuggestionsList';
import SuggestionDetailModal from '@/components/admin/suggestions/SuggestionDetailModal';
import { useUser } from '@clerk/nextjs';

/**
 * Admin Suggestions Page
 * 
 * Displays a list of user-submitted resource suggestions with filtering and detail view
 */
const AdminSuggestionsPage = () => {
  const { user } = useUser();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    reviewed: 0,
    approved: 0,
    rejected: 0
  });

  // Fetch suggestions
  const fetchSuggestions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('clerkId', user.id);
      if (statusFilter !== 'all') {
        queryParams.append('status', statusFilter);
      }
      
      // Fetch suggestions from API
      const response = await fetch(`/api/admin/suggestions?${queryParams.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch suggestions');
      }
      
      setSuggestions(data.data);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError(err.message || 'Failed to fetch suggestions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch suggestion statistics
  const fetchStats = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/admin/suggestions/stats?clerkId=${user.id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch suggestion statistics');
      }
      
      setStats(data.data);
    } catch (err) {
      console.error('Error fetching suggestion statistics:', err);
    }
  };

  // Load suggestions and stats on initial render and when filter changes
  useEffect(() => {
    if (user) {
      fetchSuggestions();
      fetchStats();
    }
  }, [user, statusFilter]);

  // Handle suggestion click to open detail modal
  const handleSuggestionClick = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsDetailModalOpen(true);
  };

  // Handle closing the detail modal
  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedSuggestion(null);
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  // Handle suggestion status update
  const handleUpdateStatus = async (id, status, adminNotes) => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/admin/suggestions/${id}?clerkId=${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, adminNotes })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update suggestion');
      }
      
      // Refresh suggestions and stats
      fetchSuggestions();
      fetchStats();
      
      // Close the modal
      handleCloseModal();
    } catch (err) {
      console.error('Error updating suggestion:', err);
      alert(`Error: ${err.message || 'Failed to update suggestion'}`);
    }
  };

  // Handle suggestion deletion
  const handleDeleteSuggestion = async (id) => {
    if (!user || !confirm('Are you sure you want to delete this suggestion?')) return;
    
    try {
      const response = await fetch(`/api/admin/suggestions/${id}?clerkId=${user.id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete suggestion');
      }
      
      // Refresh suggestions and stats
      fetchSuggestions();
      fetchStats();
      
      // Close the modal if open
      handleCloseModal();
    } catch (err) {
      console.error('Error deleting suggestion:', err);
      alert(`Error: ${err.message || 'Failed to delete suggestion'}`);
    }
  };

  return (
    <AdminProtected>
      <AdminLayout>
        <Head>
          <title>User Suggestions | Insight Directory Admin</title>
          <meta name="description" content="Manage user-submitted resource suggestions" />
        </Head>
        
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">User Suggestions</h1>
          </div>
          
          {/* Statistics */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium mb-3">Suggestion Statistics</h2>
            <div className="grid grid-cols-5 gap-3">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-500 mb-1">Total</div>
                <div className="text-xl font-medium">{stats.total}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="text-sm text-gray-500 mb-1">New</div>
                <div className="text-xl font-medium">{stats.new}</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-md">
                <div className="text-sm text-gray-500 mb-1">Reviewed</div>
                <div className="text-xl font-medium">{stats.reviewed}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-md">
                <div className="text-sm text-gray-500 mb-1">Approved</div>
                <div className="text-xl font-medium">{stats.approved}</div>
              </div>
              <div className="bg-red-50 p-3 rounded-md">
                <div className="text-sm text-gray-500 mb-1">Rejected</div>
                <div className="text-xl font-medium">{stats.rejected}</div>
              </div>
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium mb-3">Filter by Status</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStatusFilterChange('all')}
                className={`px-4 py-2 rounded-md ${statusFilter === 'all' ? 'bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                All
              </button>
              <button
                onClick={() => handleStatusFilterChange('new')}
                className={`px-4 py-2 rounded-md ${statusFilter === 'new' ? 'bg-blue-600 text-white' : 'bg-blue-50 hover:bg-blue-100'}`}
              >
                New
              </button>
              <button
                onClick={() => handleStatusFilterChange('reviewed')}
                className={`px-4 py-2 rounded-md ${statusFilter === 'reviewed' ? 'bg-yellow-600 text-white' : 'bg-yellow-50 hover:bg-yellow-100'}`}
              >
                Reviewed
              </button>
              <button
                onClick={() => handleStatusFilterChange('approved')}
                className={`px-4 py-2 rounded-md ${statusFilter === 'approved' ? 'bg-green-600 text-white' : 'bg-green-50 hover:bg-green-100'}`}
              >
                Approved
              </button>
              <button
                onClick={() => handleStatusFilterChange('rejected')}
                className={`px-4 py-2 rounded-md ${statusFilter === 'rejected' ? 'bg-red-600 text-white' : 'bg-red-50 hover:bg-red-100'}`}
              >
                Rejected
              </button>
            </div>
          </div>
          
          {/* Suggestions List */}
          <SuggestionsList
            suggestions={suggestions}
            loading={loading}
            error={error}
            onSuggestionClick={handleSuggestionClick}
          />
          
          {/* Suggestion Detail Modal */}
          {selectedSuggestion && (
            <SuggestionDetailModal
              isOpen={isDetailModalOpen}
              onClose={handleCloseModal}
              suggestion={selectedSuggestion}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDeleteSuggestion}
            />
          )}
        </div>
      </AdminLayout>
    </AdminProtected>
  );
};

export default AdminSuggestionsPage;
