const s3Service = require('../services/s3Service');
const { generateUUID } = require('../utils/uuid');
const { getCurrentDate } = require('../utils/date');

// List posts
async function listPosts(type = 'blog', limit = 10) {
  const posts = await s3Service.readJSON(type);
  const sorted = posts.sort((a, b) => b.order - a.order);
  const recent = sorted.slice(0, limit);
  
  if (recent.length === 0) {
    return `No posts found in ${type}.`;
  }
  
  let result = `*Recent ${type} posts:*\n\n`;
  recent.forEach((post, idx) => {
    result += `${idx + 1}. Order: ${post.order}\n`;
    result += `   Title: ${post.title}\n`;
    result += `   Date: ${post.date}\n`;
    result += `   UUID: \`${post.uuid}\`\n`;
    result += `   Body: ${post.body.substring(0, 50)}...\n\n`;
  });
  
  return result;
}

// Add new post
async function addPost(type, title, body, date = null, description = '', className = 'farsiPost') {
  const posts = await s3Service.readJSON(type);
  
  // Get highest order
  const maxOrder = posts.length > 0 
    ? Math.max(...posts.map(p => p.order || 0))
    : 0;
  
  const newPost = {
    order: maxOrder + 1,
    title: title || 'بی عنوان',
    description: description,
    date: date || getCurrentDate(),
    body: body,
    className: className,
    image: null,
    uuid: generateUUID(),
    createdAt: new Date().toISOString()
  };
  
  posts.push(newPost);
  await s3Service.writeJSON(type, posts);
  
  return `✅ Post added!\n\n*Order:* ${newPost.order}\n*UUID:* \`${newPost.uuid}\`\n*Title:* ${newPost.title}\n*ClassName:* ${newPost.className}`;
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
  
  return `✅ Post deleted!\n\n*Order:* ${deleted.order}\n*Title:* ${deleted.title}`;
}

// Update post by UUID
async function updatePost(type, uuid, updates) {
  const posts = await s3Service.readJSON(type);
  const index = posts.findIndex(p => p.uuid === uuid);
  
  if (index === -1) {
    return `❌ Post with UUID \`${uuid}\` not found.`;
  }
  
  Object.assign(posts[index], updates);
  await s3Service.writeJSON(type, posts);
  
  return `✅ Post updated!\n\n*UUID:* \`${uuid}\`\n*Title:* ${posts[index].title}`;
}

// Get post by UUID
async function getPost(type, uuid) {
  const posts = await s3Service.readJSON(type);
  const post = posts.find(p => p.uuid === uuid);
  
  if (!post) {
    return `❌ Post with UUID \`${uuid}\` not found.`;
  }
  
  let result = `*Post Details:*\n\n`;
  result += `Order: ${post.order}\n`;
  result += `Title: ${post.title}\n`;
  result += `Date: ${post.date}\n`;
  result += `UUID: \`${post.uuid}\`\n`;
  result += `Description: ${post.description || '(empty)'}\n`;
  result += `Image: ${post.image || '(none)'}\n`;
  result += `\n*Body:*\n${post.body.substring(0, 500)}${post.body.length > 500 ? '...' : ''}`;
  
  return result;
}

module.exports = {
  listPosts,
  addPost,
  deletePost,
  updatePost,
  getPost
};

