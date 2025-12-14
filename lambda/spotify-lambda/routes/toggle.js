const express = require('express');
const router = express.Router();
const s3Service = require('../services/s3Service');

// Get toggle state
router.get('/toggle-state', async (req, res) => {
  try {
    const stateData = await s3Service.readJSON('toggleState', { state: false });
    res.json({ state: stateData.state || false });
  } catch (err) {
    console.error('Error fetching toggle state:', err);
    res.status(500).json({ error: err.message, state: false });
  }
});

module.exports = router;

