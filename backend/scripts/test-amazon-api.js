/**
 * Test Amazon Product Advertising API
 * 
 * This script tests if we can successfully connect to Amazon's PA API
 * and search for a very popular book.
 */

require('dotenv').config();
const amazonPaapi = require('amazon-paapi');

// Configure Amazon PA API
const amazonConfig = {
  AccessKey: process.env.AMAZON_ACCESS_KEY,
  SecretKey: process.env.AMAZON_SECRET_KEY,
  PartnerTag: process.env.AMAZON_PARTNER_TAG,
  PartnerType: 'Associates',
  Marketplace: 'www.amazon.com' // Try different marketplace values
};

// Alternative configurations to try if the above doesn't work
const alternativeConfigs = [
  { Marketplace: 'US' },
  { Marketplace: 'com' },
  { Marketplace: 'Amazon.com' },
  { Marketplace: 'amazon.com' }
];

async function testAmazonApi() {
  try {
    console.log('Testing Amazon Product Advertising API...');
    console.log('Using configuration:');
    console.log(`- Partner Tag: ${amazonConfig.PartnerTag}`);
    console.log(`- Marketplace: ${amazonConfig.Marketplace}`);
    
    // Search for a very popular book that should definitely exist
    const searchQuery = 'Harry Potter';
    console.log(`\nSearching for: ${searchQuery}`);
    
    // Set up the search parameters
    const searchParams = {
      ...amazonConfig,
      Keywords: searchQuery,
      SearchIndex: 'Books',
      ItemCount: 1,
      Resources: [
        'ItemInfo.Title',
        'Images.Primary.Large'
      ]
    };
    
    // Search Amazon using the amazon-paapi package
    const response = await amazonPaapi.SearchItems(searchParams);
    
    // Check if we got results
    if (!response.SearchResult || !response.SearchResult.Items || response.SearchResult.Items.length === 0) {
      console.log('No results found on Amazon');
      return;
    }
    
    // Get the first result
    const book = response.SearchResult.Items[0];
    
    console.log('\nSuccess! Found book:');
    console.log(`- Title: ${book.ItemInfo.Title.DisplayValue}`);
    console.log(`- ASIN: ${book.ASIN}`);
    
    if (book.Images && book.Images.Primary && book.Images.Primary.Large) {
      console.log(`- Image URL: ${book.Images.Primary.Large.URL}`);
    }
    
    // Generate affiliate URL
    const affiliateUrl = `https://www.amazon.com/dp/${book.ASIN}?tag=${amazonConfig.PartnerTag}`;
    console.log(`- Affiliate URL: ${affiliateUrl}`);
    
  } catch (err) {
    console.error('Error testing Amazon API:');
    console.error(err.message || err);
    
    // Print more detailed error information
    if (err.response && err.response.body) {
      console.error('\nAPI Error Details:');
      console.error(err.response.body);
    }
    
    // Try alternative configurations if the main one failed
    if (alternativeConfigs.length > 0) {
      console.log('\nTrying alternative marketplace configurations...');
      
      for (const altConfig of alternativeConfigs) {
        try {
          console.log(`\nTrying Marketplace: ${altConfig.Marketplace}`);
          
          // Set up the search parameters with alternative config
          const searchParams = {
            ...amazonConfig,
            ...altConfig,
            Keywords: 'Harry Potter',
            SearchIndex: 'Books',
            ItemCount: 1,
            Resources: [
              'ItemInfo.Title',
              'Images.Primary.Large'
            ]
          };
          
          // Search Amazon using the amazon-paapi package
          const response = await amazonPaapi.SearchItems(searchParams);
          
          // If we get here without an error, it worked!
          console.log('Success with this configuration!');
          console.log(`Use Marketplace: ${altConfig.Marketplace}`);
          
          if (response.SearchResult && response.SearchResult.Items && response.SearchResult.Items.length > 0) {
            const book = response.SearchResult.Items[0];
            console.log(`Found: ${book.ItemInfo.Title.DisplayValue}`);
          }
          
          // Break out of the loop since we found a working configuration
          break;
          
        } catch (altErr) {
          console.log(`Failed with error: ${altErr.message || altErr}`);
        }
      }
    }
  }
}

// Run the test
testAmazonApi();
