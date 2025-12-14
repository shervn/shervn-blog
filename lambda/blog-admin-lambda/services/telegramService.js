const axios = require('axios');
const config = require('../config/telegram');

// Send message to Telegram
async function sendMessage(chatId, text, replyToMessageId = null) {
  if (!config.API_URL) {
    throw new Error('Telegram API URL is not configured. Check TELEGRAM_BOT_TOKEN environment variable.');
  }
  
  if (!text || text.trim().length === 0) {
    console.warn('Attempted to send empty message');
    return;
  }
  
  try {
    const response = await axios.post(`${config.API_URL}/sendMessage`, {
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown',
      reply_to_message_id: replyToMessageId
    }, {
      timeout: 2000 // 2 second timeout
    });
    return response.data;
  } catch (err) {
    console.error('Error sending message:', {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
    throw err; // Re-throw so caller can handle it
  }
}

// Verify user is authorized
function isAuthorized(userId) {
  return userId.toString() === config.ALLOWED_USER_ID;
}

// Download file from Telegram
async function downloadFile(fileId) {
  try {
    // Get file path from Telegram
    const fileInfo = await axios.get(`${config.API_URL}/getFile?file_id=${fileId}`, {
      timeout: 2000 // 2 second timeout
    });
    const filePath = fileInfo.data.result.file_path;
    
    // Download file
    const fileUrl = `https://api.telegram.org/file/bot${config.BOT_TOKEN}/${filePath}`;
    const fileResponse = await axios.get(fileUrl, { 
      responseType: 'arraybuffer',
      timeout: 4000 // 4 second timeout for file download
    });
    
    return {
      buffer: Buffer.from(fileResponse.data),
      extension: filePath.split('.').pop() || 'jpg'
    };
  } catch (err) {
    console.error('Error downloading file:', err);
    throw err;
  }
}

module.exports = {
  sendMessage,
  isAuthorized,
  downloadFile
};

