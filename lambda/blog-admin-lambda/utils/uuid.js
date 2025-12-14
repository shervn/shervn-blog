// Generate UUID (8 chars)
function generateUUID() {
  return Math.random().toString(36).substring(2, 10);
}

module.exports = {
  generateUUID
};

