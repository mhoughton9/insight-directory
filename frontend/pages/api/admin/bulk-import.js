import { NextApiRequest, NextApiResponse } from 'next';

/**
 * API Route: /api/admin/bulk-import
 * 
 * Handles bulk import of various entity types (resources, teachers, traditions)
 * Forwards the request to the backend
 */
export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    console.log('Frontend API route - Bulk import request received');
    console.log('Frontend API route - Request query:', req.query);
    console.log('Frontend API route - Request body:', req.body);
    
    // Get the entity type from query parameters
    const { entityType = 'resource' } = req.query;
    console.log('Frontend API route - Entity type:', entityType);
    
    // Extract the entities from the request body
    const { entities } = req.body;
    console.log('Frontend API route - Entities count:', entities ? entities.length : 0);
    
    if (!entities || !Array.isArray(entities) || entities.length === 0) {
      console.log('Frontend API route - Invalid entities array');
      return res.status(400).json({ message: `Invalid request: ${entityType}s must be a non-empty array` });
    }
    
    // Forward the request to the backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const backendEndpoint = `${backendUrl}/api/admin/bulk-import?entityType=${entityType}`;
    console.log('Frontend API route - Sending request to backend:', backendEndpoint);
    
    const requestBody = { entities };
    console.log('Frontend API route - Request body to backend:', requestBody);
    
    const response = await fetch(backendEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    // Get the response from the backend
    const data = await response.json();
    console.log('Frontend API route - Backend response status:', response.status);
    console.log('Frontend API route - Backend response data:', data);
    
    // Return the response
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error in bulk import API route:', error);
    return res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
}
