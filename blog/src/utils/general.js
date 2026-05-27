import FadingWords from "../Components/FadingWords";

export const uid = () => (Math.random() + 1).toString(36).substring(2);

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
  return text.split("|").flatMap((part, idx) => {
    const result = parseTildes(part, idx % 2 === 1, idx);
    return Array.isArray(result) ? result : [result];
  });
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
