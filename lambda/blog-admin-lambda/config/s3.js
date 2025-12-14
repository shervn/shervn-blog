module.exports = {
  BUCKET: process.env.S3_BUCKET || 'shervn-blog-media',
  REGION: process.env.AWS_REGION || 'us-east-1',
  DATA_PREFIX: 'data/',
  IMAGES_PREFIX: 'images/'
};

