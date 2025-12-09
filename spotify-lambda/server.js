require('dotenv').config();
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const { debug } = require('console');

const app = express();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const FALLBACK_TRACK = {
  "band": "Radiohead",
  "song": "Morning Bell",
  "link": "https://open.spotify.com/track/4h37RgtBg9iynN3BIL5lFU?si=6d72e93e8ee54b15",
  "listened_at": "2025-12-08T20:32:04.149Z",
};

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  const now = Date.now();

  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

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
  tokenExpiresAt = now + response.data.expires_in * 1000; // expires_in is in seconds
  return cachedToken;
}

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
    const response = await axios.get(
      'https://api.spotify.com/v1/me/player/recently-played?limit=10',
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


app.get("/top-artists", async (req, res) => {
  try {
    const token = await getAccessToken();

    let { time_range } = req.query;
    if (!["short_term", "medium_term", "long_term"].includes(time_range)) {
      time_range = "long_term";
    }

    const response = await axios.get(
      `https://api.spotify.com/v1/me/top/artists?limit=10&time_range=${time_range}`,
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


app.get("/top-songs", async (req, res) => {
  try {
    const token = await getAccessToken();

    let { time_range } = req.query;
    if (!["short_term", "medium_term", "long_term"].includes(time_range)) {
      time_range = "long_term";
    }

    const response = await axios.get(
      `https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${time_range}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const simplified = response.data.items.map((track) => ({
      song: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      url: track.external_urls.spotify,
      since: time_range,
    }));

    res.json(simplified);
  } catch (err) {
    res.status(500).json({
      error: err.response?.data || err.message,
    });
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


app.listen(3001, () => console.log('Server running on http://localhost:3001'));
