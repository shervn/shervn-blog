// Generates public/sitemap.xml from the local media/data mirror. Runs
// automatically before `npm run build` (see package.json's "prebuild").
// Content is fetched from S3 at runtime by the app, so the sitemap can't be
// static - it's regenerated from whatever's currently in media/data/, which
// is kept in sync with the live S3 bucket as part of the normal content workflow.
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://shervn.com';
const DATA_DIR = path.join(__dirname, '..', '..', 'media', 'data');
const OUT_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

const STATIC_ROUTES = ['/', '/blog/page/1', '/reviews/page/1', '/postboxes', '/metro', '/noises/page/1', '/spotify', '/scholar'];

// type key (matches media/data/{type}.json) -> URL segment used by SinglePost's route
const POST_TYPES = [
  { type: 'blog', routeSegment: 'blog' },
  { type: 'review', routeSegment: 'review' },
  { type: 'noises', routeSegment: 'noises' }
];

function urlEntry(loc) {
  return `  <url><loc>${SITE_URL}${loc}</loc></url>`;
}

const urls = STATIC_ROUTES.map(urlEntry);

for (const { type, routeSegment } of POST_TYPES) {
  const jsonPath = path.join(DATA_DIR, `${type}.json`);
  if (!fs.existsSync(jsonPath)) continue;
  const posts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  for (const post of posts) {
    urls.push(urlEntry(`/${routeSegment}/${post.uuid}`));
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;

fs.writeFileSync(OUT_PATH, xml, 'utf8');
console.log(`Generated sitemap.xml with ${urls.length} URLs`);
