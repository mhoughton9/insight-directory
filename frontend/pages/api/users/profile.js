/**
 * API route for user profile operations
 * @route GET /api/users/profile - Get user profile
 */
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req, res) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Check if the user is authenticated using Clerk's backend SDK
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const authorizationHeader = req.headers.authorization; // Get Authorization header
  if (!authorizationHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  try {
    // Handle GET request - fetch user profile
    if (req.method === 'GET') {
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          'Authorization': authorizationHeader, // Forward the header
        }
      });

      const data = await response.json();

      if (!response.ok) {
        // Forward the error status and message from the backend
        return res.status(response.status).json(data);
      }

      // Send the successful response back to the frontend
      res.status(200).json(data);
    }

    // Handle POST request - create or update user profile
    if (req.method === 'POST') {
      const userData = req.body;

      // Ensure the Clerk ID is included
      if (!userData.clerkId) {
        return res.status(400).json({
          success: false,
          message: 'Clerk ID is required'
        });
      }

      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorizationHeader, // Forward the header
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    // Handle unsupported methods
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  } catch (error) {
    console.error('Error in user profile API route:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}
