/**
 * API route for user favorites
 * Handles GET and POST requests for retrieving and updating user favorites
 */
export default async function handler(req, res) {
  try {
    // Get authorization token from request headers
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : null;
    
    // Set up headers for backend request
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Handle GET request - fetch user favorites
    if (req.method === 'GET') {
      // Get clerkId from query
      const requestClerkId = req.query.clerkId;
      
      if (!requestClerkId) {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication required' 
        });
      }
      
      // Forward request to backend API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/favorites?clerkId=${requestClerkId}`, {
        method: 'GET',
        headers
      });
      
      const data = await response.json();
      return res.status(response.status).json(data);
    }
    
    // Handle POST request - toggle favorite status
    if (req.method === 'POST') {
      const { type, id, action, clerkId } = req.body;
      
      if (!clerkId) {
        return res.status(401).json({ 
          success: false, 
          message: 'User ID (clerkId) is required' 
        });
      }
      
      console.log('Forwarding toggle favorite request to backend:', {
        clerkId,
        type,
        id,
        action
      });
      
      // Forward request to backend API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/favorites`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          clerkId,
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
    
    // Handle unsupported methods
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
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
