import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { ReviewSummary } from '../../types/review';
import { PosterImage } from '../common/PosterImage';

interface ReviewCardProps {
  review: ReviewSummary;
  badgeText?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, badgeText }) => {
  return (
    <Link to={`/reviews/${review.id}`} className="review-card">
      <div className="card-poster-wrapper">
        <PosterImage
          src={review.poster}
          alt={`${review.name} poster`}
          className="card-poster"
        />

        {/* Media type tag */}
        <div className="card-type-tag">
          <span className={`badge ${review.type === 'tv' ? 'badge-tv' : 'badge-film'}`}>
            {badgeText || review.type}
          </span>
        </div>

        {/* Score pill */}
        <div className="card-score-badge">
          <Star size={13} fill="#fbbf24" color="#fbbf24" />
          <span>{review.score.toFixed(2)}</span>
        </div>
      </div>

      <div className="card-details">
        <h4 className="card-title" title={review.name}>
          {review.name}
        </h4>
        <div className="card-meta">
          <span>{review.year}</span>
          <span>{review.type === 'tv' ? 'TV Series' : 'Film'}</span>
        </div>
      </div>
    </Link>
  );
};
