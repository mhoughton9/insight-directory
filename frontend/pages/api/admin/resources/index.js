import { NextApiRequest, NextApiResponse } from 'next';

// Next.js API route handler
export default async function handler(req, res) {
  // Don't allow non-GET methods for this route
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const queryParams = new URLSearchParams(req.query).toString();
    const apiUrl = `${backendUrl}/api/admin/resources${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await fetch(apiUrl);
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
