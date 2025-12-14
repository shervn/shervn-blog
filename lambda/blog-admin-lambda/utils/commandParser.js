// Parse command from message
function parseCommand(text) {
  const parts = text.trim().split('\n');
  const commandLine = parts[0];
  const match = commandLine.match(/^\/(\w+)(?:\s+(.+))?$/);
  if (!match) return null;
  
  return {
    command: match[1],
    args: match[2] || '',
    body: parts.slice(1).join('\n')
  };
}

module.exports = {
  parseCommand
};

