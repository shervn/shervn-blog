const express = require('express');
const router = express.Router();
const scholarService = require('../services/scholarService');

router.get('/papers', async (req, res) => {
  try {
    const data = await scholarService.getPapers();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
