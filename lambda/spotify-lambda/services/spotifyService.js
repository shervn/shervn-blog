const axios = require('axios');
const querystring = require('querystring');
const config = require('../config/spotify');

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const response = await axios.post(
    config.TOKEN_URL,
    querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: config.REFRESH_TOKEN,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' + Buffer.from(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`).toString('base64'),
      },
    }
  );

  cachedToken = response.data.access_token;
  tokenExpiresAt = now + response.data.expires_in * 1000;
  return cachedToken;
}

async function getRecentlyPlayed(limit = 1) {
  const token = await getAccessToken();
  const response = await axios.get(
    `${config.API_BASE_URL}/me/player/recently-played?limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

async function getTopArtists(limit = 1, timeRange = 'long_term') {
  const token = await getAccessToken();
  const response = await axios.get(
    `${config.API_BASE_URL}/me/top/artists?limit=${limit}&time_range=${timeRange}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

async function getTopTracks(limit = 1, timeRange = 'short_term') {
  const token = await getAccessToken();
  const response = await axios.get(
    `${config.API_BASE_URL}/me/top/tracks?limit=${limit}&time_range=${timeRange}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

async function getCurrentlyPlaying() {
  const token = await getAccessToken();
  const response = await axios.get(
    `${config.API_BASE_URL}/me/player/currently-playing`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

async function controlPlayer(action) {
  const token = await getAccessToken();
  const method = action === 'next' || action === 'previous' ? 'post' : 'put';
  
  const response = await axios({
    method,
    url: `${config.API_BASE_URL}/me/player/${action}`,
    headers: { Authorization: `Bearer ${token}` },
    data: null,
  });
  
  return response.data || { success: true };
}

async function getPlaylist(playlistId) {
  const token = await getAccessToken();
  const response = await axios.get(
    `${config.API_BASE_URL}/playlists/${playlistId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

module.exports = {
  getAccessToken,
  getRecentlyPlayed,
  getTopArtists,
  getTopTracks,
  getCurrentlyPlaying,
  controlPlayer,
  getPlaylist,
};

