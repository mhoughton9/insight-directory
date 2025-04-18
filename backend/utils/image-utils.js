/**
 * Image Utilities
 * Handles image processing and Cloudinary uploads for various entity types
 */

const fetch = require('node-fetch');
const FormData = require('form-data');
const crypto = require('crypto');

// Cloudinary configuration
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

/**
 * Get the appropriate Cloudinary transformation based on entity type
 * @param {string} entityType - Type of entity (book, podcast, teacher, etc.)
 * @returns {string} - Cloudinary transformation string
 */
const getTransformationForEntityType = (entityType) => {
  // Normalize the entity type
  const normalizedType = entityType.toLowerCase().trim();
  
  // Base transformations that apply to all images
  // f_auto: automatically select the best file format (WebP for supported browsers)
  // q_auto:good: better quality/size balance
  const baseTransformations = 'f_auto,q_auto:good';
  
  let specificTransformations;
  
  switch (normalizedType) {
    case 'book':
      specificTransformations = 'c_fill,w_500,h_750'; // 2:3 aspect ratio for books
      break;
    
    case 'podcast':
    case 'audio':
    case 'app':
      specificTransformations = 'c_fill,w_500,h_500'; // 1:1 aspect ratio (square)
      break;
    
    case 'video':
    case 'videochannel':
      specificTransformations = 'c_fill,w_500,h_281'; // 16:9 aspect ratio
      break;
    
    case 'teacher':
      specificTransformations = 'c_fill,w_500,h_500'; // 1:1 aspect ratio (square)
      break;
    
    case 'tradition':
      specificTransformations = 'c_fill,w_500,h_500'; // 1:1 aspect ratio (square)
      break;
    
    case 'practice':
    case 'retreatcenter':
    case 'website':
    case 'blog':
    default:
      specificTransformations = 'c_fill,w_500,h_375'; // 4:3 aspect ratio (default)
      break;
  }
  
  return `${baseTransformations},${specificTransformations}`;
};

/**
 * Get the appropriate Cloudinary folder based on entity type
 * @param {string} entityType - Type of entity (book, podcast, teacher, etc.)
 * @returns {string} - Cloudinary folder name
 */
const getFolderForEntityType = (entityType) => {
  // Normalize the entity type
  const normalizedType = entityType.toLowerCase().trim();
  
  console.log(`getFolderForEntityType called with: '${entityType}', normalized to: '${normalizedType}'`)
  
  switch (normalizedType) {
    case 'book':
      return 'books';
    case 'podcast':
      return 'podcasts';
    case 'video':
    case 'videochannel':
      return 'videoChannels';
    case 'teacher':
      return 'teachers';
    case 'tradition':
      return 'traditions';
    case 'practice':
      return 'practices';
    case 'retreatcenter':
      return 'retreatCenters';
    case 'website':
      return 'websites';
    case 'blog':
      return 'blogs';
    case 'app':
      return 'apps';
    default:
      return 'misc';
  }
};

/**
 * Upload image to Cloudinary
 * @param {string} imageUrl - URL of the image to upload
 * @param {string} entityType - Type of entity (book, podcast, teacher, etc.)
 * @param {string} slug - Slug of the entity for naming
 * @returns {Promise<string|null>} - Cloudinary URL or null if failed
 */
