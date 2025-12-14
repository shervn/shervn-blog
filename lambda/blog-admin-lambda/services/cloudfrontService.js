const AWS = require('aws-sdk');
const config = require('../config/cloudfront');

const cloudfront = new AWS.CloudFront({
  region: config.REGION
});

// Invalidate CloudFront cache for specific paths
async function invalidateCache(paths = ['/*']) {
  // Skip if distribution ID is not configured
  if (!config.DISTRIBUTION_ID) {
    console.log('CloudFront distribution ID not configured, skipping cache invalidation');
    return null;
  }
  
  try {
    const params = {
      DistributionId: config.DISTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: `invalidation-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        Paths: {
          Quantity: paths.length,
          Items: paths
        }
      }
    };
    
    const result = await cloudfront.createInvalidation(params).promise();
    console.log(`CloudFront invalidation created: ${result.Invalidation.Id}`);
    return result;
  } catch (err) {
    console.error('Error invalidating CloudFront cache:', err.message);
    // Don't throw - invalidation failure shouldn't break the operation
    return null;
  }
}

// Invalidate all data files (posts, comments, images metadata)
async function invalidateDataFiles() {
  return invalidateCache([
    '/data/*.json',
    '/*' // Also invalidate root to ensure index pages refresh
  ]);
}

module.exports = {
  invalidateCache,
  invalidateDataFiles
};

