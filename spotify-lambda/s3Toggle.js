// s3Toggle.js
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'us-east-1' }); // adjust region if needed

const BUCKET = 'shervn.com'; // your bucket name
const KEY = 'toggleState.json';

async function readState() {
  try {
    const data = await s3.getObject({ Bucket: BUCKET, Key: KEY }).promise();
    const state = JSON.parse(data.Body.toString('utf-8'));
    return { state: state.state ?? false };
  } catch (err) {
    return { state: false };
  }
}

async function writeState(state) {
  await s3.putObject({
    Bucket: BUCKET,
    Key: KEY,
    Body: JSON.stringify(state),
    ContentType: 'application/json',
  }).promise();
}

module.exports = { readState, writeState };
