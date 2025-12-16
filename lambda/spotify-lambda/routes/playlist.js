const express = require('express');
const router = express.Router();
const spotifyService = require('../services/spotifyService');
const config = require('../config/spotify');

router.get('/playlist', async (req, res) => {
  try {
    const playlistId = config.PLAYLIST_ID;
    
    if (!playlistId) {
      return res.status(500).json({ error: 'Playlist ID not configured' });
    }

    const data = await spotifyService.getPlaylist(playlistId);

    const tracks = data.tracks.items
      .filter(item => item.track) // Filter out null tracks
      .map((item) => ({
        song: item.track.name,
        artist: item.track.artists.map((a) => a.name).join('⨯'),
        url: item.track.external_urls.spotify,
        albumArt: item.track.album.images[0]?.url || null, // Get the largest image (first in array)
        albumName: item.track.album.name,
      }));

    res.json({
      name: data.name,
      description: data.description,
      tracks: tracks,
    });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

module.exports = router;

