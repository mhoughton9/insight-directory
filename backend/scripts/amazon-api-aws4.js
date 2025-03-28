/**
 * Amazon Product Advertising API Client using AWS4 Authentication
 * 
 * This script implements proper AWS Signature Version 4 authentication
 * based on the example from Amazon's Scratchpad.
 */

require('dotenv').config();
const aws4 = require('aws4');
const https = require('https');

// Configuration
const config = {
  host: 'webservices.amazon.com',
  path: '/paapi5/searchitems',
  region: 'us-east-1',
  service: 'ProductAdvertisingAPI',
  accessKey: process.env.AMAZON_ACCESS_KEY,
  secretKey: process.env.AMAZON_SECRET_KEY,
  partnerTag: process.env.AMAZON_PARTNER_TAG
};

/**
 * Sleep for a specified number of milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Search for a book on Amazon
 * @param {string} title - Book title
 * @param {string} author - Book author (optional)
 * @returns {Promise<Object|null>} - Book data or null if not found
 */
async function searchAmazonForBook(title, author = '') {
  // Create search query
  let keywords = title;
  if (author) {
    keywords += ` ${author}`;
  }
  
  console.log(`Searching Amazon for: ${keywords}`);
  
  // Create request payload
  const payload = JSON.stringify({
    Keywords: keywords,
    Resources: [
      'Images.Primary.Large',
      'ItemInfo.ByLineInfo',
      'ItemInfo.ExternalIds',
      'ItemInfo.Title'
    ],
    SearchIndex: 'Books',
    ItemCount: 1,
    PartnerTag: config.partnerTag,
    PartnerType: 'Associates',
    Marketplace: 'www.amazon.com'
  });
  
  // Set up request options with proper headers
  const options = {
    host: config.host,
    path: config.path,
    region: config.region,
    service: config.service,
    method: 'POST',
    body: payload,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
      'Content-Encoding': 'amz-1.0'
    }
  };
  
  // Sign the request with AWS4
  const signedRequest = aws4.sign(options, {
    accessKeyId: config.accessKey,
    secretAccessKey: config.secretKey
  });
  
  // Implement retry logic with exponential backoff
  const maxRetries = 3;
  let retryCount = 0;
  let backoffTime = 1000; // Start with 1 second
  
  while (retryCount <= maxRetries) {
    try {
      // Make the request
      const response = await makeRequest(signedRequest);
      
      // Parse the response
      const data = JSON.parse(response);
      
      // Check for errors
      if (data.__type && data.__type.includes('Exception')) {
        if (data.__type.includes('TooManyRequestsException')) {
          console.log(`Rate limited! Retry ${retryCount + 1} of ${maxRetries}`);
          retryCount++;
          
          if (retryCount <= maxRetries) {
            console.log(`Waiting ${backoffTime/1000} seconds before retrying...`);
            await sleep(backoffTime);
            backoffTime *= 2; // Exponential backoff
            continue;
          } else {
            console.log('Maximum retries reached. Giving up.');
            return null;
          }
        } else {
          // Other error
          console.error(`Amazon API Error: ${data.__type}`);
          if (data.Errors && data.Errors.length > 0) {
            console.error(`Error message: ${data.Errors[0].Message}`);
          }
          return null;
        }
      }
      
      // Check if we got results
      if (!data.SearchResult || !data.SearchResult.Items || data.SearchResult.Items.length === 0) {
        console.log('No results found on Amazon');
        return null;
      }
      
      // Get the best match (first result is usually best)
      const item = data.SearchResult.Items[0];
      
      // Extract the data we need
      const imageUrl = item.Images && item.Images.Primary && item.Images.Primary.Large
        ? item.Images.Primary.Large.URL
        : null;
      
      // Get ISBN if available
      let isbn = null;
      if (item.ItemInfo && item.ItemInfo.ExternalIds && item.ItemInfo.ExternalIds.ISBNs) {
        const isbns = item.ItemInfo.ExternalIds.ISBNs;
        if (isbns.DisplayValues && isbns.DisplayValues.length > 0) {
          isbn = isbns.DisplayValues[0];
        }
      }
      
      // Get the affiliate URL
      const asin = item.ASIN;
      const affiliateUrl = `https://www.amazon.com/dp/${asin}?tag=${config.partnerTag}`;
      
      console.log(`Found book on Amazon: ${item.ItemInfo.Title.DisplayValue}`);
      if (imageUrl) console.log(`Image URL: ${imageUrl}`);
      if (isbn) console.log(`ISBN: ${isbn}`);
      console.log(`Affiliate URL: ${affiliateUrl}`);
      
      return {
        imageUrl,
        isbn,
        affiliateUrl
      };
      
    } catch (err) {
      console.error('Error making request to Amazon API:', err.message);
      retryCount++;
      
      if (retryCount <= maxRetries) {
        console.log(`Retry ${retryCount} of ${maxRetries}. Waiting ${backoffTime/1000} seconds...`);
        await sleep(backoffTime);
        backoffTime *= 2; // Exponential backoff
      } else {
        console.log('Maximum retries reached. Giving up.');
        return null;
      }
    }
  }
  
  return null;
}

/**
 * Make an HTTPS request
 * @param {Object} options - Request options
 * @returns {Promise<string>} - Response body
 */
function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP Error: ${res.statusCode} ${data}`));
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

/**
 * Test the Amazon API with a well-known book
 */
async function testAmazonApi() {
  try {
    console.log('Testing Amazon Product Advertising API with AWS4 authentication...');
    console.log(`Partner Tag: ${config.partnerTag}`);
    console.log(`Region: ${config.region}`);
    
    // Test with a very popular book
    const result = await searchAmazonForBook('Harry Potter');
    
    if (result) {
      console.log('\nAPI test successful!');
    } else {
      console.log('\nAPI test failed.');
    }
    
  } catch (err) {
    console.error('Error testing Amazon API:', err.message);
  }
}

// Run the test
testAmazonApi();
