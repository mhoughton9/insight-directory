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
  
  switch (normalizedType) {
    case 'book':
      return 'c_fill,w_500,h_750,q_auto'; // 2:3 aspect ratio for books
    
    case 'podcast':
    case 'audio':
    case 'app':
      return 'c_fill,w_500,h_500,q_auto'; // 1:1 aspect ratio (square)
    
    case 'video':
    case 'videochannel':
      return 'c_fill,w_500,h_281,q_auto'; // 16:9 aspect ratio
    
    case 'teacher':
      return 'c_fill,w_500,h_500,q_auto'; // 1:1 aspect ratio (square)
    
    case 'tradition':
      return 'c_fill,w_500,h_500,q_auto'; // 1:1 aspect ratio (square)
    
    case 'practice':
    case 'retreatcenter':
    case 'website':
    case 'blog':
    default:
      return 'c_fill,w_500,h_375,q_auto'; // 4:3 aspect ratio (default)
  }
};

/**
 * Get the appropriate Cloudinary folder based on entity type
 * @param {string} entityType - Type of entity (book, podcast, teacher, etc.)
 * @returns {string} - Cloudinary folder name
 */
const getFolderForEntityType = (entityType) => {
  // Normalize the entity type
  const normalizedType = entityType.toLowerCase().trim();
  
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
      
      // Convert to data URL
      imageUrl = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
      console.log('Converted external URL to data URL format');
    } else {
      console.log('Image is already in data URL format');
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
    formData.append('file', imageUrl.split(',')[1], { filename: `${fileName}.jpg` });
    formData.append('api_key', API_KEY);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('public_id', publicId);
    formData.append('transformation', transformation);
    formData.append('folder', folder);
    
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
      secureUrl: uploadResult.secure_url
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
