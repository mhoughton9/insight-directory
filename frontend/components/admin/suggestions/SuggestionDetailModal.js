import { useState } from 'react';

/**
 * Suggestion Detail Modal Component
 * 
 * Displays detailed information about a user-submitted resource suggestion
 * and provides controls to update its status or delete it
 */
const SuggestionDetailModal = ({ isOpen, onClose, suggestion, onUpdateStatus, onDelete }) => {
  const [status, setStatus] = useState(suggestion?.status || 'new');
  const [adminNotes, setAdminNotes] = useState(suggestion?.adminNotes || '');
  
  if (!isOpen || !suggestion) return null;
  
  // Format resource type for display
  const formatResourceType = (type) => {
    switch (type) {
      case 'book':
        return 'Book';
      case 'videoChannel':
        return 'Video Channel';
      case 'podcast':
        return 'Podcast';
      case 'website':
        return 'Website';
      case 'blog':
        return 'Blog';
      case 'practice':
        return 'Practice';
      case 'app':
        return 'App';
      case 'retreatCenter':
        return 'Retreat Center';
      case 'teacher':
        return 'Teacher';
      case 'tradition':
        return 'Tradition';
      default:
        return type;
    }
  };
  
  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateStatus(suggestion._id, status, adminNotes);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">Resource Suggestion Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-10rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Suggestion Details */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Resource Title</h4>
                <p className="text-base">{suggestion.title}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Resource Type</h4>
                <p className="text-base">{formatResourceType(suggestion.type)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                <p className="text-base whitespace-pre-line">{suggestion.description}</p>
              </div>
              
              {suggestion.link && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Link</h4>
                  <a 
                    href={suggestion.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {suggestion.link}
                  </a>
                </div>
              )}
              
              {suggestion.creator && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Creator/Author</h4>
                  <p className="text-base">{suggestion.creator}</p>
                </div>
              )}
              
              {suggestion.additionalInfo && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Additional Information</h4>
                  <p className="text-base whitespace-pre-line">{suggestion.additionalInfo}</p>
                </div>
              )}
            </div>
            
            {/* Submitter Details and Admin Controls */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Submission Details</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-xs font-medium text-gray-500 mb-1">Submitted By</h5>
                    <p className="text-sm">{suggestion.submitterName || 'Anonymous'}</p>
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-medium text-gray-500 mb-1">Submitter Email</h5>
                    <p className="text-sm">{suggestion.submitterEmail || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-medium text-gray-500 mb-1">Submission Date</h5>
                    <p className="text-sm">{formatDate(suggestion.createdAt)}</p>
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-medium text-gray-500 mb-1">Current Status</h5>
                    <p className="text-sm capitalize">{suggestion.status}</p>
                  </div>
                  
                  {suggestion.reviewedAt && (
                    <div>
                      <h5 className="text-xs font-medium text-gray-500 mb-1">Last Reviewed</h5>
                      <p className="text-sm">{formatDate(suggestion.reviewedAt)}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Admin Actions Form */}
              <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Admin Actions</h4>
                
                <div className="mb-4">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Update Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Notes
                  </label>
                  <textarea
                    id="adminNotes"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add notes about this suggestion (only visible to admins)"
                  ></textarea>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => onDelete(suggestion._id)}
                    className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-md transition-colors"
                  >
                    Delete Suggestion
                  </button>
                  
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors"
                  >
                    Update Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionDetailModal;
