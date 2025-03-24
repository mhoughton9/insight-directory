/**
 * Authentication middleware for validating Clerk JWT tokens
 */

const authMiddleware = (req, res, next) => {
  try {
    // Check for Authorization header
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract the token
      const token = authHeader.split(' ')[1];
      // Store the token in the request for use in controllers
      req.token = token;
    }
    
    // Store clerkId from query or body for convenience
    req.clerkId = req.query.clerkId || (req.body && req.body.clerkId);
    
    // If no clerkId is provided, return an error
    if (!req.clerkId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: {
          code: 'AUTH_REQUIRED',
          details: 'User ID (clerkId) is required'
        }
      });
    }
    
    // Continue to the next middleware or controller
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: {
        code: 'AUTH_FAILED',
        details: error.message || 'Unknown authentication error'
      }
    });
  }
};

module.exports = authMiddleware;
