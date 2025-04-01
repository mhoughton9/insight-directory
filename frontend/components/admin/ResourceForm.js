import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { RESOURCE_TYPES, formatResourceType, getResourceTypeConfig, getTitleLabel } from './utils/resource-type-utils';
import { RESOURCE_SECTIONS, normalizeResourceTypeForSections } from '@/utils/resource-section-config';

/**
 * Resource Form Component
 * 
 * A unified form for creating and editing resources of all types
 * Supports collapsible sections and type-specific fields
 */
const ResourceForm = ({ resource = null, onSave, onCancel }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDescriptionSections, setShowDescriptionSections] = useState(!!resource?.descriptionSections);
  
  // Initialize form data from resource or with defaults
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'book',
    publishedDate: '',
    creator: [],
    imageUrl: '',
    processed: false, // Default to Pending status
    descriptionSections: {},
    // Type-specific details will be added dynamically
    ...resource
  });

  // Track which sections are expanded/collapsed
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    typeSpecific: true,
    media: true,
    descriptionSections: !!resource?.descriptionSections
  });

  // Get type-specific fields configuration based on selected resource type
  const typeConfig = getResourceTypeConfig(formData.type);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle type-specific field changes
  const handleTypeSpecificChange = (e) => {
    const { name, value } = e.target;
    const detailsPath = typeConfig.detailsPath;
    
    setFormData({
      ...formData,
      [detailsPath]: {
        ...formData[detailsPath],
        [name]: value
      }
    });
  };

  // Handle array field changes (creator, tags, etc.)
  const handleArrayChange = (field, values) => {
    setFormData({
      ...formData,
      [field]: values
    });
  };

  // Handle type-specific array field changes
  const handleTypeSpecificArrayChange = (field, values) => {
    const detailsPath = typeConfig.detailsPath;
    
    setFormData({
      ...formData,
      [detailsPath]: {
        ...formData[detailsPath],
        [field]: values
      }
    });
  };

  // Handle adding a new link to the type-specific details
  const handleAddLink = () => {
    const detailsPath = typeConfig.detailsPath;
    const currentLinks = formData[detailsPath]?.links || [];
    
    setFormData({
      ...formData,
      [detailsPath]: {
        ...formData[detailsPath],
        links: [...currentLinks, { url: '', label: '' }]
      }
    });
  };

  // Handle updating a link
  const handleLinkChange = (index, field, value) => {
    const detailsPath = typeConfig.detailsPath;
    const currentLinks = [...(formData[detailsPath]?.links || [])];
    
    currentLinks[index] = {
      ...currentLinks[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      [detailsPath]: {
        ...formData[detailsPath],
        links: currentLinks
      }
    });
  };

  // Handle removing a link
  const handleRemoveLink = (index) => {
    const detailsPath = typeConfig.detailsPath;
    const currentLinks = [...(formData[detailsPath]?.links || [])];
    
    currentLinks.splice(index, 1);
    
    setFormData({
      ...formData,
      [detailsPath]: {
        ...formData[detailsPath],
        links: currentLinks
      }
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Call the onSave callback with the form data
      await onSave(formData);
    } catch (err) {
      console.error('Error saving resource:', err);
      setError(err.message || 'Failed to save resource');
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

  // Initialize type-specific details when type changes
  useEffect(() => {
    const detailsPath = typeConfig.detailsPath;
    
    // If the details object doesn't exist for this type, create it
    if (!formData[detailsPath]) {
      setFormData({
        ...formData,
        [detailsPath]: {}
      });
    }
  }, [formData.type]);

  // Get the appropriate description sections for the current resource type
  const getDescriptionSectionsForType = () => {
    const normalizedType = normalizeResourceTypeForSections(formData.type);
    return RESOURCE_SECTIONS[normalizedType] || [];
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
            {/* Title with dynamic label based on resource type */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                {getTitleLabel(formData.type)} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            {/* Resource Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Resource Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {RESOURCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {formatResourceType(type)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Short Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Short Description <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <p className="text-xs text-gray-500 mb-1">
                  A brief 1-2 line summary that will appear on resource cards and in search results.
                </p>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={2}
                  maxLength={200}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Brief summary of the resource (1-2 lines)"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {formData.description.length}/200 characters
                </p>
              </div>
            </div>
            
            {/* Creator */}
            <div>
              <label htmlFor="creator" className="block text-sm font-medium text-gray-700 mb-1">
                Creator/Author
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  id="creator"
                  placeholder="Add creator and press Enter"
                  className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = e.target.value.trim();
                      if (value && !formData.creator.includes(value)) {
                        handleArrayChange('creator', [...formData.creator, value]);
                        e.target.value = '';
                      }
                    }
                  }}
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.creator.map((item, index) => (
                  <div key={index} className="bg-gray-100 px-2 py-1 rounded-md flex items-center">
                    <span className="text-sm">{item}</span>
                    <button
                      type="button"
                      className="ml-1 text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        const newCreator = [...formData.creator];
                        newCreator.splice(index, 1);
                        handleArrayChange('creator', newCreator);
                      }}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Publication Date */}
            <div>
              <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700 mb-1">
                Publication Date
              </label>
              <input
                type="date"
                id="publishedDate"
                name="publishedDate"
                value={formData.publishedDate ? new Date(formData.publishedDate).toISOString().split('T')[0] : ''}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
      
      {/* Type-Specific Details Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div 
          className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
          onClick={() => toggleSection('typeSpecific')}
        >
          <h3 className="text-lg font-medium text-gray-900">{formatResourceType(formData.type)} Details</h3>
          <svg 
            className={`h-5 w-5 text-gray-500 transform ${expandedSections.typeSpecific ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {expandedSections.typeSpecific && (
          <div className="p-4 border-t border-gray-200 space-y-4">
            {/* Render fields based on resource type */}
            {typeConfig.fields.map((field) => {
              const detailsPath = typeConfig.detailsPath;
              const fieldValue = formData[detailsPath]?.[field.name] || '';
              
              // Handle different field types
              if (field.type === 'text' || field.type === 'number' || field.type === 'url') {
                return (
                  <div key={field.name}>
                    <label 
                      htmlFor={`${detailsPath}.${field.name}`} 
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={field.type}
                      id={`${detailsPath}.${field.name}`}
                      name={field.name}
                      value={fieldValue}
                      onChange={handleTypeSpecificChange}
                      required={field.required}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                );
              }
              
              return null;
            })}

            {/* Links Section */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Links</label>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Link
                </button>
              </div>
              
              <div className="space-y-3">
                {formData[typeConfig.detailsPath]?.links?.map((link, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="flex-grow">
                      <input
                        type="url"
                        placeholder="URL"
                        value={link.url || ''}
                        onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-1"
                      />
                      <input
                        type="text"
                        placeholder="Label (e.g., 'Amazon', 'Official Website')"
                        value={link.label || ''}
                        onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(index)}
                      className="text-red-500 hover:text-red-700 mt-2"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                {(!formData[typeConfig.detailsPath]?.links || formData[typeConfig.detailsPath]?.links.length === 0) && (
                  <p className="text-gray-500 text-sm italic">No links added yet. Click "Add Link" to add one.</p>
                )}
              </div>
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
                <div className="border border-gray-300 rounded-md p-2 w-48 h-48 flex items-center justify-center overflow-hidden">
                  <img 
                    src={formData.imageUrl} 
                    alt="Resource preview" 
                    className="max-w-full max-h-full object-contain" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
              </div>
            )}
            
            {/* TODO: Add Cloudinary image upload when needed */}
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
                ? 'Edit detailed description sections for this resource' 
                : 'These sections will appear on the resource detail page. You can add them after creating the resource.'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {resource?._id && (
              <button
                type="button"
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-colors flex items-center"
                onClick={() => {
                  // Placeholder for future AI generation
                  alert('AI generation will be implemented in the future');
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate with AI
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
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Each resource type has 5 specific description sections. These sections will be displayed on the resource detail page.
                    <br />
                    In the future, you'll be able to generate these sections using AI.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Display the 5 description sections for the current resource type */}
            <div className="space-y-4">
              {getDescriptionSectionsForType().map((section) => (
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
            'Save Resource'
          )}
        </button>
      </div>
    </form>
  );
};

export default ResourceForm;
