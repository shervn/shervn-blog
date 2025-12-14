const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ALLOWED_USER_ID = process.env.ALLOWED_USER_ID;

if (!TELEGRAM_BOT_TOKEN || !ALLOWED_USER_ID) {
  console.error('Missing required environment variables: TELEGRAM_BOT_TOKEN and/or ALLOWED_USER_ID');
  console.error('TELEGRAM_BOT_TOKEN:', TELEGRAM_BOT_TOKEN ? 'SET' : 'MISSING');
  console.error('ALLOWED_USER_ID:', ALLOWED_USER_ID ? 'SET' : 'MISSING');
}

module.exports = {
  BOT_TOKEN: TELEGRAM_BOT_TOKEN,
  API_URL: TELEGRAM_BOT_TOKEN ? `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}` : null,
  ALLOWED_USER_ID: ALLOWED_USER_ID
};

