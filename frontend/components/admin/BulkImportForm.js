import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

/**
 * Bulk Import Form Component
 * 
 * Allows administrators to import multiple resources at once via JSON
 * Supports both pasting JSON and uploading JSON files
 */
const BulkImportForm = () => {
  const { user } = useUser();
  const [jsonInput, setJsonInput] = useState('');
  const [validationResults, setValidationResults] = useState(null);
  const [importResults, setImportResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Example JSON structure for reference
  const exampleJson = [
    {
      "title": "Example Book",
      "description": "A sample book about non-duality",
      "type": "book",
      "creator": ["John Doe"],
      "publishedDate": "2023-01-01",
      "processed": false,
      "bookDetails": {
        "author": ["John Doe"],
        "publisher": "Awakening Press",
        "isbn": "978-1234567890",
        "pages": 250,
        "yearPublished": 2023,
        "links": [
          {
            "url": "https://www.amazon.com/example-book",
            "label": "Amazon"
          }
        ]
      }
    },
    {
      "title": "Example Video Channel",
      "description": "A YouTube channel about spiritual awakening",
      "type": "videoChannel",
      "creator": ["Jane Smith"],
      "publishedDate": "2022-05-15",
      "processed": false,
      "videoChannelDetails": {
        "channelName": "Awakening Insights",
        "creator": ["Jane Smith"],
        "keyTopics": ["Non-duality", "Meditation", "Self-inquiry"],
        "links": [
          {
            "url": "https://youtube.com/example",
            "label": "YouTube Channel"
          }
        ]
      }
    }
  ];
  
  // Handle copy example JSON to clipboard
  const copyExampleJson = () => {
    navigator.clipboard.writeText(formatJson(exampleJson))
      .then(() => {
        // Show temporary success message
        const copyButton = document.getElementById('copy-json-button');
        const originalText = copyButton.innerText;
        copyButton.innerText = 'Copied!';
        setTimeout(() => {
          copyButton.innerText = originalText;
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy JSON:', err);
      });
  };
  
  // Resource type examples for reference
  const resourceTypeExamples = {
    book: {
      "title": "The Power of Now",
      "description": "A guide to spiritual enlightenment",
      "type": "book",
      "creator": ["Eckhart Tolle"],
      "publishedDate": "1997-01-01",
      "processed": false,
      "bookDetails": {
        "author": ["Eckhart Tolle"],
        "publisher": "New World Library",
        "isbn": "978-1577314806",
        "pages": 236,
        "yearPublished": 1997,
        "links": [
          {
            "url": "https://www.amazon.com/Power-Now-Guide-Spiritual-Enlightenment/dp/1577314808",
            "label": "Amazon"
          }
        ]
      }
    },
    video: {
      "title": "Buddha at the Gas Pump",
      "description": "Interviews with spiritually awakening people",
      "type": "videoChannel",
      "creator": ["Rick Archer"],
      "publishedDate": "2009-10-15",
      "processed": false,
      "videoChannelDetails": {
        "channelName": "Buddha at the Gas Pump",
        "creator": ["Rick Archer"],
        "keyTopics": ["Non-duality", "Spiritual awakening", "Consciousness"],
        "links": [
          {
            "url": "https://www.youtube.com/c/BuddhaAtTheGasPump",
            "label": "YouTube Channel"
          }
        ]
      }
    },
    podcast: {
      "title": "Sounds of Silence",
      "description": "Exploring non-dual awareness through conversations",
      "type": "podcast",
      "creator": ["Sarah Johnson"],
      "publishedDate": "2020-03-01",
      "processed": false,
      "podcastDetails": {
        "podcastName": "Sounds of Silence",
        "hosts": ["Sarah Johnson"],
        "datesActive": "2020-present",
        "frequency": "Weekly",
        "episodeCount": 85,
        "notableGuests": ["Rupert Spira", "Adyashanti", "Eckhart Tolle"],
        "links": [
          {
            "url": "https://spotify.com/sounds-of-silence",
            "label": "Spotify"
          },
          {
            "url": "https://podcasts.apple.com/sounds-of-silence",
            "label": "Apple Podcasts"
          }
        ]
      }
    },
    website: {
      "title": "Non-Duality Now",
      "description": "Resources for understanding non-dual awareness",
      "type": "website",
      "creator": ["Michael Smith"],
      "publishedDate": "2018-05-12",
      "processed": false,
      "websiteDetails": {
        "websiteName": "Non-Duality Now",
        "creator": ["Michael Smith"],
        "primaryContentTypes": ["Articles", "Resources", "Practices"],
        "link": "https://www.nondualitynow.com",
        "links": [
          {
            "url": "https://www.nondualitynow.com",
            "label": "Website"
          }
        ],
        "updateFrequency": "Monthly"
      }
    },
    blog: {
      "title": "Awakening Clarity",
      "description": "Personal journey and insights into non-dual awareness",
      "type": "blog",
      "creator": ["David Thompson"],
      "publishedDate": "2015-08-20",
      "processed": false,
      "blogDetails": {
        "name": "Awakening Clarity",
        "author": ["David Thompson"],
        "platform": "WordPress",
        "frequency": "Weekly",
        "link": "https://www.awakeningclarity.com",
        "links": [
          {
            "url": "https://www.awakeningclarity.com",
            "label": "Blog"
          }
        ]
      }
    },
    practice: {
      "title": "Self-Inquiry Meditation",
      "description": "A guided practice for investigating the nature of self",
      "type": "practice",
      "creator": ["Ramana Maharshi"],
      "publishedDate": "1950-01-01",
      "processed": false,
      "practiceDetails": {
        "name": "Self-Inquiry Meditation",
        "originator": ["Ramana Maharshi"],
        "duration": "20-30 minutes",
        "links": [
          {
            "url": "https://www.ramanateachings.org/self-inquiry.html",
            "label": "Practice Instructions"
          }
        ]
      }
    },
    app: {
      "title": "Presence Meditation",
      "description": "An app for guided non-dual awareness meditations",
      "type": "app",
      "creator": ["Mindful Technologies"],
      "publishedDate": "2021-02-15",
      "processed": false,
      "appDetails": {
        "appName": "Presence Meditation",
        "creator": ["Mindful Technologies"],
        "platforms": ["iOS", "Android"],
        "teachers": ["Adyashanti", "Rupert Spira"],
        "features": ["Guided meditations", "Timer", "Progress tracking"],
        "links": [
          {
            "url": "https://apps.apple.com/presence-meditation",
            "label": "iOS App Store"
          },
          {
            "url": "https://play.google.com/store/apps/presence-meditation",
            "label": "Google Play Store"
          }
        ]
      }
    },
    retreatCenter: {
      "title": "Mountain Stream Retreat",
      "description": "A peaceful center for silent retreats and self-inquiry",
      "type": "retreatCenter",
      "creator": ["John Anderson"],
      "publishedDate": "2010-06-01",
      "processed": false,
      "retreatCenterDetails": {
        "name": "Mountain Stream Retreat",
        "creator": ["John Anderson"],
        "location": "Boulder, Colorado, USA",
        "retreatTypes": ["Silent retreats", "Self-inquiry workshops", "Meditation sessions"],
        "upcomingDates": ["June 15-22, 2025", "August 10-17, 2025"],
        "links": [
          {
            "url": "https://www.mountainstreamretreat.com",
            "label": "Website"
          }
        ]
      }
    }
  };
  
  // Handle copy specific resource type example to clipboard
  const copyTypeExample = (type) => {
    navigator.clipboard.writeText(formatJson([resourceTypeExamples[type]]))
      .then(() => {
        // Show temporary success message
        const copyButton = document.getElementById(`copy-${type}-button`);
        const originalText = copyButton.innerText;
        copyButton.innerText = 'Copied!';
        setTimeout(() => {
          copyButton.innerText = originalText;
        }, 2000);
      })
      .catch(err => {
        console.error(`Failed to copy ${type} example:`, err);
      });
  };
  
  // Handle JSON input change
  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
    setValidationResults(null);
    setImportResults(null);
    setError(null);
  };
  
  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/json') {
      setError('Please upload a JSON file');
      return;
    }
    
    try {
      const text = await file.text();
      setJsonInput(text);
      setValidationResults(null);
      setImportResults(null);
      setError(null);
    } catch (err) {
      setError('Error reading file: ' + err.message);
    }
  };
  
  // Validate JSON format
  const validateJson = () => {
    try {
      // Clear previous results
      setValidationResults(null);
      setImportResults(null);
      setError(null);
      
      // Parse JSON
      const parsedJson = JSON.parse(jsonInput);
      
      // Check if it's an array
      if (!Array.isArray(parsedJson)) {
        setError('JSON must be an array of resources');
        return;
      }
      
      // Validate each resource
      const results = {
        valid: [],
        invalid: []
      };
      
      parsedJson.forEach((resource, index) => {
        const validationErrors = [];
        
        // Check required fields
        if (!resource.title) validationErrors.push('Missing title');
        if (!resource.description) validationErrors.push('Missing description');
        if (!resource.type) validationErrors.push('Missing type');
        
        // Check resource type is valid
        const validTypes = ['book', 'blog', 'videoChannel', 'podcast', 'practice', 'retreatCenter', 'website', 'app'];
        if (resource.type && !validTypes.includes(resource.type)) {
          validationErrors.push(`Invalid resource type: ${resource.type}. Must be one of: ${validTypes.join(', ')}`);
        }
        
        // Check type-specific fields
        if (resource.type === 'book' && (!resource.bookDetails || !resource.bookDetails.author)) {
          validationErrors.push('Book resources must include bookDetails with author');
        }
        
        // Add to appropriate result list
        if (validationErrors.length === 0) {
          results.valid.push({
            index,
            resource
          });
        } else {
          results.invalid.push({
            index,
            resource,
            errors: validationErrors
          });
        }
      });
      
      setValidationResults(results);
      return results;
    } catch (err) {
      setError('Invalid JSON format: ' + err.message);
      return null;
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate JSON first
      const validationResults = validateJson();
      if (!validationResults || validationResults.invalid.length > 0) {
        return; // Don't proceed if validation failed
      }
      
      // Start loading
      setLoading(true);
      
      // Send to API
      const response = await fetch('/api/admin/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resources: validationResults.valid.map(item => item.resource),
          clerkId: user.id
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to import resources');
      }
      
      // Set import results
      setImportResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Format JSON for display
  const formatJson = (json) => {
    try {
      return JSON.stringify(json, null, 2);
    } catch (e) {
      return json;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Bulk Import Resources</h1>
      
      {/* Instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>How to use:</strong>
              <br />
              1. Click on a resource type button to copy the template to your clipboard
              <br />
              2. Paste it into ChatGPT with instructions to create resources in this format
              <br />
              3. Paste the generated JSON into the text area below
              <br />
              4. Click "Validate JSON" to check for errors before importing
              <br />
              5. Click "Import Resources" to add them to the database
              <br /><br />
              <strong>Required fields:</strong> title, description, and type for all resources.
              <br />
              Type-specific fields should be included in their respective detail objects (e.g., bookDetails).
            </p>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* File upload */}
        <div className="mb-6">
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Upload JSON File (Optional)
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".json,application/json"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        
        {/* JSON textarea */}
        <div className="mb-6">
          <label htmlFor="jsonInput" className="block text-sm font-medium text-gray-700 mb-1">
            JSON Data
          </label>
          <textarea
            id="jsonInput"
            name="jsonInput"
            rows={10}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={jsonInput}
            onChange={handleJsonInputChange}
          />
        </div>
        
        {/* Resource Type Examples */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Resource Type Examples</h2>
          <div className="flex flex-wrap gap-4">
            {Object.keys(resourceTypeExamples).map((type) => (
              <button
                key={type}
                id={`copy-${type}-button`}
                type="button"
                onClick={() => copyTypeExample(type)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Copy {type.charAt(0).toUpperCase() + type.slice(1)} Example
              </button>
            ))}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            type="button"
            onClick={validateJson}
            disabled={loading || !jsonInput.trim()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Validate JSON
          </button>
          
          <button
            type="submit"
            disabled={loading || !jsonInput.trim() || (validationResults && validationResults.invalid.length > 0)}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Importing...
              </>
            ) : (
              'Import Resources'
            )}
          </button>
        </div>
        
        {/* Validation results */}
        {validationResults && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Validation Results</h2>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <p className="text-sm text-green-700">
                <strong>{validationResults.valid.length}</strong> valid resources ready to import
              </p>
            </div>
            
            {validationResults.invalid.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-700 mb-2">
                  <strong>{validationResults.invalid.length}</strong> resources have validation errors:
                </p>
                
                <ul className="list-disc list-inside text-sm text-red-700">
                  {validationResults.invalid.map((item) => (
                    <li key={item.index} className="mb-2">
                      <strong>Resource {item.index + 1}:</strong> {item.errors.join(', ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* Import results */}
        {importResults && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Import Results</h2>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <p className="text-sm text-green-700">
                Successfully imported <strong>{importResults.success}</strong> resources
              </p>
            </div>
            
            {importResults.errors && importResults.errors.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
                <p className="text-sm text-red-700 mb-2">
                  <strong>{importResults.errors.length}</strong> resources failed to import:
                </p>
                
                <ul className="list-disc list-inside text-sm text-red-700">
                  {importResults.errors.map((error, index) => (
                    <li key={index} className="mb-2">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default BulkImportForm;
