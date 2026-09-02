import React from 'react';
import { Star } from 'lucide-react';

interface RatingBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showMax?: boolean;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  score,
  size = 'md',
  showMax = false,
}) => {
  const formattedScore = typeof score === 'number' ? score.toFixed(2) : '0.00';

  const sizeClass = size === 'lg' ? 'rating-pill-lg' : '';

  return (
    <div className={`rating-pill ${sizeClass}`}>
      <Star
        size={size === 'lg' ? 20 : size === 'sm' ? 12 : 14}
        fill="currentColor"
        strokeWidth={0}
      />
      <span>{formattedScore}</span>
      {showMax && (
        <span style={{ fontSize: '0.65em', color: 'var(--text-muted)', fontWeight: 500 }}>
          / 5
        </span>
      )}
    </div>
  );
};
