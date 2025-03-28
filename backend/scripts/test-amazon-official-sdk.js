/**
 * Test Amazon Product Advertising API using the official SDK
 * 
 * This script tests if we can successfully connect to Amazon's PA API
 * using the official paapi5-nodejs-sdk package.
 */

require('dotenv').config();
const ProductAdvertisingAPIv1 = require('paapi5-nodejs-sdk');

// Set up the default client
const defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;

// Configure credentials
defaultClient.authentications['aws.auth.sigv4'].accessKey = process.env.AMAZON_ACCESS_KEY;
defaultClient.authentications['aws.auth.sigv4'].secretKey = process.env.AMAZON_SECRET_KEY;

// Set the Amazon region (required for SigV4)
defaultClient.defaultHeaders = {
  'Host': 'webservices.amazon.com'
};
defaultClient.region = 'us-east-1'; // North America region

// Create API instance
const api = new ProductAdvertisingAPIv1.DefaultApi();

async function testAmazonApi() {
  try {
    console.log('Testing Amazon Product Advertising API with official SDK...');
    console.log('Using configuration:');
    console.log(`- Partner Tag: ${process.env.AMAZON_PARTNER_TAG}`);
    console.log(`- Region: ${defaultClient.region}`);
    
    // Create search request
    const searchItemsRequest = new ProductAdvertisingAPIv1.SearchItemsRequest();
    
    // Set request parameters
    searchItemsRequest.PartnerTag = process.env.AMAZON_PARTNER_TAG;
    searchItemsRequest.PartnerType = 'Associates';
    searchItemsRequest.Keywords = 'Harry Potter';
    searchItemsRequest.SearchIndex = 'Books';
    searchItemsRequest.ItemCount = 1;
    
    // Set resources to retrieve
    searchItemsRequest.Resources = [
      'ItemInfo.Title',
      'Images.Primary.Large',
      'ItemInfo.ExternalIds'
    ];
    
    console.log('\nSending request to Amazon...');
    
    // Make the API call
    const data = await api.searchItems(searchItemsRequest);
    
    // Process the response
    if (data && data.SearchResult && data.SearchResult.Items && data.SearchResult.Items.length > 0) {
      const item = data.SearchResult.Items[0];
      
      console.log('\nSuccess! Found book:');
      console.log(`- Title: ${item.ItemInfo.Title.DisplayValue}`);
      console.log(`- ASIN: ${item.ASIN}`);
      
      if (item.Images && item.Images.Primary && item.Images.Primary.Large) {
        console.log(`- Image URL: ${item.Images.Primary.Large.URL}`);
      }
      
      // Generate affiliate URL
      const affiliateUrl = `https://www.amazon.com/dp/${item.ASIN}?tag=${process.env.AMAZON_PARTNER_TAG}`;
      console.log(`- Affiliate URL: ${affiliateUrl}`);
      
      // Get ISBN if available
      if (item.ItemInfo && item.ItemInfo.ExternalIds && item.ItemInfo.ExternalIds.ISBNs) {
        const isbns = item.ItemInfo.ExternalIds.ISBNs;
        if (isbns.DisplayValues && isbns.DisplayValues.length > 0) {
          console.log(`- ISBN: ${isbns.DisplayValues[0]}`);
        }
      }
    } else {
      console.log('No results found');
    }
    
  } catch (err) {
    console.error('Error testing Amazon API:');
    console.error(err.message || err);
    
    // Print more detailed error information if available
    if (err.response && err.response.text) {
      try {
        const errorDetails = JSON.parse(err.response.text);
        console.error('\nAPI Error Details:');
        console.error(JSON.stringify(errorDetails, null, 2));
      } catch (e) {
        console.error('\nRaw Error Response:');
        console.error(err.response.text);
      }
    }
  }
}

// Run the test
testAmazonApi();
