const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const serverlessExpress = require('@vendia/serverless-express');

const app = express();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) return cachedToken;

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
      },
    }
  );

  cachedToken = response.data.access_token;
  tokenExpiresAt = now + response.data.expires_in * 1000;
  return cachedToken;
}

// Helper to sanitize limit
function parseLimit(limit) {
  const n = parseInt(limit);
  if (isNaN(n) || n < 1) return 1;       // Default 1
  return Math.min(n, 10);                 // Max 10
}

// --- CORS Middleware ---
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // Preflight requests
  }
  next();
});

// --- Recent Tracks ---
app.get('/recent-tracks', async (req, res) => {
  const FALLBACK_TRACK = [
    {
      band: "Radiohead",
      song: "Morning Bell",
      url: "https://open.spotify.com/track/4h37RgtBg9iynN3BIL5lFU?si=6d72e93e8ee54b15",
      listened_at: new Date().toISOString(),
    },
  ];

  try {
    const token = await getAccessToken();
    const limit = parseLimit(req.query.limit);

    const response = await axios.get(
      `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const tracks = response.data.items.map((item) => ({
      band: item.track.artists.map(a => a.name).join(', '),
      song: item.track.name,
      url: item.track.external_urls.spotify,
      listened_at: item.played_at,
    }));

    res.json(tracks.length ? tracks : FALLBACK_TRACK);
  } catch (err) {
    res.status(500).json(FALLBACK_TRACK);
  }
});

// --- Top Artists ---
app.get("/top-artists", async (req, res) => {
  try {
    const token = await getAccessToken();
    const limit = parseLimit(req.query.limit);
    let { time_range } = req.query;
    if (!["short_term", "medium_term", "long_term"].includes(time_range)) {
      time_range = "long_term";
    }

    const response = await axios.get(
      `https://api.spotify.com/v1/me/top/artists?limit=${limit}&time_range=${time_range}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const simplified = response.data.items.map((artist) => ({
      band: artist.name,
      url: artist.external_urls.spotify,
      since: time_range
    }));

    res.json(simplified);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// --- Top Songs ---
app.get("/top-songs", async (req, res) => {
  try {
    const token = await getAccessToken();
    const limit = parseLimit(req.query.limit);
    let { time_range } = req.query;
    if (!["short_term", "medium_term", "long_term"].includes(time_range)) {
      time_range = "short_term";
    }

    const response = await axios.get(
      `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=${time_range}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const simplified = response.data.items.map((track) => ({
      song: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      url: track.external_urls.spotify,
      since: time_range,
    }));

    res.json(simplified);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.get("/currently-playing", async (req, res) => {
  try {
    const token = await getAccessToken();

    const response = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.data || !response.data.item) {
      return res.json({ message: "No track currently playing" });
    }

    const track = response.data.item;

    const simplified = {
      song: track.name,
      artist: track.artists.map(a => a.name).join(", "),
      album: track.album.name,
      url: track.external_urls.spotify,
      duration_ms: track.duration_ms,
      progress_ms: response.data.progress_ms,
      is_playing: response.data.is_playing,
      shuffle: response.data.shuffle_state,
      repeat: response.data.repeat_state
    };

    res.json(simplified);
  } catch (err) {
    if (err.response && err.response.status === 204) {
      return res.json({ message: "No track currently playing" });
    }

    res.status(500).json({ error: err.response?.data || err.message });
  }
});

const server = serverlessExpress({ app });

exports.handler = async (event, context) => {
  return server(event, context);
};
