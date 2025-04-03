import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

/**
 * Bulk Import Form Component
 * 
 * Allows administrators to import multiple entities (resources, teachers, traditions) at once via JSON
 * Supports both pasting JSON and uploading JSON files
 */
const BulkImportForm = () => {
  const { user } = useUser();
  const [jsonInput, setJsonInput] = useState('');
  const [validationResults, setValidationResults] = useState(null);
  const [importResults, setImportResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [entityType, setEntityType] = useState('resource'); // Default to resource
  
  // Example JSON structures for reference
  const resourceExampleJson = [
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
  
  // Handle copy example JSON to clipboard based on entity type
  const copyExampleJson = () => {
    let exampleToUse;
    switch(entityType) {
      case 'teacher':
        exampleToUse = teacherExampleJson;
        break;
      case 'tradition':
        exampleToUse = traditionExampleJson;
        break;
      default: // resource
        exampleToUse = resourceExampleJson;
    }
    navigator.clipboard.writeText(formatJson(exampleToUse))
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
  
  // Teacher example JSON structure
  const teacherExampleJson = [
    {
      "name": "Eckhart Tolle",
      "biography": "Eckhart Tolle is a spiritual teacher and author known for his teachings on presence and inner peace.",
      "biographyFull": "Eckhart Tolle is a spiritual teacher and author best known for his books 'The Power of Now' and 'A New Earth'. After experiencing a profound inner transformation at age 29, he dedicated his life to sharing wisdom about spiritual awakening and conscious living.",
      "birthYear": 1948,
      "country": "Germany",
      "keyTeachings": ["Presence", "The Now", "Ego dissolution", "Inner peace"],
      "notableTeachings": ["Pain-body concept", "Conscious presence"],
      "processed": false
    }
  ];

  // Tradition example JSON structure
  const traditionExampleJson = [
    {
      "name": "Advaita Vedanta",
      "description": "A school of Hindu philosophy emphasizing non-dualism and the unity of Atman and Brahman.",
      "descriptionFull": "Advaita Vedanta is one of the most influential sub-schools of Vedanta, an ancient Indian philosophy that emphasizes non-dualism. The word 'Advaita' means 'not two' in Sanskrit, pointing to the tradition's core teaching that reality is non-dual, and that the individual self (Atman) is identical to the ultimate reality (Brahman).",
      "origin": "India",
      "foundingPeriod": "8th century CE (formalized by Adi Shankara)",
      "keyTeachings": ["Non-dualism", "Identity of Atman and Brahman", "Maya (illusion)", "Self-inquiry"],
      "processed": false
    }
  ];

  // Resource type examples for reference
  const resourceTypeExamples = {
    book: {
      title: "The Power of Now",
      description: "A guide to spiritual enlightenment",
      type: "book",
      author: ["Eckhart Tolle"],
      yearPublished: 1997,
      pages: 236,
      processed: false
    },
    videoChannel: {
      title: "Rupert Spira Channel",
      description: "Non-duality teachings and dialogues",
      type: "videoChannel",
      channelName: "Rupert Spira",
      creator: ["Rupert Spira"],
      keyTopics: ["Non-duality", "Consciousness", "Awareness"],
      processed: false
    },
    podcast: {
      title: "Buddha at the Gas Pump",
      description: "Interviews with spiritually awakening people",
      type: "podcast",
      podcastName: "Buddha at the Gas Pump",
      hosts: ["Rick Archer"],
      datesActive: "2009-present",
      notableGuests: ["Eckhart Tolle", "Adyashanti", "Rupert Spira"],
      processed: false
    },
    website: {
      title: "Liberation Unleashed",
      description: "A global movement of people helping others to see through the illusion of self",
      type: "website",
      websiteName: "Liberation Unleashed",
      creator: ["Ilona Ciunaite", "Elena Nezhinsky"],
      primaryContentTypes: ["Forum", "Guides", "Articles"],
      processed: false
    },
    blog: {
      title: "Awakening Clarity",
      description: "Personal journey and insights into non-dual awareness",
      type: "blog",
      name: "Awakening Clarity",
      author: ["David Thompson"],
      frequency: "Weekly",
      processed: false
    },
    practice: {
      title: "Self-Inquiry Meditation",
      description: "A guided practice for investigating the nature of self",
      type: "practice",
      name: "Self-Inquiry Meditation",
      originator: ["Ramana Maharshi"],
      processed: false
    },
    app: {
      title: "Presence Meditation",
      description: "An app for guided non-dual awareness meditations",
      type: "app",
      appName: "Presence Meditation",
      creator: ["Mindful Technologies"],
      processed: false
    },
    retreatCenter: {
      title: "Mountain Stream Retreat",
      description: "A peaceful center for silent retreats and self-inquiry",
      type: "retreatCenter",
      name: "Mountain Stream Retreat",
      retreatTypes: ["Silent retreats", "Self-inquiry workshops", "Meditation sessions"],
      processed: false
    }
  };
  
  // Example JSON for Teacher
  const teacherExample = {
    name: "Eckhart Tolle",
    biography: "Spiritual teacher and author known for 'The Power of Now'",
    birthYear: 1948,
    country: "Germany",
    processed: false
  };
  
  // Example JSON for Tradition
  const traditionExample = {
    name: "Advaita Vedanta",
    description: "A school of Hindu philosophy and religious practice emphasizing the oneness of Atman and Brahman",
    origin: "India",
    foundingPeriod: "8th century CE",
    processed: false
  };

  const teacherTypeExamples = {
    teacher: {
      "name": "Eckhart Tolle",
      "biography": "A spiritual teacher and author known for his books on spirituality and personal growth.",
      "birthYear": 1948,
      "country": "Germany",
      "keyTeachings": ["Presence", "The Now", "Ego dissolution", "Inner peace"],
      "notableTeachings": ["Pain-body concept", "Conscious presence"],
      "processed": false
    }
  };

  const traditionTypeExamples = {
    tradition: {
      "name": "Advaita Vedanta",
      "description": "A school of Hindu philosophy emphasizing non-dualism and the unity of Atman and Brahman.",
      "descriptionFull": "Advaita Vedanta is one of the most influential sub-schools of Vedanta, an ancient Indian philosophy that emphasizes non-dualism. The word 'Advaita' means 'not two' in Sanskrit, pointing to the tradition's core teaching that reality is non-dual, and that the individual self (Atman) is identical to the ultimate reality (Brahman).",
      "origin": "India",
      "foundingPeriod": "8th century CE (formalized by Adi Shankara)"
    }
  };
  
  // State for button copy feedback
  const [copiedType, setCopiedType] = useState(null);

  // Copy example JSON to clipboard based on type
  const copyTypeExample = (type) => {
    try {
      if (entityType === 'resource' && resourceTypeExamples[type]) {
        // For resources, copy the specific resource type example
        navigator.clipboard.writeText(JSON.stringify([resourceTypeExamples[type]], null, 2))
          .then(() => {
            console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} example copied to clipboard!`);
            setCopiedType(type);
            setTimeout(() => setCopiedType(null), 1500); // Reset after 1.5 seconds
          });
      } else if (type === 'teacher') {
        // For teacher example
        navigator.clipboard.writeText(JSON.stringify([teacherExample], null, 2))
          .then(() => {
            console.log('Teacher example copied to clipboard!');
            setCopiedType('teacher');
            setTimeout(() => setCopiedType(null), 1500); // Reset after 1.5 seconds
          });
      } else if (type === 'tradition') {
        // For tradition example
        navigator.clipboard.writeText(JSON.stringify([traditionExample], null, 2))
          .then(() => {
            console.log('Tradition example copied to clipboard!');
            setCopiedType('tradition');
            setTimeout(() => setCopiedType(null), 1500); // Reset after 1.5 seconds
          });
      }
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      // Show error in console only, no alert
    }
  };

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
    console.log('Validating JSON for entity type:', entityType);
    setError(null);
    setValidationResults(null);

    // Manual JSON validation to avoid browser errors
    const validateJsonSyntax = (input) => {
      if (!input || input.trim() === '') {
        return { valid: false, error: 'JSON input is empty' };
      }
      
      // Check for balanced brackets and braces
      const brackets = [];
      const openBrackets = ['[', '{'];
      const closeBrackets = [']', '}'];
      const pairs = { '[': ']', '{': '}' };
      
      let inString = false;
      let escaped = false;
      
      for (let i = 0; i < input.length; i++) {
        const char = input[i];
        
        // Handle string detection
        if (char === '\\' && !escaped) {
          escaped = true;
          continue;
        }
        
        if (char === '"' && !escaped) {
          inString = !inString;
        }
        
        escaped = false;
        
        // Skip characters inside strings
        if (inString) continue;
        
        // Check brackets
        if (openBrackets.includes(char)) {
          brackets.push(char);
        } else if (closeBrackets.includes(char)) {
          const lastBracket = brackets.pop();
          if (!lastBracket || pairs[lastBracket] !== char) {
            return { valid: false, error: `Unbalanced brackets at position ${i}` };
          }
        }
      }
      
      // Check if all brackets are closed
      if (brackets.length > 0) {
        return { valid: false, error: 'Unclosed brackets in JSON' };
      }
      
      // If we've made it this far, try to parse the JSON safely
      try {
        const data = JSON.parse(input);
        return { valid: true, data };
      } catch (error) {
        // This should rarely happen since we've already checked the syntax
        return { valid: false, error: `JSON syntax error: ${error.message}` };
      }
    };

    try {
      // Parse JSON if it's a string
      let jsonData;
      if (typeof jsonInput === 'string') {
        // First do a pre-check without actually parsing
        const syntaxCheck = validateJsonSyntax(jsonInput);
        if (!syntaxCheck.valid) {
          // Handle JSON syntax errors gracefully
          console.error('JSON syntax check failed:', syntaxCheck.error);
          setValidationResults({
            valid: [],
            invalid: [],
            error: `JSON Syntax Error: ${syntaxCheck.error}`
          });
          return;
        }
        jsonData = syntaxCheck.data;
      } else {
        jsonData = jsonInput;
      }
      console.log('Parsed JSON data:', jsonData);

      // Ensure it's an array
      if (!Array.isArray(jsonData)) {
        setValidationResults({
          valid: [],
          invalid: [],
          error: `JSON must be an array of ${entityType}s`
        });
        return;
      }

      // Validate each entity
      const valid = [];
      const invalid = [];

      jsonData.forEach((entity, index) => {
        const errors = [];

        // Validate based on entity type
        if (entityType === 'resource') {
          // Check required fields for resources
          if (!entity.title) {
            errors.push('Missing title');
          }

          if (!entity.description) {
            errors.push('Missing description');
          }

          if (!entity.type) {
            errors.push('Missing type');
          } else if (![
            'book', 'videoChannel', 'podcast', 'website', 'blog', 'practice', 'app', 'retreatCenter'
          ].includes(entity.type)) {
            errors.push(`Invalid resource type: ${entity.type}`);
          }
        } else if (entityType === 'teacher') {
          // Check required fields for teachers
          if (!entity.name) {
            errors.push('Missing name');
          }

          if (!entity.biography) {
            errors.push('Missing biography');
          }

          // Check if processed field exists (not required but should be validated)
          if (entity.hasOwnProperty('processed') && typeof entity.processed !== 'boolean') {
            errors.push('Processed field must be a boolean');
          }

          // Validate birthYear if present
          if (entity.birthYear && (typeof entity.birthYear !== 'number' || entity.birthYear < 0)) {
            errors.push('Birth year must be a positive number');
          }

          // Validate country if present
          if (entity.country && typeof entity.country !== 'string') {
            errors.push('Country must be a string');
          }
        } else if (entityType === 'tradition') {
          // Check required fields for traditions
          if (!entity.name) {
            errors.push('Missing name');
          }

          if (!entity.description) {
            errors.push('Missing description');
          }

          // Check if processed field exists (not required but should be validated)
          if (entity.hasOwnProperty('processed') && typeof entity.processed !== 'boolean') {
            errors.push('Processed field must be a boolean');
          }

          // Validate origin if present
          if (entity.origin && typeof entity.origin !== 'string') {
            errors.push('Origin must be a string');
          }

          // Validate foundingPeriod if present
          if (entity.foundingPeriod && typeof entity.foundingPeriod !== 'string') {
            errors.push('Founding period must be a string');
          }
        }

        // Add to appropriate result list
        if (errors.length === 0) {
          valid.push(entity);
        } else {
          invalid.push({
            index,
            entity,
            errors
          });
        }
      });

      console.log('Validation results:', { valid, invalid });
      setValidationResults({ valid, invalid });
      return { valid, invalid };
    } catch (err) {
      console.error('JSON validation error:', err);
      // Set validation results with error message instead of using setError
      setValidationResults({
        valid: [],
        invalid: [],
        error: `Invalid JSON format: ${err.message}`
      });
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    // Validate JSON first if not already validated
    if (!validationResults) {
      validateJson();
      return;
    }

    setLoading(true);
    setError(null);
    setImportResults(null);

    try {
      // Get the valid entities from validation results
      const { valid } = validationResults;

      if (!valid || valid.length === 0) {
        setError(`No valid ${entityType}s to import`);
        setLoading(false);
        return;
      }

      // Prepare query params with clerk ID
      let queryParams = new URLSearchParams();
      queryParams.append('clerkId', user.id); // Use the authenticated user's Clerk ID
      queryParams.append('entityType', entityType);

      // Send request to API
      const response = await fetch(`/api/admin/bulk-import?${queryParams.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ entities: valid })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to import ${entityType}s`);
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
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Bulk Import</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Entity type selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Entity Type
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="entityType"
                value="resource"
                checked={entityType === 'resource'}
                onChange={() => setEntityType('resource')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Resources</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="entityType"
                value="teacher"
                checked={entityType === 'teacher'}
                onChange={() => setEntityType('teacher')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Teachers</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="entityType"
                value="tradition"
                checked={entityType === 'tradition'}
                onChange={() => setEntityType('tradition')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Traditions</span>
            </label>
          </div>
        </div>

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

        {/* JSON input area */}
        <div>
          <label htmlFor="json-input" className="block text-sm font-medium text-gray-700 mb-2">
            JSON Data
          </label>
          <textarea
            id="json-input"
            name="jsonInput"
            rows={10}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
            placeholder="Paste JSON data here..."
            value={jsonInput}
            onChange={handleJsonInputChange}
          ></textarea>
        </div>

        {/* JSON Examples - Shown based on selected entity type */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">JSON Examples</h2>
          
          {/* Resource examples */}
          {entityType === 'resource' && (
            <div className="flex flex-wrap gap-2">
              {Object.keys(resourceTypeExamples).map(type => (
                <button
                  key={type}
                  id={`copy-${type}-button`}
                  type="button"
                  onClick={() => copyTypeExample(type)}
                  className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500 transition-all duration-200"
                >
                  {copiedType === type ? 'Copied!' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          )}
          
          {/* Teacher example */}
          {entityType === 'teacher' && (
            <div className="flex flex-wrap gap-2">
              <button
                id="copy-teacher-button"
                type="button"
                onClick={() => copyTypeExample('teacher')}
                className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500 transition-all duration-200"
              >
                {copiedType === 'teacher' ? 'Copied!' : 'Teacher'}
              </button>
            </div>
          )}
          
          {/* Tradition example */}
          {entityType === 'tradition' && (
            <div className="flex flex-wrap gap-2">
              <button
                id="copy-tradition-button"
                type="button"
                onClick={() => copyTypeExample('tradition')}
                className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500 transition-all duration-200"
              >
                {copiedType === 'tradition' ? 'Copied!' : 'Tradition'}
              </button>
            </div>
          )}
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
              `Import ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}s`
            )}
          </button>
        </div>
        
        {/* Validation results */}
        {validationResults && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Validation Results</h2>
            
            {validationResults.error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-700">
                  <strong>Error:</strong> {validationResults.error}
                </p>
              </div>
            ) : (
              <>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                  <p className="text-sm text-green-700">
                    <strong>{validationResults.valid.length}</strong> valid {entityType}s ready to import
                  </p>
                </div>
                
                {validationResults.invalid.length > 0 && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <p className="text-sm text-red-700 mb-2">
                      <strong>{validationResults.invalid.length}</strong> {entityType}s have validation errors:
                    </p>
                    
                    <ul className="list-disc list-inside text-sm text-red-700">
                      {validationResults.invalid.map((item) => (
                        <li key={item.index} className="mb-2">
                          <strong>{entityType.charAt(0).toUpperCase() + entityType.slice(1)} {item.index + 1}:</strong> {item.errors.join(', ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        
        {/* Import results */}
        {importResults && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Import Results</h2>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <p className="text-sm text-green-700">
                Successfully imported <strong>{importResults.success}</strong> {entityType}s
              </p>
            </div>
            
            {importResults.errors && importResults.errors.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
                <p className="text-sm text-red-700 mb-2">
                  <strong>{importResults.errors.length}</strong> {entityType}s failed to import:
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
