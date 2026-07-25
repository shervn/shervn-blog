const AWS = require('aws-sdk');

const lambda = new AWS.Lambda({ region: 'us-east-1' });
const REFRESH_FUNCTION_NAME = 'scholar-lambda-dev-refresh';

// Fires the (slow, ~30-40s) Scholar re-scrape asynchronously via a direct
// Lambda invoke, so the Telegram webhook can reply immediately instead of
// waiting on it (and without needing any public HTTP endpoint for it).
async function refreshPapers() {
  try {
    await lambda.invoke({
      FunctionName: REFRESH_FUNCTION_NAME,
      InvocationType: 'Event',
    }).promise();

    return '🎓 Refreshing your Scholar publications now, should be live in under a minute.';
  } catch (err) {
    console.error('Error triggering scholar refresh:', err.message);
    return `❌ Error: ${err.message}`;
  }
}

module.exports = {
  refreshPapers
};
