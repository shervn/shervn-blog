const s3Service = require('../services/s3Service');

// Add comment
async function addComment(commentText) {
  const comments = await s3Service.readJSON('comments');
  comments.push(commentText);
  await s3Service.writeJSON('comments', comments);
  
  return `✅ Comment added!\n\n*Comment:* ${commentText}\n*Total comments:* ${comments.length}`;
}

module.exports = {
  addComment
};

