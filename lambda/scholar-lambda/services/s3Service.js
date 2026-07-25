const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const config = require('../config/s3');

const s3Client = new S3Client({ region: config.REGION });

const DATA_PREFIX = 'data/';

// This is a best-effort cache read: S3 returns AccessDenied (not NoSuchKey) for
// a missing object when the caller lacks s3:ListBucket, so any read failure here
// is treated as a cache miss rather than a hard error.
async function readJSON(fileName, defaultValue = null) {
  try {
    const command = new GetObjectCommand({
      Bucket: config.BUCKET,
      Key: `${DATA_PREFIX}${fileName}.json`
    });
    const response = await s3Client.send(command);
    const body = await response.Body.transformToString();
    return JSON.parse(body);
  } catch (err) {
    console.error('Cache read failed, treating as cache miss:', err.name, err.message);
    return defaultValue;
  }
}

async function writeJSON(fileName, data) {
  const command = new PutObjectCommand({
    Bucket: config.BUCKET,
    Key: `${DATA_PREFIX}${fileName}.json`,
    Body: JSON.stringify(data),
    ContentType: 'application/json',
  });
  await s3Client.send(command);
}

module.exports = {
  readJSON,
  writeJSON,
};
