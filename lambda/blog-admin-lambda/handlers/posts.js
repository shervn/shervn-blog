const s3Service = require('../services/s3Service');
const cloudfrontService = require('../services/cloudfrontService');
const { generateUUID } = require('../utils/uuid');
const config = require('../config/s3');

function bodyKey(type, uuid) {
  return `${config.DATA_PREFIX}${type}/${uuid}.md`;
}

// List posts
async function listPosts(type = 'blog', limit = 10) {
  const posts = await s3Service.readJSON(type);
  const sorted = [...posts].sort((a, b) => b.order - a.order);
  const recent = sorted.slice(0, limit);

  if (recent.length === 0) {
    return `No posts found in ${type}.`;
  }

  let result = `*Recent ${type} posts:*\n\n`;
  for (let idx = 0; idx < recent.length; idx++) {
    const post = recent[idx];
    const body = (await s3Service.readText(bodyKey(type, post.uuid))) || '';
    result += `${idx + 1}. Order: ${post.order}\n`;
    result += `   Title: ${post.title}\n`;
    result += `   Date: ${post.date}\n`;
    result += `   UUID: \`${post.uuid}\`\n`;
    result += `   Body: ${body.substring(0, 50)}...\n\n`;
  }

  return result;
}

// Add new post
async function addPost(type, title, body, date = null, description = '', className = 'farsiPost', imagePath = null, soundCloudLink = null, playlist = false, spotifySongId = null) {
  // Validate required fields - don't add anything if any are empty
  if (!title || title.trim().length === 0) {
    throw new Error('Title is required');
  }

  if (!date || date.trim().length === 0) {
    throw new Error('Date is required');
  }

  if (!body || body.trim().length === 0) {
    throw new Error('Body is required');
  }

  const posts = await s3Service.readJSON(type);

  // Get highest order
  const maxOrder = posts.length > 0
    ? Math.max(...posts.map(p => p.order || 0))
    : 0;

  const newPost = {
    order: maxOrder + 1,
    title: title.trim(),
    description: description,
    date: date.trim(),
    className: className,
    image: imagePath,
    uuid: generateUUID(),
    createdAt: new Date().toISOString(),
    soundCloudLink: soundCloudLink || null,
    spotifySongId: spotifySongId || null
  };

  // Add optional fields if provided
  if (playlist) {
    newPost.playlist = playlist;
  }

  posts.push(newPost);
  await s3Service.writeJSON(type, posts);
  await s3Service.writeText(bodyKey(type, newPost.uuid), body.trim());

  // Invalidate CloudFront cache
  await cloudfrontService.invalidateDataFiles();

  let response = `✅ Post added!\n\n*Order:* ${newPost.order}\n*UUID:* \`${newPost.uuid}\`\n*Title:* ${newPost.title}\n*ClassName:* ${newPost.className}`;
  if (imagePath) {
    response += `\n*Image:* ${imagePath}`;
  }
  if (spotifySongId) {
    response += `\n*Song ID:* ${spotifySongId}`;
  }
  return response;
}

// Delete post by UUID
async function deletePost(type, uuid) {
  const posts = await s3Service.readJSON(type);
  const index = posts.findIndex(p => p.uuid === uuid);

  if (index === -1) {
    return `❌ Post with UUID \`${uuid}\` not found.`;
  }

  const deleted = posts.splice(index, 1)[0];
  await s3Service.writeJSON(type, posts);
  await s3Service.deleteObject(bodyKey(type, uuid));

  // Invalidate CloudFront cache
  await cloudfrontService.invalidateDataFiles();

  return `✅ Post deleted!\n\n*Order:* ${deleted.order}\n*Title:* ${deleted.title}`;
}

// Update post by UUID
async function updatePost(type, uuid, updates) {
  const posts = await s3Service.readJSON(type);
  const index = posts.findIndex(p => p.uuid === uuid);

  if (index === -1) {
    return `❌ Post with UUID \`${uuid}\` not found.`;
  }

  const { body: bodyUpdate, ...metaUpdates } = updates;
  Object.assign(posts[index], metaUpdates);
  await s3Service.writeJSON(type, posts);

  if (bodyUpdate !== undefined) {
    await s3Service.writeText(bodyKey(type, uuid), bodyUpdate.trim());
  }

  // Invalidate CloudFront cache
  await cloudfrontService.invalidateDataFiles();

  return `✅ Post updated!\n\n*UUID:* \`${uuid}\`\n*Title:* ${posts[index].title}`;
}

// Get post by UUID
async function getPost(type, uuid) {
  const posts = await s3Service.readJSON(type);
  const post = posts.find(p => p.uuid === uuid);

  if (!post) {
    return `❌ Post with UUID \`${uuid}\` not found.`;
  }

  const body = (await s3Service.readText(bodyKey(type, uuid))) || '';

  let result = `*Post Details:*\n\n`;
  result += `Order: ${post.order}\n`;
  result += `Title: ${post.title}\n`;
  result += `Date: ${post.date}\n`;
  result += `UUID: \`${post.uuid}\`\n`;
  result += `Description: ${post.description || '(empty)'}\n`;
  result += `Image: ${post.image || '(none)'}\n`;
  if (post.spotifySongId) {
    result += `Song ID: ${post.spotifySongId}\n`;
  }
  result += `\n*Body:*\n${body.substring(0, 500)}${body.length > 500 ? '...' : ''}`;

  return result;
}

// Update meta.json fields
async function updateMeta(updates) {
  const meta = await s3Service.readJSON('meta', { name: '', subtitle: '' });

  if (updates.name !== undefined) {
    meta.name = updates.name;
  }
  if (updates.subtitle !== undefined) {
    meta.subtitle = updates.subtitle;
  }

  await s3Service.writeJSON('meta', meta);

  // Invalidate CloudFront cache
  await cloudfrontService.invalidateDataFiles();

  let response = `✅ Meta updated!\n\n`;
  if (updates.name !== undefined) {
    response += `*Name:* ${meta.name}\n`;
  }
  if (updates.subtitle !== undefined) {
    response += `*Subtitle:* ${meta.subtitle}\n`;
  }

  return response;
}

module.exports = {
  listPosts,
  addPost,
  deletePost,
  updatePost,
  getPost,
  updateMeta
};