const uploadImageToCloudinary = async (imageUrl, entityType, slug) => {
  console.log('CLOUDINARY UPLOAD ATTEMPT', { imageUrl, entityType, slug });
  
  try {
    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      console.error('Missing Cloudinary credentials. Please check your .env file.');
      console.error('Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
      return null;
    }
    
    console.log(`Starting Cloudinary upload process for ${entityType}:`, {
      slug,
      cloudName: CLOUD_NAME ? 'Set' : 'Missing',
      apiKey: API_KEY ? 'Set' : 'Missing',
      apiSecret: API_SECRET ? 'Set' : 'Missing'
    });
    
    // Generate a safe filename from the slug
    const fileName = slug.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    // Check if this is a Google encrypted image URL
    const isGoogleImage = imageUrl.includes('encrypted-tbn') && imageUrl.includes('gstatic.com');
    
    if (isGoogleImage) {
      console.log('Detected Google encrypted image URL - these cannot be directly uploaded to Cloudinary');
      console.log('Returning original URL without processing');
      return imageUrl; // Return the original URL without trying to upload
    }
    
    // Check if this is already a data URL
    const isDataUrl = imageUrl.startsWith('data:');
    let imageBuffer;
    
    if (!isDataUrl) {
      // Download the image
      console.log(`Downloading image from: ${imageUrl}`);
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
      }
      
      imageBuffer = await imageResponse.buffer();
      console.log(`Successfully downloaded image (${imageBuffer.length} bytes)`);
      
      // Log the content type for debugging
      const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
      console.log(`Image content type: ${contentType}`);
      
      // We'll use the raw buffer directly when creating the form data
      // No need to convert to base64 which can cause issues with Cloudinary
      console.log('Using raw image buffer for upload');
    } else {
      console.log('Image is already in data URL format - converting to buffer');
      // Convert data URL to buffer for consistent handling
      const base64Data = imageUrl.split(',')[1];
      imageBuffer = Buffer.from(base64Data, 'base64');
      console.log(`Converted data URL to buffer (${imageBuffer.length} bytes)`);
    }
    
    // Get appropriate transformation and folder
    const transformation = getTransformationForEntityType(entityType);
    const folder = getFolderForEntityType(entityType);
    
    console.log(`Using transformation: ${transformation}`);
    console.log(`Using folder: ${folder}`);
    
    // Create the public_id WITHOUT the folder prefix - Cloudinary will use the folder parameter
    const publicId = fileName;
    console.log(`Generated public_id: ${publicId} (will be placed in folder: ${folder})`);
    
    // Create an object with all parameters to be signed
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = {
      folder: folder,
      public_id: publicId,
      timestamp: timestamp.toString(),
      transformation: transformation
    };
    
    // Sort parameters alphabetically and create the string to sign
    const paramsSorted = Object.keys(paramsToSign)
      .sort()
      .map(key => `${key}=${paramsToSign[key]}`)
      .join('&');
    
    // Generate signature by appending API secret
    const signatureString = paramsSorted + API_SECRET;
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex');
    
    // Create form data for upload
    const formData = new FormData();
    
    // For Cloudinary's upload API, we need to use the raw buffer instead of base64
    // This approach is more reliable across different image types
    formData.append('file', imageBuffer, { filename: `${fileName}.jpg` });
    formData.append('api_key', API_KEY);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('public_id', publicId);
    formData.append('transformation', transformation);
    formData.append('folder', folder);
    
    // Log the form data for debugging
    console.log('Cloudinary upload form data:', {
      api_key: 'REDACTED',
      timestamp: timestamp.toString(),
      public_id: publicId,
      transformation,
      folder,
      // Don't log the file content or signature for security reasons
    });
    
    // Make the API request to Cloudinary
    console.log('Making API request to Cloudinary...');
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });
    
    // Check if the upload was successful
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Cloudinary API error:', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        response: errorText
      });
      throw new Error(`Cloudinary upload failed: ${uploadResponse.statusText}`);
    }
    
    // Parse the response
    const uploadResult = await uploadResponse.json();
    console.log('Cloudinary upload successful:', {
      publicId: uploadResult.public_id,
      format: uploadResult.format,
      version: uploadResult.version,
      url: uploadResult.url,
      secureUrl: uploadResult.secure_url,
      folder: uploadResult.folder || 'No folder in response',
      asset_folder: uploadResult.asset_folder || 'No asset_folder in response',
      path: uploadResult.path || 'No path in response'
    });
    
    // Return the secure URL
    return uploadResult.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
};

module.exports = {
  uploadImageToCloudinary,
  getTransformationForEntityType,
  getFolderForEntityType
};
