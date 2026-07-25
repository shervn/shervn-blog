const s3Service = require('../services/s3Service');
const cloudfrontService = require('../services/cloudfrontService');
const config = require('../config/s3');

const COMMENTS_KEY = `${config.DATA_PREFIX}comments.txt`;

// Add comment - comments are stored as blank-line-separated blocks of plain
// text, so multi-line comments (typed as multi-line Telegram messages) keep
// their real line breaks instead of needing \n escapes.
async function addComment(commentText) {
  const raw = (await s3Service.readText(COMMENTS_KEY)) || '';
  const comments = raw.split(/\n\s*\n/).map((c) => c.trim()).filter(Boolean);
  comments.push(commentText);
  await s3Service.writeText(COMMENTS_KEY, comments.join('\n\n'));

  // Invalidate CloudFront cache
  await cloudfrontService.invalidateDataFiles();

  return `✅ Comment added!\n\n*Comment:* ${commentText}\n*Total comments:* ${comments.length}`;
}

module.exports = {
  addComment
};

