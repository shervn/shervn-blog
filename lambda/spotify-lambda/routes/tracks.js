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
    }));

    res.json(tracks.length ? tracks : FALLBACK_TRACK);
  } catch (err) {
    res.status(500).json(FALLBACK_TRACK);
  }
});

module.exports = router;

