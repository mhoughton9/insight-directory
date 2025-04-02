/**
 * Test script for Cloudinary upload functionality
 * Run with: node scripts/test-cloudinary.js
 */

require('dotenv').config();
const fetch = require('node-fetch');
const FormData = require('form-data');
const crypto = require('crypto');

// Log environment variables (without exposing secrets)
console.log('Environment check:', {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing'
});

// Cloudinary configuration
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Test image URL (direct from Unsplash)
const TEST_IMAGE_URL = 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=500';

/**
 * Upload image to Cloudinary using data URL approach
 */
async function uploadImageToCloudinary(imageUrl) {
  console.log('Starting test upload with URL:', imageUrl);
  
  try {
    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      console.error('Missing Cloudinary credentials. Please check your .env file.');
      return null;
    }
    
    // Download the image
    console.log('Downloading image...');
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    
    const imageBuffer = await imageResponse.buffer();
    console.log(`Successfully downloaded image (${imageBuffer.length} bytes)`);
    
    // Convert to data URL
    const dataUrl = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    console.log('Converted to data URL format');
    
    // Set folder and filename
    const folder = 'teachers';
    const fileName = `test_teacher_${Date.now()}`;
    console.log(`Using folder: ${folder}`);
    console.log(`Using filename: ${fileName}`);
    
    // Prepare the form data
    console.log('Preparing form data for upload...');
    const formData = new FormData();
    
    // Use the data URL as file
    formData.append('file', dataUrl);
    formData.append('api_key', API_KEY);
    
    // Generate timestamp
    const timestamp = Math.floor(Date.now() / 1000).toString();
    formData.append('timestamp', timestamp);
    
    // Add folder and public_id
    formData.append('folder', folder);
    formData.append('public_id', fileName);
    
    // Add transformation for teachers (square)
    const transformation = 'c_fill,w_500,h_500,q_auto';
    formData.append('transformation', transformation);
    
    // Generate the signature
    const paramsToSign = {
      folder: folder,
      public_id: fileName,
      timestamp: timestamp,
      transformation: transformation
    };
    
    // Sort parameters alphabetically and create the string to sign
    const paramsSorted = Object.keys(paramsToSign)
      .sort()
      .map(key => `${key}=${paramsToSign[key]}`)
      .join('&');
    
    // Add the API secret and generate the SHA1 signature
    const stringToSign = paramsSorted + API_SECRET;
    const signature = crypto
      .createHash('sha1')
      .update(stringToSign)
      .digest('hex');
    
    formData.append('signature', signature);
    
    // Make the API request to Cloudinary
    console.log('Sending upload request to Cloudinary...');
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Cloudinary API error:', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        response: errorText
      });
      throw new Error(`Cloudinary upload failed: ${uploadResponse.statusText}`);
    }
    
    const result = await uploadResponse.json();
    console.log('Cloudinary upload successful:', {
      publicId: result.public_id,
      folder: result.folder,
      url: result.url,
      secureUrl: result.secure_url
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
}

// Execute the test
(async () => {
  console.log('=== CLOUDINARY UPLOAD TEST ===');
  const result = await uploadImageToCloudinary(TEST_IMAGE_URL);
  
  if (result) {
    console.log('✅ TEST PASSED: Image uploaded successfully');
    console.log('Cloudinary URL:', result);
  } else {
    console.log('❌ TEST FAILED: Could not upload image to Cloudinary');
  }
  console.log('=== TEST COMPLETE ===');
})();
