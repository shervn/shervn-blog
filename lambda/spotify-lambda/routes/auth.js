const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const router = express.Router();
const config = require('../config/spotify');
const spotifyService = require('../services/spotifyService');

// One-time (well, every ~6 months) re-authorization flow. Spotify now expires
// refresh tokens 6 months after the user authorizes the app, so this lets you
// re-approve from a browser without editing env vars or redeploying.
// Protected by SPOTIFY_AUTH_SECRET since these routes are otherwise public.

router.get('/auth/login', (req, res) => {
  if (!config.AUTH_SECRET || !config.REDIRECT_URI) {
    return res.status(500).json({ error: 'SPOTIFY_AUTH_SECRET and SPOTIFY_REDIRECT_URI must be configured' });
  }
  if (req.query.secret !== config.AUTH_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const authorizeUrl = `${config.AUTHORIZE_URL}?${querystring.stringify({
    client_id: config.CLIENT_ID,
    response_type: 'code',
    redirect_uri: config.REDIRECT_URI,
    scope: config.SCOPES,
    state: config.AUTH_SECRET,
  })}`;

  res.redirect(authorizeUrl);
});

router.get('/auth/callback', async (req, res) => {
  if (req.query.state !== config.AUTH_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (req.query.error) {
    return res.status(400).json({ error: req.query.error });
  }

  try {
    const response = await axios.post(
      config.TOKEN_URL,
      querystring.stringify({
        grant_type: 'authorization_code',
        code: req.query.code,
        redirect_uri: config.REDIRECT_URI,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' + Buffer.from(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`).toString('base64'),
        },
      }
    );

    await spotifyService.saveRefreshToken(response.data.refresh_token);
    res.send('Spotify re-authorized. You can close this tab.');
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

module.exports = router;
