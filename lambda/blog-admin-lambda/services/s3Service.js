const AWS = require('aws-sdk');
const config = require('../config/s3');

const s3 = new AWS.S3({ 
  region: config.REGION,
  httpOptions: {
    timeout: 3000 // 3 second timeout for S3 operations
  },
  maxRetries: 0 // Don't retry, fail fast
});

// Read JSON from S3
async function readJSON(fileName, defaultValue = []) {
  try {
    const params = {
      Bucket: config.BUCKET,
      Key: `${config.DATA_PREFIX}${fileName}.json`
    };
    const data = await s3.getObject(params).promise();
    return JSON.parse(data.Body.toString('utf-8'));
  } catch (err) {
    if (err.code === 'NoSuchKey') {
      return defaultValue;
    }
    throw err;
  }
}

// Write JSON to S3
async function writeJSON(fileName, data) {
  const params = {
    Bucket: config.BUCKET,
    Key: `${config.DATA_PREFIX}${fileName}.json`,
    Body: JSON.stringify(data, null, 2),
    ContentType: 'application/json'
  };
  await s3.putObject(params).promise();
}

// Upload image to S3
async function uploadImageToS3(buffer, folder, fileName) {
  const key = `${config.IMAGES_PREFIX}${folder}/${fileName}`;
  const ext = fileName.split('.').pop().toLowerCase();
  const contentTypeMap = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp'
  };
  
  const params = {
    Bucket: config.BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentTypeMap[ext] || 'image/jpeg'
  };
  
  await s3.putObject(params).promise();
  // Return just the filename for posts (getImagePath adds folder prefix)
  // Return full path for postbox/train (getS3Path expects full path)
  return folder === 'Misc' ? fileName : `/${key}`;
}

module.exports = {
  readJSON,
  writeJSON,
  uploadImageToS3
};

