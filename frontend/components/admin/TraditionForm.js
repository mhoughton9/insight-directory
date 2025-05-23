import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { TRADITION_SECTIONS, DEFAULT_TRADITION_FORM_DATA, prepareTraditionForForm, validateTraditionForm, getTraditionImageContainerStyles } from '../../utils/tradition-utils';
import { fetchWithAuth, createApiUrl } from '@/utils/api-auth';

/**
 * Tradition Form Component
 * 
 * A form for creating and editing traditions
 * Supports collapsible sections and relationship fields
 */
const TraditionForm = ({ tradition = null, onSave, onCancel }) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState(null);
  
  // Initialize form data from tradition or with defaults
  const [formData, setFormData] = useState({
    ...DEFAULT_TRADITION_FORM_DATA,
    descriptionFull: undefined,
  });
  
  // Track which sections are expanded/collapsed
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    media: true,
    relationships: false,
    descriptionSections: false
  });
  
  // Determine if we should show description sections (only if tradition exists)
  const showDescriptionSections = !!tradition?._id;

  useEffect(() => {
    if (tradition) {
      setFormData(prepareTraditionForForm(tradition));
    }
  }, [tradition]);

  useEffect(() => {
    const slug = formData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setFormData({
      ...formData,
      slug
    });
  }, [formData.name]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle array field changes (keyTeachings, etc.)
  const handleArrayChange = (field, values) => {
    setFormData({
      ...formData,
      [field]: values
    });
  };

  // Handle links array changes
  const handleLinksChange = (links) => {
    setFormData({
      ...formData,
      links
    });
  };

  // Handle description section changes
  const handleDescriptionSectionChange = (sectionKey, content) => {
    setFormData({
      ...formData,
      descriptionSections: {
        ...formData.descriptionSections,
        [sectionKey]: content
      }
    });
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateTraditionForm(formData);
    
    if (!validation.isValid) {
      setError('Please fix the form errors before submitting');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Pass form data to parent component for saving
      await onSave(formData);
    } catch (err) {
      console.error('Error saving tradition:', err);
      setError(err.message || 'Error saving tradition');
    } finally {
      setLoading(false);
    }
  };

  // Generate content with AI
  const generateWithAI = async () => {
    if (!getToken) {
      setAiError('Authentication required.');
      return;
    }
    try {
      // Clear any previous errors
      setAiError(null);
      setAiGenerating(true);
      
      // Make sure we have a tradition ID
      if (!tradition?._id) {
        throw new Error('Tradition must be saved before generating descriptions');
      }
      
      // Get the section keys to generate
      const sectionKeys = TRADITION_SECTIONS.map(section => section.key);

      // Construct the API URL
      const apiUrl = createApiUrl(`/admin/traditions/${tradition._id}/generate-descriptions`);

      // Call the API using fetchWithAuth
      const response = await fetchWithAuth(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sectionKeys }),
      }, getToken);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate descriptions');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to generate descriptions');
      }
      
      // Update the form with the generated sections
      setFormData(prevData => ({
        ...prevData,
        descriptionSections: {
          ...prevData.descriptionSections,
          ...data.generatedSections
        }
      }));
      
      // Expand the description sections to show the generated content
      setExpandedSections(prev => ({
        ...prev,
        descriptionSections: true
      }));
      
    } catch (err) {
      console.error('Error generating descriptions:', err);
      setAiError(err.message || 'Failed to generate descriptions');
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {/* Basic Information Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div 
          className="px-4 py-5 border-b border-gray-200 sm:px-6 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection('basicInfo')}
        >
          <h3 className="text-lg leading-6 font-medium text-gray-900">Basic Information</h3>
          <span>
            {expandedSections.basicInfo ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </span>
        </div>
        
        {expandedSections.basicInfo && (
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="col-span-1 sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Tradition name"
                />
              </div>
              
              <div className="col-span-1 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Short Description</label>
                  <button
                    type="button"
                    onClick={() => generateWithAI('description')}
                    disabled={aiGenerating || !formData.name}
                    className="text-xs text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                  >
                    {aiGenerating ? 'Generating...' : 'Generate with AI'}
                  </button>
                </div>
                <textarea
                  name="description"
                  id="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Brief description of the tradition"
                />
              </div>
              
              <div>
                <label htmlFor="origin" className="block text-sm font-medium text-gray-700">Origin</label>
                <input
                  type="text"
                  name="origin"
                  id="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Geographic origin"
                />
              </div>
              
              <div>
                <label htmlFor="foundingPeriod" className="block text-sm font-medium text-gray-700">Founding Period</label>
                <input
                  type="text"
                  name="foundingPeriod"
                  id="foundingPeriod"
                  value={formData.foundingPeriod}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g. 6th century BCE"
                />
              </div>
              
              <div className="col-span-1 sm:col-span-2">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="processed"
                  id="status"
                  value={formData.processed}
                  onChange={(e) => handleInputChange({
                    target: {
                      name: 'processed',
                      value: e.target.value === 'true'
                    }
                  })}
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="false">Pending</option>
                  <option value="true">Posted</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">Only "Posted" traditions will appear on the public site</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Media Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div 
          className="px-4 py-5 border-b border-gray-200 sm:px-6 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection('media')}
        >
          <h3 className="text-lg leading-6 font-medium text-gray-900">Media</h3>
          <span>
            {expandedSections.media ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </span>
        </div>
        
        {expandedSections.media && (
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="col-span-1">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">Enter a URL for the tradition image</p>
              </div>
              
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Image Preview</label>
                <div className="mt-1 relative" style={{ width: '150px', height: '150px' }}>
                  <div 
                    className="absolute inset-0 rounded-md border-2 border-dashed border-gray-300 flex justify-center items-center overflow-hidden"
                    style={{ 
                      backgroundImage: formData.imageUrl ? `url(${formData.imageUrl})` : 'none', 
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center'
                    }}
                  >
                    {!formData.imageUrl && (
                      <span className="text-gray-500 text-sm">No image URL provided</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Links</label>
                {formData.links.map((link, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => {
                        const updatedLinks = [...formData.links];
                        updatedLinks[index].label = e.target.value;
                        handleLinksChange(updatedLinks);
                      }}
                      className="block w-1/3 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Label"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => {
                        const updatedLinks = [...formData.links];
                        updatedLinks[index].url = e.target.value;
                        handleLinksChange(updatedLinks);
                      }}
                      className="block w-2/3 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="URL"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedLinks = [...formData.links];
                        updatedLinks.splice(index, 1);
                        handleLinksChange(updatedLinks);
                      }}
                      className="p-2 text-red-600 hover:text-red-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleLinksChange([...formData.links, { label: '', url: '' }])}
                  className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Description Sections */}
      {showDescriptionSections && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div 
            className="px-4 py-5 border-b border-gray-200 sm:px-6 cursor-pointer flex justify-between items-center"
            onClick={() => toggleSection('descriptionSections')}
          >
            <h3 className="text-lg leading-6 font-medium text-gray-900">Description Sections</h3>
            <span>
              {expandedSections.descriptionSections ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </span>
          </div>
          
          {expandedSections.descriptionSections && (
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  These detailed sections will be displayed on the tradition detail page.
                </p>
                <button
                  type="button"
                  onClick={generateWithAI}
                  disabled={aiGenerating || !formData.name || !tradition?._id}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {aiGenerating ? 'Generating...' : 'Generate with AI'}
                </button>
              </div>
              
              {TRADITION_SECTIONS.map((section) => (
                <div key={section.key} className="mb-6">
                  <div className="flex items-center justify-between">
                    <label htmlFor={`section-${section.key}`} className="block text-sm font-medium text-gray-700">
                      {section.label}
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{section.description}</p>
                  <textarea
                    id={`section-${section.key}`}
                    name={`descriptionSections.${section.key}`}
                    rows="4"
                    value={formData.descriptionSections[section.key] || ''}
                    onChange={(e) => handleDescriptionSectionChange(section.key, e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder={`Enter ${section.label.toLowerCase()} information`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default TraditionForm;
