const s3Service = require('../services/s3Service');
const cloudfrontService = require('../services/cloudfrontService');

// Add comment
async function addComment(commentText) {
  const comments = await s3Service.readJSON('comments');
  comments.push(commentText);
  await s3Service.writeJSON('comments', comments);
  
  // Invalidate CloudFront cache
  await cloudfrontService.invalidateDataFiles();
  
  return `✅ Comment added!\n\n*Comment:* ${commentText}\n*Total comments:* ${comments.length}`;
}

module.exports = {
  addComment
};

