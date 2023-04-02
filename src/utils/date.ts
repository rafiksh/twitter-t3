/**
 * Returns a string representing the time since the given date.
 * @param date The date to calculate the time since.
 * @returns A string representing the time since the given date.
 * @example
 * timeAgo(new Date(2023, 0, 1)) // "1 month ago"
 * timeAgo(new Date(2021, 0, 1)) // "2 years ago"
 * timeAgo(new Date(2022, 0, 1)) // "1 year ago"
 */
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
