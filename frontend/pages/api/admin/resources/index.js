import { NextApiRequest, NextApiResponse } from 'next';

// Next.js API route handler
export default async function handler(req, res) {
  // Allow GET and POST methods for this route
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const queryParams = new URLSearchParams(req.query).toString();
    const apiUrl = `${backendUrl}/api/admin/resources${queryParams ? `?${queryParams}` : ''}`;
    
    // Handle different HTTP methods
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    // Add body for POST requests
    if (req.method === 'POST') {
      fetchOptions.body = JSON.stringify(req.body);
      console.log('Sending data to backend:', req.body);
    }
    
    const response = await fetch(apiUrl, fetchOptions);
    const data = await response.json();
    
    // Log detailed error information if the request failed
    if (!response.ok) {
      console.error('Backend API error:', {
        status: response.status,
        statusText: response.statusText,
        data
      });
    }
    
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error proxying to backend:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error connecting to backend server',
      error: error.message 
    });
  }
}

// Configure the API
export const config = {
  api: {
    bodyParser: true,
  },
};
