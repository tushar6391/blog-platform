// Generate a consistent gradient color pair for a given username.

const GRADIENTS = [
  ['#B45309', '#D97706'], // amber
  ['#7C3AED', '#A78BFA'], // purple
  ['#059669', '#10B981'], // green
  ['#DC2626', '#F87171'], // red
  ['#0891B2', '#22D3EE'], // cyan
  ['#DB2777', '#F472B6'], // pink
  ['#4F46E5', '#818CF8'], // indigo
  ['#65A30D', '#A3E635'], // lime
  ['#1C1917', '#44403C'], // stone
  ['#B91C1C', '#F87171'], // crimson
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getAvatarGradient(username) {
  if (!username) return GRADIENTS[0];
  const index = hashString(username) % GRADIENTS.length;
  return GRADIENTS[index];
}

export function getInitials(username) {
  if (!username) return '?';
  const parts = username.trim().split(/[\s_-]+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Estimate reading time. Average adult reads ~225 words/minute.
export function getReadingTime(content) {
  if (!content) return '1 min read';
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 225));
  return `${minutes} min read`;
}

// Format a date as "Dec 9, 2026"
export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}