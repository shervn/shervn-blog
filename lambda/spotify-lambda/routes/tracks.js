const express = require('express');
const router = express.Router();
const spotifyService = require('../services/spotifyService');
const { parseLimit } = require('../middleware/utils');

const FALLBACK_TRACK = [
  {
    band: "Radiohead",
    song: "Morning Bell",
    url: "https://open.spotify.com/track/4h37RgtBg9iynN3BIL5lFU?si=6d72e93e8ee54b15",
    listened_at: new Date().toISOString(),
  },
];

router.get('/recent-tracks', async (req, res) => {
  try {
    const limit = parseLimit(req.query.limit);
    const data = await spotifyService.getRecentlyPlayed(limit);

    const tracks = data.items.map((item) => ({
      band: item.track.artists.map(a => a.name).join('⨯'),
      song: item.track.name,
      url: item.track.external_urls.spotify,
      listened_at: item.played_at,
      albumArt: item.track.album.images[0]?.url || null,
      albumName: item.track.album.name,
    }));

    res.json(tracks.length ? tracks : FALLBACK_TRACK);
  } catch (err) {
    res.status(500).json(FALLBACK_TRACK);
  }
});

router.get('/get-song', async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Track ID is required' });
    }

    const track = await spotifyService.getTrack(id);

    const simplified = {
      song: track.name,
      artist: track.artists.map(a => a.name).join('⨯'),
      album: track.album.name,
      url: track.external_urls.spotify,
      albumArt: track.album.images[0]?.url || null,
    };

    res.json(simplified);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: 'Track not found' });
    }

    res.status(500).json({ error: err.response?.data || err.message });
  }
});

module.exports = router;

