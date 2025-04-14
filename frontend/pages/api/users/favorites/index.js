import { getAuth } from '@clerk/nextjs/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * API route for user favorites
 * Handles GET, POST, and DELETE requests for retrieving, updating, and deleting user favorites
 */
export default async function handler(req, res) {
  // Extract the Authorization header from the incoming request
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  try {
    // Handle GET request - fetch user favorites
    if (req.method === 'GET') {
      // Forward request to backend API
      const response = await fetch(`${API_URL}/users/favorites`, {
        method: 'GET',
        headers: { 'Authorization': authorizationHeader }
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    // Handle POST and DELETE requests - toggle favorite status
    if (req.method === 'POST' || req.method === 'DELETE') {
      // Body expected for both POST (add) and DELETE (remove) by the backend controller
      const { type, id, action } = req.body; // action is technically unused now but might be in body

      if (!type || !id) {
        return res.status(400).json({ success: false, message: 'Type and ID are required' });
      }

      console.log('Forwarding toggle favorite request to backend:', {
        type,
        id,
        action
      });

      // Forward request to backend API using the original method (POST or DELETE)
      const response = await fetch(`${API_URL}/users/favorites`, {
        method: req.method, // Use the incoming method
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorizationHeader
        },
        body: JSON.stringify({
          type,
          id,
          action
        })
      });

      // Handle error responses from the backend
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error from backend when toggling favorite:', errorData);
        return res.status(response.status).json({
          success: false,
          message: errorData.message || 'Failed to update favorite status',
          error: errorData.error || {}
        });
      }

      const data = await response.json();
      console.log('Backend response for toggle favorite:', data);
      return res.status(response.status).json(data);
    }

    // If method is not GET, POST, or DELETE, return 405
    return res.status(405).json({ 
      success: false, 
      message: `Method ${req.method} not allowed` 
    });
  } catch (error) {
    console.error('Error in favorites API route:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message || 'Unknown error'
    });
  }
}
