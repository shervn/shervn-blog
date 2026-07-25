if (!process.env.LAMBDA_TASK_ROOT) {
  require('dotenv').config();
}

const scholarService = require('./services/scholarService');

// Invoked on a schedule (see serverless.yml), not through API Gateway, so it's
// free of the 29s HTTP integration timeout that the full per-paper detail
// scrape would otherwise blow through.
exports.handler = async () => {
  const result = await scholarService.refreshCache();
  console.log(`Refreshed ${result.papers.length} papers.`);
  return { statusCode: 200 };
};
