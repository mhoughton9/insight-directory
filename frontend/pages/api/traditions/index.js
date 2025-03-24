/**
 * API route for tradition operations
 * @route GET /api/traditions - Get traditions with optional filtering
 */
export default async function handler(req, res) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  try {
    // Handle GET request - fetch traditions
    if (req.method === 'GET') {
      let url = `${API_URL}/traditions`;
      const queryParams = new URLSearchParams();
      
      // Handle special case for IDs parameter
      if (req.query.ids) {
        // Make sure ids parameter is properly formatted for the backend
        queryParams.append('ids', req.query.ids);
      }
      
      // Add all other query parameters
      Object.entries(req.query).forEach(([key, value]) => {
        if (key !== 'ids') { // Skip ids as we already handled it
          queryParams.append(key, value);
        }
      });
      
      // Append query string if we have parameters
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      console.log('Fetching traditions from:', url);
      const response = await fetch(url);
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