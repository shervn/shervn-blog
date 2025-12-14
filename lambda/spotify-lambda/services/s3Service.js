const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const config = require('../config/s3');

const s3Client = new S3Client({ region: config.REGION });

module.exports = {
  // S3 service functions can be added here if needed in the future
};

