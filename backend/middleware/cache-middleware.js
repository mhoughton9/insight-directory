/**
 * Cache middleware
 * Adds appropriate cache control headers to responses
 * Only caches GET requests, with configurable duration
 */

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method === 'GET') {
      // Set cache headers
      res.set('Cache-Control', `public, max-age=${duration}`);
    } else {
      // For non-GET requests, set no-cache
      res.set('Cache-Control', 'no-store');
    }
    next();
  };
};

module.exports = cacheMiddleware;
