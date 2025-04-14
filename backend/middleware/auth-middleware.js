/**
 * Authentication middleware for validating Clerk JWT tokens
 */
const { createClerkClient } = require('@clerk/clerk-sdk-node');

// Initialize Clerk client
// Ensure CLERK_SECRET_KEY (preferred) or CLERK_API_KEY is in your .env
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY || process.env.CLERK_API_KEY });

const authMiddleware = async (req, res, next) => {
  try {
    // Clear previous console logs for cleaner debugging
    // console.log('Auth Middleware - Headers:', req.headers);
    // console.log('Auth Middleware - Query:', req.query);
    // console.log('Auth Middleware - Body:', req.body);

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Auth Middleware - No or invalid Authorization header');
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: {
          code: 'AUTH_REQUIRED',
          details: 'Bearer token is missing or malformed in Authorization header.'
        }
      });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    req.token = token; // Store the raw token if needed elsewhere

    console.log('Auth Middleware - Token found. Verifying...');

    // Verify the token using Clerk SDK
    const decodedToken = await clerkClient.verifyToken(token);

    if (!decodedToken || !decodedToken.sub) {
      console.error('Auth Middleware - Token verification failed or missing sub (userId)');
      return res.status(401).json({
        success: false,
        message: 'Authentication failed',
        error: {
          code: 'INVALID_TOKEN',
          details: 'Token is invalid or expired.'
        }
      });
    }

    // Extract the user ID from the verified token's 'sub' claim
    const userId = decodedToken.sub;

    // Attach user information directly to req.user or a custom property
    req.user = {                   // Set req.user instead
      id: userId                   // Use 'id' to match controller expectations
    };

    console.log(`Auth Middleware - Success. User ID from verified token: ${userId}. Set on req.user.id`);

    // Continue to the next middleware or controller
    return next();

  } catch (error) {
    console.error('Authentication error during token verification:', error);
    
    let statusCode = 401;
    let errorCode = 'AUTH_FAILED';
    let details = error.message || 'Unknown authentication error during verification';

    // Check for specific Clerk error types if needed (e.g., expired token)
    // You can inspect error.status or error.errors from Clerk's SDK
    if (error.status) statusCode = error.status;
    if (error.errors && error.errors[0] && error.errors[0].code) errorCode = error.errors[0].code;
    if (error.errors && error.errors[0] && error.errors[0].message) details = error.errors[0].message;

    return res.status(statusCode).json({
      success: false,
      message: 'Authentication failed',
      error: {
        code: errorCode,
        details: details
      }
    });
  }
};

module.exports = authMiddleware;
