const express = require('express');
const router = express.Router();
const spotifyService = require('../services/spotifyService');

router.get('/currently-playing', async (req, res) => {
  try {
    const data = await spotifyService.getCurrentlyPlaying();

    if (!data || !data.item) {
      return res.json({ message: 'No track currently playing' });
    }

    const item = data.item;

    // Podcast episodes have a different shape than tracks: no artists/album,
    // just a name and a parent show. currently_playing_type tells us which
    // one we got ("track", "episode", "ad", or "unknown").
    const isEpisode = data.currently_playing_type === 'episode';

    const simplified = {
      song: item.name,
      artist: isEpisode ? (item.show?.publisher || item.show?.name) : item.artists.map(a => a.name).join('⨯'),
      album: isEpisode ? item.show?.name : item.album.name,
      url: item.external_urls.spotify,
      duration_ms: item.duration_ms,
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

