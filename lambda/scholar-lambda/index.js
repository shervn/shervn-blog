if (!process.env.LAMBDA_TASK_ROOT) {
  require('dotenv').config();
}

const express = require('express');
const serverlessExpress = require('@vendia/serverless-express');
const corsMiddleware = require('./middleware/cors');

const scholarRoutes = require('./routes/scholar');

const app = express();

app.use(corsMiddleware);
app.use('/', scholarRoutes);

const server = serverlessExpress({ app });

exports.handler = async (event, context) => {
  return server(event, context);
};

if (!process.env.LAMBDA_TASK_ROOT) {
  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
