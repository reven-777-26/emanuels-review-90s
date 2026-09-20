import React from 'react';
import { Link } from 'react-router-dom';
import type { ReviewSummary } from '../../types/review';
import { PosterImage } from '../common/PosterImage';
import { renderStars } from '../../utils/format';

interface ReviewCardProps {
  review: ReviewSummary;
  badgeText?: string;
  showDivider?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, badgeText, showDivider = true }) => {
  return (
    <div className="retro-review-item">
      <div className="retro-review-poster-col">
        <Link to={`/reviews/${review.id}`}>
          <PosterImage
            src={review.poster}
            alt={review.name}
            className="retro-thumb-img"
          />
        </Link>
      </div>

      <div className="retro-review-content-col">
        <div className="retro-review-header-line">
          <Link to={`/reviews/${review.id}`} className="retro-item-title">
            {review.name.toUpperCase()} ({review.year})
          </Link>
          <span className="retro-format-tag">
            [{review.type === 'tv' ? 'TELEVISION' : 'FEATURE FILM'}{badgeText ? ` - ${badgeText}` : ''}]
          </span>
        </div>

        <div className="retro-review-score-line">
          <span className="retro-stars" title={`${review.score.toFixed(2)} out of 5`}>
            {renderStars(review.score)}
          </span>
          <span className="retro-score-text">
            <strong>Rating:</strong> {review.score.toFixed(2)} / 5.00
          </span>
          <span className="retro-review-date">
            &bull; Added: {review.reviewedAt}
          </span>
        </div>

        <div className="retro-review-snippet">
          Emanuel's in-depth critical evaluation and granular category breakdown for this {review.type === 'tv' ? 'television series' : 'theatrical release'} is available in the archive.
        </div>

        <div className="retro-review-links-line">
          <Link to={`/reviews/${review.id}`} className="retro-read-link">
            &gt;&gt; Read Complete Review &amp; Score Matrix
          </Link>
          <span className="retro-pipe">|</span>
          <Link to={`/search?q=${encodeURIComponent(review.name)}`} className="retro-sub-link">
            Search Related
          </Link>
        </div>
      </div>

      {showDivider && <hr className="retro-item-hr" />}
    </div>
  );
};
