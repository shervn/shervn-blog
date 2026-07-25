const axios = require('axios');
const querystring = require('querystring');
const config = require('../config/spotify');
const s3Service = require('./s3Service');

const AUTH_FILE = 'spotifyAuth';

let cachedToken = null;
let tokenExpiresAt = 0;
let currentRefreshToken = null;
let refreshTokenLoaded = false;

// Spotify persists the latest refresh token in S3 (rather than trusting only the
// deploy-time env var) because Spotify can rotate refresh tokens on any /api/token
// call, and now hard-expires them 6 months after authorization regardless.
async function loadRefreshToken() {
  if (refreshTokenLoaded) {
    return currentRefreshToken;
  }
  const stored = await s3Service.readJSON(AUTH_FILE, null);
  currentRefreshToken = (stored && stored.refresh_token) || config.REFRESH_TOKEN;
  refreshTokenLoaded = true;
  return currentRefreshToken;
}

async function saveRefreshToken(refreshToken) {
  currentRefreshToken = refreshToken;
  refreshTokenLoaded = true;
  await s3Service.writeJSON(AUTH_FILE, {
    refresh_token: refreshToken,
    updated_at: new Date().toISOString(),
  });
}

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const refreshToken = await loadRefreshToken();

  let response;
  try {
    response = await axios.post(
      config.TOKEN_URL,
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' + Buffer.from(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`).toString('base64'),
        },
      }
    );
  } catch (err) {
    if (err.response?.status === 400 && err.response.data?.error === 'invalid_grant') {
      throw new Error(
        'Spotify refresh token is invalid or expired (Spotify expires refresh tokens 6 months after authorization). Re-authorize via GET /auth/login.'
      );
    }
    throw err;
  }

  cachedToken = response.data.access_token;
  tokenExpiresAt = now + response.data.expires_in * 1000;

  // Spotify may rotate the refresh token on any refresh call; save it so it survives cold starts.
  if (response.data.refresh_token && response.data.refresh_token !== refreshToken) {
    await saveRefreshToken(response.data.refresh_token);
  }

  return cachedToken;
}

async function getRecentlyPlayed(limit = 1) {
  const token = await getAccessToken();
  const response = await axios.get(
    `${config.API_BASE_URL}/me/player/recently-played?limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  
  // Make results unique by track ID
  if (response.data && response.data.items) {
    const seenTrackIds = new Set();
    const uniqueItems = response.data.items.filter((item) => {
      const trackId = item.track?.id;
      if (!trackId || seenTrackIds.has(trackId)) {
        return false;
      }
      seenTrackIds.add(trackId);
      return true;
    });
    
    return {
      ...response.data,
      items: uniqueItems
    };
  }
  
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

async function getUserPlaylists() {
  const token = await getAccessToken();
  let items = [];
  let url = `${config.API_BASE_URL}/me/playlists?limit=50`;

  while (url) {
    const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
    items = items.concat(response.data.items);
    url = response.data.next;
  }

  return items;
}

function mapPlaylistTracks(playlistData) {
  return playlistData.tracks.items
    .filter((item) => item.track)
    .map((item) => ({
      song: item.track.name,
      artist: item.track.artists.map((a) => a.name).join('⨯'),
      url: item.track.external_urls.spotify,
      albumArt: item.track.album.images[0]?.url || null,
      albumName: item.track.album.name,
    }));
}

async function getTrack(trackId) {
  const token = await getAccessToken();
  const response = await axios.get(
    `${config.API_BASE_URL}/tracks/${trackId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

module.exports = {
  getAccessToken,
  saveRefreshToken,
  getRecentlyPlayed,
  getTopArtists,
  getTopTracks,
  getCurrentlyPlaying,
  controlPlayer,
  getPlaylist,
  getUserPlaylists,
  mapPlaylistTracks,
  getTrack,
};

