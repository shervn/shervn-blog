const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const config = require('../config/s3');

const s3Client = new S3Client({ region: config.REGION });

const DATA_PREFIX = 'data/';

async function readJSON(fileName, defaultValue = { state: false }) {
  try {
    const command = new GetObjectCommand({
      Bucket: config.BUCKET,
      Key: `${DATA_PREFIX}${fileName}.json`
    });
    const response = await s3Client.send(command);
    const body = await response.Body.transformToString();
    return JSON.parse(body);
  } catch (err) {
    if (err.name === 'NoSuchKey') {
      return defaultValue;
  }
    throw err;
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

