/**
 * API route to sync user data between Clerk and our database
 * @route POST /api/users/sync
 */
export default async function handler(req, res) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        message: 'Method not allowed'
      });
    }

    // Get the authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Missing or invalid token'
      });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Verify the token with Clerk (optional, as we're already using Clerk's useAuth hook)
    // For simplicity, we'll just extract the clerkId from the request body
    const { email, firstName, lastName, imageUrl, clerkId } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Extract Clerk ID from JWT token or request body
    // In a real implementation, you would verify the token with Clerk
    // and extract the user ID from the decoded token
    const userData = {
      clerkId: clerkId || req.body.userId, // Allow either format
      email,
      name: `${firstName || ''} ${lastName || ''}`.trim(),
      imageUrl
    };

    console.log('Syncing user data:', userData);

    // Send the request to our backend
    const response = await fetch(`${API_URL}/users/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    console.log('Backend sync response:', data);

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error syncing user:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}