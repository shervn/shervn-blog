const s3Service = require('../services/s3Service');

// Toggle state
async function toggleState() {
  const stateData = await s3Service.readJSON('toggleState', { state: false });
  const currentState = stateData.state || false;
  const newState = !currentState;
  
  await s3Service.writeJSON('toggleState', { state: newState });
  
  return `✅ State toggled!\n\n*Previous state:* ${currentState ? 'ON' : 'OFF'}\n*New state:* ${newState ? 'ON' : 'OFF'}`;
}

// Get current toggle state
async function getToggleState() {
  const stateData = await s3Service.readJSON('toggleState', { state: false });
  const currentState = stateData.state || false;
  
  return `*Current toggle state:* ${currentState ? 'ON' : 'OFF'}`;
}

module.exports = {
  toggleState,
  getToggleState
};

