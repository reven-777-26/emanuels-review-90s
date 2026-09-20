import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useReviewDetail } from '../hooks/useReviewDetail';
import { useReviews } from '../hooks/useReviews';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorDisplay } from '../components/common/ErrorDisplay';
import { PosterImage } from '../components/common/PosterImage';
import { RatingBreakdown } from '../components/reviews/RatingBreakdown';
import { renderStars } from '../utils/format';

interface ReviewDetailPageProps {
  reviewId?: string;
  isRandomPick?: boolean;
  onPickAnother?: () => void;
}

export const ReviewDetailPage: React.FC<ReviewDetailPageProps> = ({
  reviewId: propReviewId,
  isRandomPick = false,
  onPickAnother,
}) => {
  const params = useParams<{ id: string }>();
  const id = propReviewId || params.id || (typeof window !== 'undefined' ? window.location.pathname.replace(/^\//, '') : '');
  const { review, loading, error } = useReviewDetail(id);
  const { reviews } = useReviews();

  if (loading) {
    return <LoadingSpinner message="Retrieving film review and score data from archive..." />;
  }

  if (error || !review) {
    return (
      <div style={{ padding: '12px 0' }}>
        <ErrorDisplay
          title="Review Record Not Located"
          message={error || `Could not find a review matching identifier "${id}".`}
        />
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <Link to="/reviews" className="btn-retro">
            &lt;&lt; Return to Review Directory
          </Link>
        </div>
      </div>
    );
  }

  const formattedWatched = review.watchedAt
    ? new Date(review.watchedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const formattedReviewed = review.reviewedAt
    ? new Date(review.reviewedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const relatedReviews = reviews
    .filter((r) => r.id !== review.id && r.type === review.type)
    .slice(0, 4);

  return (
    <div className="detail-page-wrapper">
      {/* Random Pick Alert Banner */}
      {isRandomPick && (
        <div className="retro-random-banner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span style={{ marginRight: '6px' }}>&#9860;</span>
              <strong>RANDOM REEL VAULT PICK:</strong> You have been randomly directed to this archive evaluation!
            </div>
            {onPickAnother && (
              <button
                type="button"
                onClick={onPickAnother}
                className="btn-retro btn-retro-gold"
                style={{ cursor: 'pointer', padding: '2px 8px' }}
              >
                [ Spin Again / Pick Another &gt;&gt; ]
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation Breadcrumb */}
      <div className="detail-nav-back">
        <Link to="/">&lt;&lt; Home</Link> &bull;{' '}
        <Link to="/reviews">Review Directory</Link> &bull;{' '}
        <span>{review.name}</span>
      </div>

      {/* Main Title Banner */}
      <div className="detail-title-banner">
        <h1 className="detail-title-h1">
          {review.name.toUpperCase()} ({review.year})
        </h1>
        <div className="detail-title-sub">
          Format: {review.type === 'tv' ? 'Television Series' : 'Feature Film'} &bull;
          Review Archive ID: #{review.id}
        </div>
      </div>

      {/* Top 2-Column Summary Table: Poster + Specifications */}
      <div className="detail-top-grid">
        <div className="detail-poster-cell">
          <PosterImage
            src={review.artwork?.poster}
            alt={`${review.name} poster`}
            className="detail-main-poster"
            loading="eager"
          />
          <div style={{ fontSize: '9px', color: '#666', marginTop: '3px' }}>
            Official Promotional Poster
          </div>
        </div>

        <table className="detail-meta-table">
          <tbody>
            <tr>
              <td className="detail-meta-label">Overall Rating:</td>
              <td>
                <span className="retro-stars" style={{ fontSize: '13px' }}>
                  {renderStars(review.score)}
                </span>{' '}
                <strong style={{ color: '#800000', fontSize: '13px' }}>
                  {review.score.toFixed(2)}
                </strong>{' '}
                out of 5.00
              </td>
            </tr>
            <tr>
              <td className="detail-meta-label">Release Year:</td>
              <td>{review.year}</td>
            </tr>
            <tr>
              <td className="detail-meta-label">Media Format:</td>
              <td>{review.type === 'tv' ? 'Television Series' : 'Theatrical Feature Film'}</td>
            </tr>
            {review.credits?.directors && review.credits.directors.length > 0 && (
              <tr>
                <td className="detail-meta-label">Directed By:</td>
                <td>
                  {review.credits.directors.map((dir, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && ', '}
                      <Link to={`/search?q=director:${encodeURIComponent(dir)}`}>
                        {dir}
                      </Link>
                    </React.Fragment>
                  ))}
                </td>
              </tr>
            )}
            {review.credits?.actors && review.credits.actors.length > 0 && (
              <tr>
                <td className="detail-meta-label">Featured Cast:</td>
                <td>
                  {review.credits.actors.map((actor, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && ', '}
                      <Link to={`/search?q=actor:${encodeURIComponent(actor)}`}>
                        {actor}
                      </Link>
                    </React.Fragment>
                  ))}
                </td>
              </tr>
            )}
            {review.credits?.composers && review.credits.composers.length > 0 && (
              <tr>
                <td className="detail-meta-label">Music / Score:</td>
                <td>
                  {review.credits.composers.map((composer, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && ', '}
                      <Link to={`/search?q=${encodeURIComponent(composer)}`}>
                        {composer}
                      </Link>
                    </React.Fragment>
                  ))}
                </td>
              </tr>
            )}
            {formattedWatched && (
              <tr>
                <td className="detail-meta-label">Date Screened:</td>
                <td>{formattedWatched}</td>
              </tr>
            )}
            {formattedReviewed && (
              <tr>
                <td className="detail-meta-label">Date Reviewed:</td>
                <td>{formattedReviewed}</td>
              </tr>
            )}
            {review.imdb?.url && (
              <tr>
                <td className="detail-meta-label">Internet Link:</td>
                <td>
                  <a href={review.imdb.url} target="_blank" rel="noopener noreferrer">
                    View Title Entry on IMDb.com &gt;&gt;
                  </a>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Synopsis Panel (Pale Yellow Highlight Box) */}
      {review.imdb?.description && (
        <div className="detail-synopsis-box">
          <div className="detail-synopsis-title">PLOT SYNOPSIS:</div>
          <div>{review.imdb.description}</div>
        </div>
      )}

      {/* Main Editorial Review Section */}
      <article className="detail-review-article">
        <div className="detail-review-header">
          EMANUEL'S CRITICAL ASSESSMENT
        </div>
        <div className="detail-review-body">
          {review.review ? (
            review.review.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))
          ) : (
            <div className="retro-review-prose-pending">
              <p>
                <strong>Editorial Note:</strong> Written prose commentary has not yet been logged for this database entry.
              </p>
              <p>
                However, Emanuel&apos;s complete 8-pillar mathematical evaluation and criteria breakdown are recorded in the score matrix below.
              </p>
            </div>
          )}
        </div>
      </article>

      {/* Scoring Matrix Section */}
      {review.scores && <RatingBreakdown scores={review.scores} />}

      {/* Related Titles Section (Amazon 1999 "Customers who bought this also bought...") */}
      {relatedReviews.length > 0 && (
        <div className="detail-related-section">
          <div className="detail-related-header">
            MORE {review.type === 'tv' ? 'TELEVISION' : 'FILM'} CRITICISM YOU MAY BE INTERESTED IN
          </div>
          <div className="detail-related-body">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <tbody>
                {relatedReviews.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px dotted #ccc' }}>
                    <td style={{ width: '45px', padding: '4px 0' }}>
                      <Link to={`/reviews/${r.id}`}>
                        <PosterImage
                          src={r.poster}
                          alt={r.name}
                          style={{ width: '38px', border: '1px solid #000' }}
                        />
                      </Link>
                    </td>
                    <td style={{ padding: '4px 8px', verticalAlign: 'middle' }}>
                      <Link to={`/reviews/${r.id}`} style={{ fontWeight: 'bold' }}>
                        {r.name}
                      </Link>{' '}
                      ({r.year}) &bull; Score:{' '}
                      <span style={{ color: '#800000', fontWeight: 'bold' }}>
                        {r.score.toFixed(2)} / 5.00
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', padding: '4px 0', verticalAlign: 'middle' }}>
                      <Link to={`/reviews/${r.id}`}>[ Read Review ]</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '11px' }}>
        <Link to="/reviews">&lt;&lt; Return to All Reviews</Link> |{' '}
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); }}>
          Top of Page &uarr;
        </a>
      </div>
    </div>
  );
};
