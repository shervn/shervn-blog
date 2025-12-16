// Base API URL for all Lambda functions
export const BASE_API = 'https://68hlb8id96.execute-api.us-east-1.amazonaws.com/dev';

/**
 * Get toggle state
 */
export const getToggleState = async () => {
  try {
    const response = await fetch(`${BASE_API}/toggle-state`);
    return await response.json();
  } catch (err) {
    console.error('Error fetching toggle state:', err);
    return { state: true };
  }
};

/**
 * Get recent Spotify tracks
 * @param {number} limit - Number of tracks to fetch (default: 1)
 */
export const getRecentTracks = async (limit = 1) => {
  try {
    const response = await fetch(`${BASE_API}/recent-tracks?limit=${limit}`);
    return await response.json();
  } catch (err) {
    console.error('Error fetching recent tracks:', err);
    return [];
  }
};

/**
 * Get currently playing track
 */
export const getCurrentlyPlaying = async () => {
  try {
    const response = await fetch(`${BASE_API}/currently-playing`);
    const data = await response.json();
    return data?.message === 'No track currently playing' ? null : data;
  } catch (err) {
    console.error('Error fetching currently playing:', err);
    return null;
  }
};

/**
 * Control Spotify player (play, pause, next, previous)
 * @param {string} action - Action to perform: 'play', 'pause', 'next', 'previous'
 */
export const controlPlayer = async (action) => {
  try {
    await fetch(`${BASE_API}/player?action=${action}`);
    return await getCurrentlyPlaying();
  } catch (err) {
    console.error('Error controlling player:', err);
    return null;
  }
};

/**
 * Get top songs
 * @param {number} limit - Number of songs to fetch (default: 5)
 * @param {string} timeRange - Time range: 'short_term', 'medium_term', 'long_term' (default: 'short_term')
 */
export const getTopSongs = async (limit = 5, timeRange = 'short_term') => {
  try {
    const response = await fetch(`${BASE_API}/top-songs?limit=${limit}&time_range=${timeRange}`);
    return await response.json();
  } catch (err) {
    console.error('Error fetching top songs:', err);
    return [];
  }
};

/**
 * Get top artists
 * @param {number} limit - Number of artists to fetch (default: 5)
 */
export const getTopArtists = async (limit = 5) => {
  try {
    const response = await fetch(`${BASE_API}/top-artists?limit=${limit}`);
    return await response.json();
  } catch (err) {
    console.error('Error fetching top artists:', err);
    return [];
  }
};

/**
 * Get Spotify playlist
 */
export const getPlaylist = async () => {
  try {
    const response = await fetch(`${BASE_API}/playlist`);
    return await response.json();
  } catch (err) {
    console.error('Error fetching playlist:', err);
    return null;
  }
};


