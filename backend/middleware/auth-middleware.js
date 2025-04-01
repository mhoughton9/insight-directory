/**
 * Authentication middleware for validating Clerk JWT tokens
 */

const authMiddleware = (req, res, next) => {
  try {
    console.log('Auth Middleware - Headers:', req.headers);
    console.log('Auth Middleware - Query:', req.query);
    console.log('Auth Middleware - Body:', req.body);
    
    // Check for Authorization header
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract the token
      const token = authHeader.split(' ')[1];
      // Store the token in the request for use in controllers
      req.token = token;
      
      console.log('Auth Middleware - Token found in Authorization header');
      
      // For now, we'll assume the token is valid
      // In a production environment, you would verify the token with Clerk's SDK
      // and extract the user ID from the verified token
      
      // Set up auth object with userId
      req.auth = {
        userId: req.query.clerkId || (req.body && req.body.clerkId)
      };
      
      console.log('Auth Middleware - Auth object set with userId:', req.auth.userId);
      
      // Continue to the next middleware or controller
      return next();
    }
    
    // If no Authorization header, check for clerkId in query or body
    const clerkId = req.query.clerkId || (req.body && req.body.clerkId);
    
    if (clerkId) {
      console.log('Auth Middleware - ClerkId found in query or body:', clerkId);
      
      // Set up auth object with userId
      req.auth = {
        userId: clerkId
      };
      
      // Continue to the next middleware or controller
      return next();
    }
    
    console.log('Auth Middleware - No authentication found');
    
    // If no token or clerkId is provided, return an error
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      error: {
        code: 'AUTH_REQUIRED',
        details: 'Valid authentication token or User ID (clerkId) is required'
      }
    });
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
