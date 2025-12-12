export const uid = () => (Math.random() + 1).toString(36).substring(2);

export function getImagePath(image_name, folder){
  console.log(`${process.env.PUBLIC_URL}/images/${folder}/${image_name}`);
        return `${process.env.PUBLIC_URL}/images/${folder}/${image_name}` 
}

export function renderBoldQuotes(text){
    // Split by quoted parts, remove quotes
    const parts = text.split(/"(.*?)"/g);
    return parts.map((part, idx) => 
      idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
    );
};

export const loadData = async (func, path) => {
  try {
    const response = await fetch(process.env.PUBLIC_URL + `/data/${path}.json`);
    if (response.ok) {
      const jsonData = await response.json();
      if (Array.isArray(jsonData)) {
        jsonData.sort((a, b) => b.order - a.order);
      }
      func(jsonData);
    } else {
      func([]);
    }
  } catch (error) {
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
