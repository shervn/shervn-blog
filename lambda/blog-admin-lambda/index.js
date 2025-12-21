const telegramService = require('./services/telegramService');
const s3Service = require('./services/s3Service');
const { parseCommand } = require('./utils/commandParser');
const postsHandler = require('./handlers/posts');
const imagesHandler = require('./handlers/images');
const commentsHandler = require('./handlers/comments');
const toggleHandler = require('./handlers/toggle');
const helpHandler = require('./handlers/help');

// Helper function to upload image if photo is present
async function uploadImageIfPresent(photo, type) {
  if (!photo || !Array.isArray(photo) || photo.length === 0) {
    return null;
  }
  
  try {
    const largestPhoto = photo[photo.length - 1];
    const fileId = largestPhoto.file_id;
    const { buffer, extension } = await telegramService.downloadFile(fileId);
    
    const timestamp = Date.now();
    const fileName = `${type}_${timestamp}.${extension}`;
    const imagePath = await s3Service.uploadImageToS3(buffer, 'Misc', fileName);
    
    return imagePath;
  } catch (err) {
    console.error('Error uploading image:', err.message);
    throw err;
  }
}

// Parse field=[value] patterns from arguments
function parseFieldValuePairs(args) {
  const pairs = [];
  const regex = /(\w+)=\[([^\]]*)\]/g;
  let match;
  let argsWithoutFields = args;
  
  while ((match = regex.exec(args)) !== null) {
    pairs.push({ field: match[1], value: match[2] });
    argsWithoutFields = argsWithoutFields.replace(match[0], '').trim();
  }
  
  return { pairs, argsWithoutFields };
}

// Parse add command arguments
function parseAddCommandArgs(args, bracketArgs) {
  const { pairs: fieldValuePairs, argsWithoutFields } = parseFieldValuePairs(args);
  
  // Remove bracket contents (for title) from args to find type
  let argsWithoutBrackets = argsWithoutFields;
  bracketArgs.forEach(bracket => {
    if (!bracket.includes('=')) {
      argsWithoutBrackets = argsWithoutBrackets.replace(`[${bracket}]`, '').trim();
    }
  });
  
  // Type is first word in args without brackets and field=[value] patterns
  const typeMatch = argsWithoutBrackets.match(/^(\w+)/);
  const type = typeMatch ? typeMatch[1] : 'blog';
  
  return { type, fieldValuePairs };
}

// Parse post fields from add command
function parsePostFields(bracketArgs, fieldValuePairs, args) {
  let title = null;
  let date = null;
  let className = 'farsiPost';
  let soundCloudLink = null;
  let playlist = false;
  let songId = null;
  
  // Process brackets - first bracket without = is title
  for (const bracket of bracketArgs) {
    if (!bracket.includes('=') && title === null) {
      title = bracket;
    }
  }
  
  // Process field=[value] pairs
  for (const pair of fieldValuePairs) {
    const trimmedValue = pair.value ? pair.value.trim() : '';
    const normalizedValue = trimmedValue === '' ? null : trimmedValue;
    
    if (pair.field === 'date') date = normalizedValue;
    else if (pair.field === 'className') className = normalizedValue || 'farsiPost';
    else if (pair.field === 'soundCloudLink') soundCloudLink = normalizedValue;
    else if (pair.field === 'playlist') playlist = normalizedValue ? normalizedValue.toLowerCase() === 'true' : false;
    else if (pair.field === 'songId') songId = normalizedValue;
  }
  
  // Fallback: if no brackets, use old format
  if (bracketArgs.length === 0 && fieldValuePairs.length === 0) {
    const dateMatch = args.match(/date=([^\s]+(?:\s+[^\s]+)*?)(?=\s+className=|soundCloudLink=|playlist=|songId=|$)/);
    if (dateMatch) date = dateMatch[1].trim();
    
    const classNameMatch = args.match(/className=([^\s]+)/);
    if (classNameMatch) className = classNameMatch[1];
    
    const soundCloudMatch = args.match(/soundCloudLink=([^\s]+)/);
    if (soundCloudMatch) soundCloudLink = soundCloudMatch[1];
    
    const playlistMatch = args.match(/playlist=([^\s]+)/);
    if (playlistMatch) playlist = playlistMatch[1].toLowerCase() === 'true';
    
    const songIdMatch = args.match(/songId=([^\s]+)/);
    if (songIdMatch) songId = songIdMatch[1];
    
    let titleArgs = args;
    if (dateMatch) titleArgs = titleArgs.replace(/date=[^\s]+(?:\s+[^\s]+)*?(?=\s+className=|soundCloudLink=|playlist=|songId=|$)/, '').trim();
    if (classNameMatch) titleArgs = titleArgs.replace(/\s*className=[^\s]+/, '').trim();
    if (soundCloudMatch) titleArgs = titleArgs.replace(/\s*soundCloudLink=[^\s]+/, '').trim();
    if (playlistMatch) titleArgs = titleArgs.replace(/\s*playlist=[^\s]+/, '').trim();
    if (songIdMatch) titleArgs = titleArgs.replace(/\s*songId=[^\s]+/, '').trim();
    
    const titleParts = titleArgs.split(' ').slice(1);
    title = titleParts.join(' ').trim() || null;
  }
  
  return { title, date, className, soundCloudLink, playlist, songId };
}

