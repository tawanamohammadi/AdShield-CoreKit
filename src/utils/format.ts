export const formatDateTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

export const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export const normalizeUrl = (value: string) => {
  if (!/^https?:\/\//i.test(value)) {
    return `https://${value}`;
  }
  return value;
};
