// Load dotenv only for local development
if (!process.env.LAMBDA_TASK_ROOT) {
  require('dotenv').config();
}

const express = require('express');
const serverlessExpress = require('@vendia/serverless-express');
const corsMiddleware = require('./middleware/cors');

// Routes
const tracksRoutes = require('./routes/tracks');
const playerRoutes = require('./routes/player');
const topRoutes = require('./routes/top');
const currentlyPlayingRoutes = require('./routes/currentlyPlaying');
const toggleRoutes = require('./routes/toggle');
const playlistRoutes = require('./routes/playlist');

const app = express();

// Middleware
app.use(corsMiddleware);

// Routes
app.use('/', tracksRoutes);
app.use('/', playerRoutes);
app.use('/', topRoutes);
app.use('/', currentlyPlayingRoutes);
app.use('/', toggleRoutes);
app.use('/', playlistRoutes);

// Lambda Handler (for AWS deployment)
const server = serverlessExpress({ app });

exports.handler = async (event, context) => {
  return server(event, context);
};

// Local Development Server
// Only start local server if not running in Lambda
if (!process.env.LAMBDA_TASK_ROOT) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