// Handle add comment command
async function handleAddComment(postBody) {
  if (!postBody || postBody.trim().length === 0) {
    return '❌ Comment text is required. Add it on a new line after the command.\nExample: /add comment\nYour comment text here...';
  }
  
  try {
    return await commentsHandler.addComment(postBody.trim());
  } catch (err) {
    console.error('Error adding comment:', err.message);
    return `❌ Error: ${err.message}`;
  }
}

// Handle add image command (postbox/train)
async function handleAddImage(type, args, bracketArgs, photo) {
  if (!photo || !Array.isArray(photo) || photo.length === 0) {
    return '❌ Please send a photo with this command.';
  }
  
  try {
    const largestPhoto = photo[photo.length - 1];
    const fileId = largestPhoto.file_id;
    const cityArgs = bracketArgs.length > 0 ? bracketArgs.join(' ') : args.split(' ').slice(1).join(' ');
    return await imagesHandler.handlePhotoUpload(type, cityArgs, fileId);
  } catch (err) {
    console.error('Error processing photo:', err.message);
    return `❌ Error: ${err.message}`;
  }
}

// Handle add post command
async function handleAddPost(type, title, date, className, soundCloudLink, playlist, songId, postBody, photo) {
  if (!title) {
    return '❌ Title is required. Use format: /add blog [My Title] date=[تابستان ۰۳]\nPost body here...';
  }
  
  if (!date) {
    return '❌ Date is required. Use format: /add blog [My Title] date=[تابستان ۰۳]\nPost body here...';
  }
  
  if (!postBody || postBody.trim().length === 0) {
    return '❌ Post body is required. Add it on a new line after the command.';
  }
  
  try {
    let imagePath = null;
    if (photo) {
      imagePath = await uploadImageIfPresent(photo, type);
    }
    
    return await postsHandler.addPost(type, title, postBody.trim(), date, '', className, imagePath, soundCloudLink, playlist, songId);
  } catch (err) {
    console.error('Error adding post:', err.message);
    return `❌ Error: ${err.message}`;
  }
}

// Handle add command
async function handleAddCommand(args, bracketArgs, postBody, photo) {
  const { type, fieldValuePairs } = parseAddCommandArgs(args, bracketArgs);
  
  if (type === 'comment') {
    return await handleAddComment(postBody);
  }
  
  if (type === 'postbox' || type === 'train') {
    return await handleAddImage(type, args, bracketArgs, photo);
  }
  
  // Handle post types (blog, review, noises)
  const { title, date, className, soundCloudLink, playlist, songId } = parsePostFields(bracketArgs, fieldValuePairs, args);
  return await handleAddPost(type, title, date, className, soundCloudLink, playlist, songId, postBody, photo);
}

// Handle get command
async function handleGetCommand(args) {
  const parts = args.split(' ');
  const type = parts[0];
  const uuid = parts[1];
  
  if (!type || !uuid) {
    return '❌ Type and UUID are required. Usage: /get type uuid';
  }
  
  return await postsHandler.getPost(type, uuid);
}

