/**
 * API route to handle user favorites
 * @route GET /api/users/favorites - Get user favorites
 * @route POST /api/users/favorites - Add/remove a favorite
 */
export default async function handler(req, res) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    // GET request - Fetch user favorites
    if (req.method === 'GET') {
      const { clerkId } = req.query;
      
      if (!clerkId) {
        return res.status(400).json({
          success: false,
          message: 'Clerk ID is required'
        });
      }
      
      console.log('Fetching favorites for Clerk ID:', clerkId);
      
      // Fetch user favorites from our backend
      const response = await fetch(`${API_URL}/users/favorites?clerkId=${clerkId}`);
      const data = await response.json();
      
      return res.status(response.status).json(data);
    }
    
    // POST request - Add/remove a favorite
    if (req.method === 'POST') {
      const { clerkId, type, id, action } = req.body;
      
      if (!clerkId || !type || !id || !action) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: clerkId, type, id, or action'
        });
      }
      
      console.log('Processing favorite toggle:', { clerkId, type, id, action });
      
      if (!['add', 'remove'].includes(action)) {
        return res.status(400).json({
          success: false,
          message: 'Action must be either "add" or "remove"'
        });
      }
      
      // Send the request to our backend
      const response = await fetch(`${API_URL}/users/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clerkId,
          type,
          id,
          action
        })
      });
      
      const data = await response.json();
      console.log('Backend response:', data);
      return res.status(response.status).json(data);
    }
    
    // Method not allowed
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  } catch (error) {
    console.error('Error handling favorites:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}
