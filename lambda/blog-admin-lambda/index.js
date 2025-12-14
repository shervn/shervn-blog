const telegramService = require('./services/telegramService');
const { parseCommand } = require('./utils/commandParser');
const postsHandler = require('./handlers/posts');
const imagesHandler = require('./handlers/images');
const commentsHandler = require('./handlers/comments');
const toggleHandler = require('./handlers/toggle');
const helpHandler = require('./handlers/help');

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
    
    // Check authorization
  if (!telegramService.isAuthorized(userId)) {
    try {
      await telegramService.sendMessage(chatId, '❌ Unauthorized. You are not allowed to use this bot.');
    } catch (err) {
      console.error('Failed to send unauthorized message:', err.message);
    }
    return;
  }
    
    // Handle photo messages with captions
    if (photo && caption) {
      const parsed = parseCommand(caption);
      if (parsed) {
        const { command, args } = parsed;
        
        if (command === 'addpostbox' || command === 'addtrain') {
          // Get the largest photo
          const largestPhoto = photo[photo.length - 1];
          const fileId = largestPhoto.file_id;
          
          try {
            const response = await imagesHandler.handlePhotoUpload(command, args, fileId);
            await telegramService.sendMessage(chatId, response);
          } catch (err) {
            console.error('Error processing photo:', err.message);
            try {
              await telegramService.sendMessage(chatId, `❌ Error: ${err.message}`);
            } catch (sendErr) {
              console.error('Failed to send error:', sendErr.message);
            }
          }
          return;
        }
      }
    }
    
    if (!text) {
      return;
    }
    
    const parsed = parseCommand(text);
    
    if (!parsed) {
      try {
        await telegramService.sendMessage(chatId, '❌ Invalid command format. Use /help for usage.');
      } catch (err) {
        console.error('Failed to send invalid command message:', err.message);
      }
      return;
    }
    
    const { command, args, body: postBody } = parsed;
    
    let response = '';
    
    switch (command) {
      case 'help':
        response = helpHandler.getHelpMessage();
        break;
        
      case 'list':
        const listType = args.split(' ')[0] || 'blog';
        const limit = parseInt(args.split(' ')[1]) || 10;
      response = await postsHandler.listPosts(listType, limit);
        break;
        
    case 'add':
      const addParts = args.split(' ');
      const addType = addParts[0] || 'blog';
      
      // Parse date (format: date=value, value can contain spaces)
      let addDate = null;
      const dateMatch = args.match(/date=([^\s]+(?:\s+[^\s]+)*?)(?=\s+className=|$)/);
      if (dateMatch) {
        addDate = dateMatch[1].trim();
      }
      
      // Parse className if provided (format: className=value)
      let addClassName = 'farsiPost';
      const classNameMatch = args.match(/className=([^\s]+)/);
      if (classNameMatch) {
        addClassName = classNameMatch[1];
      }
      
      // Extract title: remove type, date=..., and className=... from args
      let titleArgs = args;
      if (dateMatch) {
        titleArgs = titleArgs.replace(/date=[^\s]+(?:\s+[^\s]+)*?(?=\s+className=|$)/, '').trim();
      }
      if (classNameMatch) {
        titleArgs = titleArgs.replace(/\s*className=[^\s]+/, '').trim();
      }
      // Remove the type (first word) and get the rest as title
      const titleParts = titleArgs.split(' ').slice(1);
      const addTitle = titleParts.join(' ').trim() || 'بی عنوان';
      
      if (!addDate) {
        response = '❌ Date is required. Use format: date=تابستان ۰۳\nExample: /add blog My Title date=تابستان ۰۳\nPost body here...';
      } else if (!postBody || postBody.trim().length === 0) {
        response = '❌ Post body is required. Add it on a new line after the command.';
      } else {
        response = await postsHandler.addPost(addType, addTitle, postBody.trim(), addDate, '', addClassName);
      }
      break;
        
      case 'get':
        const getParts = args.split(' ');
        const getType = getParts[0] || 'blog';
        const getUuid = getParts[1];
        
        if (!getUuid) {
          response = '❌ UUID is required. Usage: /get [type] [uuid]';
        } else {
        response = await postsHandler.getPost(getType, getUuid);
        }
        break;
        
      case 'delete':
        const delParts = args.split(' ');
        const delType = delParts[0] || 'blog';
        const delUuid = delParts[1];
        
        if (!delUuid) {
          response = '❌ UUID is required. Usage: /delete [type] [uuid]';
        } else {
        response = await postsHandler.deletePost(delType, delUuid);
        }
        break;
        
      case 'update':
        const updateParts = args.split(' ');
        const updateType = updateParts[0] || 'blog';
        const updateUuid = updateParts[1];
        const updateField = updateParts[2];
        
        if (!updateUuid || !updateField) {
          response = '❌ UUID and field=value required. Usage: /update [type] [uuid] [field=value]';
        } else {
          const [field, ...valueParts] = updateField.split('=');
          const value = valueParts.join('=');
          
          const updates = {};
          if (field === 'title') updates.title = value;
          else if (field === 'date') updates.date = value;
          else if (field === 'description') updates.description = value;
          else if (field === 'order') updates.order = parseInt(value);
          else if (field === 'body') updates.body = postBody || value;
          else {
            response = '❌ Invalid field. Allowed: title, date, description, order, body';
            break;
          }
          
        response = await postsHandler.updatePost(updateType, updateUuid, updates);
      }
      break;
      
    case 'addcomment':
      if (!args || args.trim().length === 0) {
        response = '❌ Comment text is required. Usage: /addcomment [text]';
      } else {
        response = await commentsHandler.addComment(args.trim());
        }
        break;
        
    case 'toggle':
      response = await toggleHandler.toggleState();
      break;
      
    case 'getstate':
      response = await toggleHandler.getToggleState();
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
        setTimeout(() => reject(new Error('Operation timeout')), 8000)
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
