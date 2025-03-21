/**
 * API route for tradition operations
 * @route GET /api/traditions - Get traditions with optional filtering
 */
export default async function handler(req, res) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  try {
    // Handle GET request - fetch traditions
    if (req.method === 'GET') {
      // Forward any query parameters to the backend
      const queryString = new URLSearchParams(req.query).toString();
      const response = await fetch(`${API_URL}/traditions${queryString ? `?${queryString}` : ''}`);
      const data = await response.json();
      
      return res.status(response.status).json(data);
    }
    
    // Handle unsupported methods
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  } catch (error) {
    console.error('Error in traditions API route:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}