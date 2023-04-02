export const timeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    if (interval > 2) return `${Math.floor(interval)} years ago`;
    return `${Math.floor(interval)} year ago`;
  }

  interval = seconds / 2592000;

  if (interval > 1) {
    if (interval > 2) return `${Math.floor(interval)} months ago`;
    return `${Math.floor(interval)} month ago`;
  }

  interval = seconds / 86400;

  if (interval > 1) {
    if (interval > 2) return `${Math.floor(interval)} days ago`;
    return `${Math.floor(interval)} day ago`;
  }

  interval = seconds / 3600;

  if (interval > 1) {
    if (interval > 2) return `${Math.floor(interval)} hours ago`;
    return `${Math.floor(interval)} hour ago`;
  }

  interval = seconds / 60;

  if (interval > 1) {
    if (interval > 2) return `${Math.floor(interval)} minutes ago`;
    return `${Math.floor(interval)} minute ago`;
  }

  return `${Math.floor(seconds)} seconds ago`;
};