// Handle delete command
async function handleDeleteCommand(args) {
  const parts = args.split(' ');
  const type = parts[0];
  const uuid = parts[1];
  
  if (!type || !uuid) {
    return '❌ Type and UUID are required. Usage: /delete type uuid';
  }
  
  try {
    if (type === 'postbox') {
      return await imagesHandler.deletePostboxImage(uuid);
    } else if (type === 'train') {
      return await imagesHandler.deleteTrainImage(uuid);
    } else {
      return await postsHandler.deletePost(type, uuid);
    }
  } catch (err) {
    console.error('Error deleting:', err.message);
    return `❌ Error: ${err.message}`;
  }
}

// Parse update command arguments
function parseUpdateCommandArgs(args) {
  const { pairs: fieldValuePairs, argsWithoutFields } = parseFieldValuePairs(args);
  
  const typeUuidParts = argsWithoutFields.split(/\s+/).filter(p => p.trim());
  let type = typeUuidParts[0] || 'blog';
  let uuid = typeUuidParts[1] || null;
  
  // Fallback: if no brackets, use old format field=value
  if (fieldValuePairs.length === 0) {
    const parts = args.split(' ');
    type = parts[0] || 'blog';
    uuid = parts[1];
  }
  
  return { type, uuid, fieldValuePairs };
}

// Build updates object from field-value pairs for posts
function buildPostUpdates(fieldValuePairs, args, postBody) {
  const updates = {};
  
  if (fieldValuePairs.length === 0) {
    return { error: '❌ Invalid format. Use field=[value] with brackets. Usage: /update blog uuid field=[value]' };
  }
  
  for (const pair of fieldValuePairs) {
    const { field, value } = pair;
    // Normalize empty strings (from empty brackets []) to null
    const normalizedValue = (value === '' || value === undefined) ? null : value.trim();
    
    if (field === 'title') updates.title = normalizedValue;
    else if (field === 'date') updates.date = normalizedValue;
    else if (field === 'description') updates.description = normalizedValue;
    else if (field === 'order') updates.order = normalizedValue ? parseInt(normalizedValue) : null;
    else if (field === 'body') updates.body = postBody || normalizedValue;
    else if (field === 'soundCloudLink') updates.soundCloudLink = normalizedValue;
    else if (field === 'playlist') updates.playlist = normalizedValue ? normalizedValue.toLowerCase() === 'true' : false;
    else if (field === 'songId') updates.songId = normalizedValue;
    else {
      return { error: '❌ Invalid field. Allowed: title, date, description, order, body, soundCloudLink, playlist, songId' };
    }
  }
  
  return { updates };
}

// Build updates object from field-value pairs for meta
function buildMetaUpdates(fieldValuePairs, args) {
  const updates = {};
  
  if (fieldValuePairs.length === 0) {
    return { error: '❌ Invalid format. Use field=[value] with brackets. Usage: /update meta name=[value]' };
  }
  
  for (const pair of fieldValuePairs) {
    const { field, value } = pair;
    
    if (field === 'name') updates.name = value;
    else if (field === 'subtitle') updates.subtitle = value;
    else {
      return { error: '❌ Invalid field. Allowed: name, subtitle' };
    }
  }
  
  return { updates };
}

// Handle update meta command
async function handleUpdateMeta(args, fieldValuePairs) {
  if (fieldValuePairs.length === 0) {
    return '❌ Field=[value] required with brackets. Usage: /update meta name=[value] or /update meta subtitle=[value]';
  }
  
  const result = buildMetaUpdates(fieldValuePairs, args);
  if (result.error) {
    return result.error;
  }
  
  try {
    return await postsHandler.updateMeta(result.updates);
  } catch (err) {
    console.error('Error updating meta:', err.message);
    return `❌ Error: ${err.message}`;
  }
}

