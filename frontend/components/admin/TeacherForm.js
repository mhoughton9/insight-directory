import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { TEACHER_SECTIONS, DEFAULT_TEACHER_FORM_DATA, prepareTeacherForForm, validateTeacherForm, getTeacherImageContainerStyles } from '../../utils/teacher-utils';
import { fetchWithAuth, createApiUrl } from '@/utils/api-auth';

/**
 * Teacher Form Component
 * 
 * A form for creating and editing teachers
 * Supports collapsible sections and relationship fields
 */
const TeacherForm = ({ teacher = null, onSave, onCancel }) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState(null);
  
  // Initialize form data from teacher or with defaults
  const [formData, setFormData] = useState({
    ...DEFAULT_TEACHER_FORM_DATA,
    biographyFull: undefined,
  });
  
  // Track which sections are expanded/collapsed
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    media: true,
    relationships: false,
    descriptionSections: false
  });
  
  // Determine if we should show description sections (only if teacher exists)
  const showDescriptionSections = !!teacher?._id;

  useEffect(() => {
    if (teacher) {
      setFormData(prepareTeacherForForm(teacher));
    }
  }, [teacher]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle array field changes (keyTeachings, notableTeachings, etc.)
  const handleArrayChange = (field, values) => {
    setFormData({
      ...formData,
      [field]: values
    });
  };

  // Handle adding a new link
  const handleAddLink = () => {
    const currentLinks = formData.links || [];
    
    setFormData({
      ...formData,
      links: [...currentLinks, { url: '', label: '' }]
    });
  };

  // Handle updating a link
  const handleLinkChange = (index, field, value) => {
    const currentLinks = [...(formData.links || [])];
    
    currentLinks[index] = {
      ...currentLinks[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      links: currentLinks
    });
  };

  // Handle removing a link
  const handleRemoveLink = (index) => {
    const currentLinks = [...(formData.links || [])];
    
    currentLinks.splice(index, 1);
    
    setFormData({
      ...formData,
      links: currentLinks
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

  // Handle AI generation for description sections
  const handleGenerateWithAI = async () => {
    if (!getToken) {
      setAiError('Authentication required.');
      return;
    }
    try {
      // Clear any previous errors
      setAiError(null);
      setAiGenerating(true);
      
      // Make sure we have a teacher ID (can only generate for existing teachers)
      if (!teacher?._id) {
        throw new Error('Teacher must be saved before generating descriptions');
      }
      
      // Get the section keys to generate
      const sectionKeys = TEACHER_SECTIONS.map(section => section.key);
      
      // Construct the API URL
      const apiUrl = createApiUrl(`/admin/teachers/${teacher._id}/generate-descriptions`);
      
      // Call the API using fetchWithAuth
      const response = await fetchWithAuth(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          sectionKeys
        }),
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Validate form data
      const { isValid, errors } = validateTeacherForm(formData);
      
      if (!isValid) {
        setError(Object.values(errors).join(', '));
        setLoading(false);
        return;
      }
      
      // Call the onSave callback with the form data
      await onSave(formData);
    } catch (err) {
      console.error('Error saving teacher:', err);
      setError(err.message || 'Failed to save teacher');
    } finally {
      setLoading(false);
    }
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Basic Information Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div 
          className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
          onClick={() => toggleSection('basicInfo')}
        >
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          <svg 
            className={`h-5 w-5 text-gray-500 transform ${expandedSections.basicInfo ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {expandedSections.basicInfo && (
          <div className="p-4 border-t border-gray-200 space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            {/* Short Biography */}
            <div>
              <label htmlFor="biography" className="block text-sm font-medium text-gray-700 mb-1">
                Short Biography <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <p className="text-xs text-gray-500 mb-1">
                  A brief 1-2 line summary that will appear on teacher cards and in search results.
                </p>
                <textarea
                  id="biography"
                  name="biography"
                  value={formData.biography || ''}
                  onChange={handleInputChange}
                  placeholder="A brief 1-2 line summary that will appear on teacher cards and in search results."
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                  maxLength={200}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {formData.biography ? formData.biography.length : 0}/200 characters
                </div>
              </div>
            </div>
            
            {/* Birth Year */}
            <div>
              <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700 mb-1">
                Birth Year
              </label>
              <input
                type="number"
                id="birthYear"
                name="birthYear"
                value={formData.birthYear || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., 1950"
              />
            </div>
            
            {/* Death Year */}
            <div>
              <label htmlFor="deathYear" className="block text-sm font-medium text-gray-700 mb-1">
                Death Year
              </label>
              <input
                type="number"
                id="deathYear"
                name="deathYear"
                value={formData.deathYear || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Leave blank if still alive"
              />
            </div>
            
            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Country of origin"
              />
            </div>
            
            {/* Status */}
            <div>
              <label htmlFor="processed" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="processed"
                name="processed"
                value={formData.processed ? 'true' : 'false'}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    processed: e.target.value === 'true'
                  });
                }}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="false">Pending</option>
                <option value="true">Posted</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Media Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div 
          className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
          onClick={() => toggleSection('media')}
        >
          <h3 className="text-lg font-medium text-gray-900">Media</h3>
          <svg 
            className={`h-5 w-5 text-gray-500 transform ${expandedSections.media ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {expandedSections.media && (
          <div className="p-4 border-t border-gray-200 space-y-4">
            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            {/* Image Preview */}
            {formData.imageUrl && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700 mb-1">Preview</p>
                <div 
                  className="relative border border-gray-300 rounded-md overflow-hidden w-32 h-32 md:w-40 md:h-40"
                  style={getTeacherImageContainerStyles()}
                >
                  <div className="w-full h-full flex justify-center items-center">
                    <img 
                      src={formData.imageUrl} 
                      alt="Teacher preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Links Section */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Links</label>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="text-indigo-600 hover:text-indigo-900 text-sm flex items-center"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Link
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.links?.map((link, index) => (
                  <div key={index} className="grid grid-cols-5 gap-4">
                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="Label (e.g., 'Wikipedia', 'YouTube')"
                        value={link.label || ''}
                        onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="url"
                        placeholder="URL (https://...)"
                        value={link.url || ''}
                        onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(index)}
                        className="inline-flex items-center justify-center p-1 rounded-md text-red-500 hover:text-red-700 hover:bg-red-100 transition-colors"
                        aria-label="Remove link"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                
                {formData.links?.length === 0 && (
                  <div className="text-center py-4 text-sm text-gray-500 italic border border-dashed border-gray-300 rounded-md">
                    No links added yet. Click "Add Link" to add external links to this teacher's resources.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Relationships Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div 
          className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
          onClick={() => toggleSection('relationships')}
        >
          <h3 className="text-lg font-medium text-gray-900">Relationships</h3>
          <svg 
            className={`h-5 w-5 text-gray-500 transform ${expandedSections.relationships ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {expandedSections.relationships && (
          <div className="p-4 border-t border-gray-200 space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Relationship selection functionality will be implemented in a future update.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Detailed Description Sections */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div 
          className="flex justify-between items-center p-4 bg-gray-50"
          onClick={() => toggleSection('descriptionSections')}
        >
          <div>
            <h3 className="text-lg font-medium text-gray-900">Detailed Description Sections</h3>
            <p className="text-sm text-gray-500 mt-1">
              {showDescriptionSections 
                ? 'Edit detailed description sections for this teacher' 
                : 'These sections will appear on the teacher detail page. You can add them after creating the teacher.'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {teacher?._id && (
              <button
                type="button"
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-colors flex items-center"
                onClick={handleGenerateWithAI}
                disabled={aiGenerating}
              >
                {aiGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate with AI
                  </>
                )}
              </button>
            )}
            
            <svg 
              className={`h-5 w-5 text-gray-500 transform ${expandedSections.descriptionSections ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {expandedSections.descriptionSections && (
          <div className="p-4 border-t border-gray-200">
            {/* AI Error message */}
            {aiError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      {aiError}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Each teacher has 5 specific description sections. These sections will be displayed on the teacher detail page.
                    <br />
                    Use the "Generate with AI" button to automatically create content for all sections based on the teacher's information.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Display the 5 description sections for teachers */}
            <div className="space-y-4">
              {TEACHER_SECTIONS.map((section) => (
                <div key={section.key} className="border border-gray-200 rounded-md p-4">
                  <h4 className="font-medium text-gray-800 mb-2">{section.label}</h4>
                  <p className="text-gray-500 text-sm italic mb-2">
                    {section.description || (section.type === 'text' ? 'Text section' : 'List section')}
                  </p>
                  
                  {section.type === 'text' ? (
                    <textarea
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={6}
                      value={formData.descriptionSections?.[section.key] || ''}
                      onChange={(e) => handleDescriptionSectionChange(section.key, e.target.value)}
                      placeholder={`Enter ${section.label.toLowerCase()} here...`}
                    />
                  ) : (
                    <textarea
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={6}
                      value={formData.descriptionSections?.[section.key] || ''}
                      onChange={(e) => handleDescriptionSectionChange(section.key, e.target.value)}
                      placeholder={`Enter ${section.label.toLowerCase()} items, one per line...`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Saving...
            </>
          ) : (
            'Save Teacher'
          )}
        </button>
      </div>
    </form>
  );
};

export default TeacherForm;
