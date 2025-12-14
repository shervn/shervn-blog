const express = require('express');
const router = express.Router();
const spotifyService = require('../services/spotifyService');

const ALLOWED_ACTIONS = ['pause', 'play', 'next', 'previous'];

router.get('/player', async (req, res) => {
  try {
    const { action } = req.query;

    if (!ALLOWED_ACTIONS.includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const result = await spotifyService.controlPlayer(action);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

module.exports = router;

