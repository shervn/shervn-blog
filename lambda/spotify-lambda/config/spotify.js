module.exports = {
  CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN,
  PLAYLIST_ID: process.env.SPOTIFY_PLAYLIST_ID,
  REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
  AUTH_SECRET: process.env.SPOTIFY_AUTH_SECRET,
  SCOPES: 'user-read-recently-played user-top-read user-read-currently-playing user-modify-playback-state',
  AUTHORIZE_URL: 'https://accounts.spotify.com/authorize',
  TOKEN_URL: 'https://accounts.spotify.com/api/token',
  API_BASE_URL: 'https://api.spotify.com/v1',
};

