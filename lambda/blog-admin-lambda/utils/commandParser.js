// Parse bracket-delimited arguments: [value1] [value2] [key=value3]
function parseBrackets(text) {
  const brackets = [];
  let current = '';
  let inBracket = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (char === '[') {
      if (inBracket) {
        // Nested bracket, treat as part of content
        current += char;
      } else {
        inBracket = true;
        current = '';
      }
    } else if (char === ']') {
      if (inBracket) {
        brackets.push(current.trim());
        current = '';
        inBracket = false;
      } else {
        // Closing bracket without opening, treat as regular char
        current += char;
      }
    } else {
      current += char;
    }
  }
  
  // If we're still in a bracket at the end, add what we have
  if (inBracket && current.trim()) {
    brackets.push(current.trim());
  }
  
  return brackets;
}

// Parse command from message
function parseCommand(text) {
  const parts = text.trim().split('\n');
  const commandLine = parts[0];
  const match = commandLine.match(/^\/(\w+)(?:\s+(.+))?$/);
  if (!match) return null;
  
  const args = match[2] || '';
  const bracketArgs = parseBrackets(args);
  
  return {
    command: match[1],
    args: args,
    bracketArgs: bracketArgs,
    body: parts.slice(1).join('\n')
  };
}

module.exports = {
  parseCommand,
  parseBrackets
};

