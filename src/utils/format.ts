export const renderStars = (score: number): string => {
  const rounded = Math.round(score);
  const clamped = Math.min(5, Math.max(0, rounded));
  return '★'.repeat(clamped) + '☆'.repeat(5 - clamped);
};
