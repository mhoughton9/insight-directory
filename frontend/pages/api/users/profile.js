/**
 * API route for user profile operations
 * @route GET /api/users/profile - Get user profile
 * @route POST /api/users/profile - Create or update user profile
 */
export default async function handler(req, res) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  try {
    // Handle GET request - fetch user profile
    if (req.method === 'GET') {
      const { clerkId } = req.query;
      
      if (!clerkId) {
        return res.status(400).json({
          success: false,
          message: 'Clerk ID is required'
        });
      }
      
      const response = await fetch(`${API_URL}/users/profile?clerkId=${clerkId}`);
      const data = await response.json();
      
      return res.status(response.status).json(data);
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
      
      // Authentication check is now handled on the client side via ProtectedRoute
      // and the clerkId is passed directly from the client
      
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
