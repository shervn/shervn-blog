const config = require('../config/spotify');

// Build the Spotify re-authorization link (Spotify requires a real browser to
// complete the OAuth consent screen, so the bot hands back a link to tap rather
// than performing the flow itself).
function getReauthLink() {
  if (!config.LAMBDA_URL || !config.AUTH_SECRET) {
    return '❌ SPOTIFY_LAMBDA_URL and/or SPOTIFY_AUTH_SECRET are not configured on this bot.';
  }

  const loginUrl = `${config.LAMBDA_URL.replace(/\/$/, '')}/auth/login?secret=${encodeURIComponent(config.AUTH_SECRET)}`;

  return `🎵 *Spotify Re-authorization*\n\nTap this link, approve on Spotify, and the new refresh token will be saved automatically:\n\n${loginUrl}`;
}

module.exports = {
  getReauthLink
};
