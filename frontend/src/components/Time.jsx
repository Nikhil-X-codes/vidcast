function timeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);

  const units = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (let unit of units) {
    const value = Math.floor(seconds / unit.seconds);
    if (value >= 1) {
      return `${value} ${unit.label}${value > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}


export default function Time({ date }) {
  return (
    <span className="text-gray-500 text-xs">
      {timeAgo(date)}
    </span>
  );
}