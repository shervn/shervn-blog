function parseLimit(limit) {
  const n = parseInt(limit);
  if (isNaN(n) || n < 1) return 1;
  return Math.min(n, 10);
}

function parseTimeRange(timeRange, defaultRange = 'long_term') {
  const validRanges = ['short_term', 'medium_term', 'long_term'];
  if (!validRanges.includes(timeRange)) {
    return defaultRange;
  }
  return timeRange;
}

module.exports = {
  parseLimit,
  parseTimeRange,
};

