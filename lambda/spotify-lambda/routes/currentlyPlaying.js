const express = require('express');
const router = express.Router();
const spotifyService = require('../services/spotifyService');

router.get('/currently-playing', async (req, res) => {
  try {
    const data = await spotifyService.getCurrentlyPlaying();

    if (!data || !data.item) {
      return res.json({ message: 'No track currently playing' });
    }

    const track = data.item;

    const simplified = {
      song: track.name,
      artist: track.artists.map(a => a.name).join('⨯'),
      album: track.album.name,
      url: track.external_urls.spotify,
      duration_ms: track.duration_ms,
      progress_ms: data.progress_ms,
      is_playing: data.is_playing,
      shuffle: data.shuffle_state,
      repeat: data.repeat_state,
    };

    res.json(simplified);
  } catch (err) {
    if (err.response && err.response.status === 204) {
      return res.json({ message: 'No track currently playing' });
    }

    res.status(500).json({ error: err.response?.data || err.message });
  }
});

module.exports = router;

