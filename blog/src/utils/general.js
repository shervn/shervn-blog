import FadingWords from "../Components/FadingWords";

const S3_BASE_URL = 'https://shervn-blog-media.s3.amazonaws.com';
const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const BASE_URL = isLocalhost ? '' : S3_BASE_URL;

export function getImagePath(image_name, folder){
  if (folder === 'header') {
    return `${process.env.PUBLIC_URL || ''}/header/${image_name}`;
  }
  return `${BASE_URL}/images/${folder}/${image_name}`;
}

export function getS3Path(path) {
  if (!path) return '';
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${BASE_URL}/${cleanPath}`;
}

// Muted pastels in the same dusty, desaturated family as the existing
// --color-bg-song / --color-bg-band / --color-selection chip colors.
const PASTEL_PALETTE = [
  '#deefd9', // mint
  '#a7b5d5', // dusty blue
  '#e6e6cc', // khaki
  '#f0d9c9', // dusty peach
  '#d9c9e6', // dusty lavender
  '#e6c9d1', // dusty rose
  '#c9e6e0', // dusty teal
  '#ecdcc0', // dusty tan
];

// Deterministically picks a pastel from PASTEL_PALETTE based on a name, so a
// given group (playlist, "Top Artists", ...) keeps the same color across
// re-renders and reloads instead of flickering to a new one each time.
export function pastelColorFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return PASTEL_PALETTE[Math.abs(hash) % PASTEL_PALETTE.length];
}

// For a small, fixed, known list (e.g. nav tabs) - cycles the palette by
// position instead of by name hash, so items can't collide onto the same
// color the way two hashes occasionally do.
export function pastelColorForIndex(index) {
  return PASTEL_PALETTE[index % PASTEL_PALETTE.length];
}

function parseTildes(text, isBold, key) {
  if (!text.includes("~")) {
    return isBold ? <strong key={key}>{text}</strong> : text;
  }

  const result = [];
  let remaining = text;
  let segIdx = 0;

  while (remaining.includes("~")) {
    const tildeIdx = remaining.indexOf("~");
    const before = remaining.slice(0, tildeIdx);
    const lastSpace = before.lastIndexOf(" ");
    const prefix = lastSpace === -1 ? "" : before.slice(0, lastSpace + 1);
    const firstWord = lastSpace === -1 ? before : before.slice(lastSpace + 1);

    if (prefix) result.push(prefix);

    const words = [firstWord];
    let rest = remaining.slice(tildeIdx + 1);

    while (true) {
      const nextTilde = rest.indexOf("~");
      const nextSpace = rest.indexOf(" ");
      if (nextTilde !== -1 && (nextSpace === -1 || nextTilde < nextSpace)) {
        words.push(rest.slice(0, nextTilde));
        rest = rest.slice(nextTilde + 1);
      } else {
        const end = nextSpace === -1 ? rest.length : nextSpace;
        words.push(rest.slice(0, end));
        remaining = rest.slice(end);
        break;
      }
    }

    result.push(<FadingWords key={`${key}-${segIdx++}`} words={words} />);
  }

  if (remaining) result.push(remaining);

  return isBold ? <strong key={key}>{result}</strong> : result;
}

export function renderBoldQuotes(text) {
  return text.split("**").flatMap((part, idx) => {
    const result = parseTildes(part, idx % 2 === 1, idx);
    return Array.isArray(result) ? result : [result];
  });
}

// Extract a Spotify track ID from a full track URL, or pass through a bare ID.
export function getSpotifyTrackId(spotifySongId) {
  if (!spotifySongId) return null;
  const urlMatch = spotifySongId.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
  return urlMatch ? urlMatch[1] : spotifySongId;
}

// Turn a YouTube watch/share/shorts URL into an embeddable iframe src, or
// null if the URL isn't a recognizable YouTube link.
export function getYoutubeEmbedUrl(url) {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/watch\?[^#]*\bv=([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }
  return null;
}

export const loadPostBody = async (type, uuid) => {
  try {
    const url = `${BASE_URL}/data/${type}/${uuid}.md`;
    const response = await fetch(url);
    if (response.ok) {
      return await response.text();
    }
    console.error('Failed to load post body:', response.status, response.statusText);
    return '';
  } catch (error) {
    console.error('Error loading post body:', error);
    return '';
  }
}

export const loadComments = async () => {
  try {
    const url = `${BASE_URL}/data/comments.txt`;
    const response = await fetch(url);
    if (response.ok) {
      const text = await response.text();
      return text.split(/\n\s*\n/).map((c) => c.trim()).filter(Boolean);
    }
    console.error('Failed to load comments:', response.status, response.statusText);
    return [];
  } catch (error) {
    console.error('Error loading comments:', error);
    return [];
  }
}

export const loadData = async (func, path) => {
  try {
    const url = `${BASE_URL}/data/${path}.json`;
    const response = await fetch(url);
    if (response.ok) {
      const jsonData = await response.json();
      if (Array.isArray(jsonData)) {
        jsonData.sort((a, b) => b.order - a.order);
      }
      func(jsonData);
    } else {
      console.error('Failed to load data:', response.status, response.statusText);
      func([]);
    }
  } catch (error) {
    console.error('Error loading data:', error);
    func([]);
  }
}

export function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// Weaves `null` placeholders into a list of items: forced every `forceCount`
// items, and with `randomChance` probability otherwise. Used to intersperse
// comment cards among photo grids.
export function insertEmptySquares(items, forceCount, randomChance) {
  const result = [];
  let count = 0;

  items.forEach((item, index) => {
    result.push(item);
    count++;

    if (count >= forceCount) {
      result.push(null);
      count = 0;
    } else if (index < items.length - 1 && Math.random() < randomChance) {
      result.push(null);
      count = 0;
    }
  });

  return result;
}

// Index of the null placeholder at position `i` among all placeholders seen so
// far in `items` (i.e. which shuffled comment it should show).
export function getPlaceholderIndex(items, i) {
  return items.slice(0, i + 1).filter((x) => x === null).length - 1;
}

export function timeAgo(isoDate) {
  const now = new Date();
  const past = new Date(isoDate);
  const diffMs = now - past;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (days < 365) return `${months} month${months > 1 ? 's' : ''} ago`;
  return `${years} year${years > 1 ? 's' : ''} ago`;
}
