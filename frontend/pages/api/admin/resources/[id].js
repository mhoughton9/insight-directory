import { NextApiRequest, NextApiResponse } from 'next';

// Next.js API route handler
export default async function handler(req, res) {
  // Allow GET and PUT methods for this route
  if (req.method !== 'GET' && req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const { id } = req.query;
    const apiUrl = `${backendUrl}/api/admin/resources/${id}`;
    
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    // If it's a PUT request, include the body
    if (req.method === 'PUT') {
      fetchOptions.body = JSON.stringify(req.body);
    }
    
    const response = await fetch(apiUrl, fetchOptions);
    const data = await response.json();
    
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
