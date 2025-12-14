function getHelpMessage() {
  return `*Blog Admin Bot Commands:*\n\n` +
    `*/add type [title] date=[value] className=[value]* - Add post, image, or comment\n` +
    `   Post types: blog, review, noises\n` +
    `   Image types: postbox, train (send photo)\n` +
    `   Comment type: comment\n` +
    `   Example: /add blog [My Title] date=[تابستان ۰۳]\nPost body...\n` +
    `   Example: /add review [My Review Title] date=[تابستان ۰۳]\nReview body...\n` +
    `   Example: /add noises [My Noise Title] date=[تابستان ۰۳] soundCloudLink=[url] playlist=[true]\nDescription...\n` +
    `   Example: Send photo with /add postbox [Barcelona] [بارسِلونا]\n` +
    `   Example: Send photo with /add train [Tokyo] [توکیو]\n` +
    `   Example: /add comment\nComment text here...\n\n` +
    `*/get type uuid* - Get post details\n` +
    `   Example: /get blog abc123\n\n` +
    `*/delete type uuid* - Delete post or image\n` +
    `   Example: /delete blog abc123\n` +
    `   Example: /delete postbox xyz789\n\n` +
    `*/update type uuid field=[value]* - Update post or meta\n` +
    `   Post fields: title, date, description, order, body, soundCloudLink, playlist\n` +
    `   Meta fields: name, subtitle\n` +
    `   Example: /update blog abc123 title=[فصل پنجم] date=[فصل دهم]\n` +
    `   Example: /update blog abc123\nNew body text here... (updates body only)\n` +
    `   Example: Send photo with /update blog abc123 (updates image only)\n` +
    `   Example: /update meta name=[New Name]\n` +
    `   Example: /update meta subtitle=[New Subtitle]\n\n` +
    `*/toggle* - Toggle state\n\n` +
    `*/help* - Show this help\n\n` +
    `*Note:* Use [] for values with spaces. Attach photo to /add or /update to include image.`;
}

module.exports = {
  getHelpMessage
};