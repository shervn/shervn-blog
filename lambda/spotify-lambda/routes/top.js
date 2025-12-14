const express = require('express');
const router = express.Router();
const spotifyService = require('../services/spotifyService');
const { parseLimit, parseTimeRange } = require('../middleware/utils');

router.get('/top-artists', async (req, res) => {
  try {
    const limit = parseLimit(req.query.limit);
    const timeRange = parseTimeRange(req.query.time_range, 'long_term');
    
    const data = await spotifyService.getTopArtists(limit, timeRange);

    const simplified = data.items.map((artist) => ({
      band: artist.name,
      url: artist.external_urls.spotify,
      since: timeRange,
    }));

    res.json(simplified);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

router.get('/top-songs', async (req, res) => {
  try {
    const limit = parseLimit(req.query.limit);
    const timeRange = parseTimeRange(req.query.time_range, 'short_term');
    
    const data = await spotifyService.getTopTracks(limit, timeRange);

    const simplified = data.items.map((track) => ({
      song: track.name,
      artist: track.artists.map((a) => a.name).join('⨯'),
      url: track.external_urls.spotify,
      since: timeRange,
    }));

    res.json(simplified);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

module.exports = router;

