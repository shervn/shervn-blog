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

    res.json({
      name: data.name,
      description: data.description,
      tracks: spotifyService.mapPlaylistTracks(data),
    });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

const PLAYLIST_PREFIX = 'shervn-';

// All of the user's playlists whose name starts with "shervn-", with that
// prefix stripped, each with its full track list.
router.get('/playlists', async (req, res) => {
  try {
    const allPlaylists = await spotifyService.getUserPlaylists();
    const matching = allPlaylists.filter(
      (p) => p.name && p.name.toLowerCase().startsWith(PLAYLIST_PREFIX)
    );

    const results = await Promise.all(
      matching.map(async (p) => {
        const data = await spotifyService.getPlaylist(p.id);
        return {
          id: p.id,
          name: p.name.slice(PLAYLIST_PREFIX.length),
          tracks: spotifyService.mapPlaylistTracks(data),
        };
      })
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

module.exports = router;

