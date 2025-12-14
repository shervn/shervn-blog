export const uid = () => (Math.random() + 1).toString(36).substring(2);

const S3_BASE_URL = 'https://shervn-blog-media.s3.amazonaws.com';

export function getImagePath(image_name, folder){
  // Header images load from local public folder
  if (folder === 'header') {
    return `${process.env.PUBLIC_URL || ''}/header/${image_name}`;
  }
  return `${S3_BASE_URL}/images/${folder}/${image_name}`;
}

export function getS3Path(path) {
  if (!path) return '';
  // Remove leading slash if present, S3 paths typically don't have it
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  const fullUrl = `${S3_BASE_URL}/${cleanPath}`;
  return fullUrl;
}

export function renderBoldQuotes(text){
    const parts = text.split("|");
    return parts.map((part, idx) => 
      idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
    );
};

export const loadData = async (func, path) => {
  try {
    const url = `${S3_BASE_URL}/data/${path}.json`;
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
