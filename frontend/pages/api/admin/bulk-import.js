import { NextApiRequest, NextApiResponse } from 'next';

/**
 * API Route: /api/admin/bulk-import
 * 
 * Handles bulk import of resources
 * Forwards the request to the backend
 */
export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    // Extract the resources from the request body
    const { resources } = req.body;
    
    if (!resources || !Array.isArray(resources) || resources.length === 0) {
      return res.status(400).json({ message: 'Invalid request: resources must be a non-empty array' });
    }
    
    // Forward the request to the backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${backendUrl}/api/admin/bulk-import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resources }),
    });
    
    // Get the response from the backend
    const data = await response.json();
    
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