// Handle update post command
async function handleUpdatePost(type, uuid, args, fieldValuePairs, postBody, photo) {
  if (!uuid) {
    return '❌ UUID required. Usage: /update blog uuid field=[value]';
  }
  
  // Allow updates with: field updates, image, or body text
  const hasFieldUpdates = fieldValuePairs.length > 0;
  const hasImage = photo && photo.length > 0;
  const hasBodyUpdate = postBody && postBody.trim().length > 0;
  
  if (!hasFieldUpdates && !hasImage && !hasBodyUpdate) {
    return '❌ Field=[value] with brackets, image, or body text required. Usage: /update blog uuid field=[value] or attach photo or add body text on new line';
  }
  
  const updates = {};
  
  // Build updates from field-value pairs if present
  if (hasFieldUpdates) {
    const result = buildPostUpdates(fieldValuePairs, args, postBody);
    if (result.error) {
      return result.error;
    }
    Object.assign(updates, result.updates);
  }
  
  // If body text is provided and not already set by field updates, update body
  if (hasBodyUpdate && !updates.body) {
    updates.body = postBody.trim();
  }
  
  try {
    // Upload image if present
    if (hasImage) {
      updates.image = await uploadImageIfPresent(photo, type);
    }
    
    return await postsHandler.updatePost(type, uuid, updates);
  } catch (err) {
    console.error('Error updating post:', err.message);
    return `❌ Error: ${err.message}`;
  }
}

// Handle update command
async function handleUpdateCommand(args, postBody, photo) {
  const { type, uuid, fieldValuePairs } = parseUpdateCommandArgs(args);
  
  if (type === 'meta') {
    return await handleUpdateMeta(args, fieldValuePairs);
  }
  
  return await handleUpdatePost(type, uuid, args, fieldValuePairs, postBody, photo);
}

// Lambda handler function (extracted for reuse)
async function handleTelegramWebhook(body) {
  const message = body?.message;
  
  if (!message) {
    return;
  }
  
  const chatId = message.chat.id;
  const userId = message.from.id;
  const text = message.text;
  const photo = message.photo;
  const caption = message.caption;
  const commandText = caption || text;
  
  // Check authorization
  if (!telegramService.isAuthorized(userId)) {
    try {
      await telegramService.sendMessage(chatId, '❌ Unauthorized. You are not allowed to use this bot.');
    } catch (err) {
      console.error('Failed to send unauthorized message:', err.message);
    }
    return;
  }
  
  if (!commandText) {
    return;
  }
  
  const parsed = parseCommand(commandText);
  
  if (!parsed) {
    try {
      await telegramService.sendMessage(chatId, '❌ Invalid command format. Use /help for usage.');
    } catch (err) {
      console.error('Failed to send invalid command message:', err.message);
    }
    return;
  }
  
  const { command, args, bracketArgs, body: postBody } = parsed;
  
  let response = '';
  
  switch (command) {
    case 'help':
      response = helpHandler.getHelpMessage();
      break;
      
    case 'add':
      response = await handleAddCommand(args, bracketArgs, postBody, photo);
      break;
      
    case 'get':
      response = await handleGetCommand(args);
      break;
      
    case 'delete':
      response = await handleDeleteCommand(args);
      break;
      
    case 'update':
      response = await handleUpdateCommand(args, postBody, photo);
      break;
      
    case 'toggle':
      response = await toggleHandler.toggleState();
      break;
      
    default:
      response = '❌ Unknown command. Use /help for available commands.';
  }
  
  // Only send message if we have a response
  if (response) {
    try {
      await telegramService.sendMessage(chatId, response);
    } catch (err) {
      console.error('Failed to send response:', err.message);
      throw err; // Let the outer handler deal with it
    }
  }
}

// Lambda handler (for AWS deployment)
exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.requestContext?.http?.method === 'OPTIONS' || event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ ok: true })
    };
  }
  
  try {
    // Parse body (API Gateway wraps it as a string)
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    
    // Wrap in Promise.race with timeout to ensure we don't hang
    await Promise.race([
      handleTelegramWebhook(body),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Operation timeout')), 15000)
      )
    ]);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    console.error('Error:', err.message);
    // Return 200 to Telegram so it doesn't retry
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ ok: true, error: err.message })
    };
  }
};
