import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clapperboard, Music, ExternalLink, ArrowLeft, Star, Clock } from 'lucide-react';
import { useReviewDetail } from '../hooks/useReviewDetail';
import { useReviews } from '../hooks/useReviews';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorDisplay } from '../components/common/ErrorDisplay';
import { PosterImage } from '../components/common/PosterImage';
import { RatingBreakdown } from '../components/reviews/RatingBreakdown';
import { ReviewCard } from '../components/reviews/ReviewCard';

export const ReviewDetailPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  // Support both /reviews/:id and direct path matching
  const id = params.id || (typeof window !== 'undefined' ? window.location.pathname.replace(/^\//, '') : '');
  const { review, loading, error } = useReviewDetail(id);
  const { reviews } = useReviews();

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '5rem' }}>
        <LoadingSpinner message="Fetching review details from API..." />
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="container" style={{ paddingTop: '5rem' }}>
        <ErrorDisplay
          title="Review Not Found"
          message={error || `Could not find a review for ID "${id}".`}
        />
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/reviews" className="btn btn-secondary">
            <ArrowLeft size={16} />
            <span>Return to Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  // Format dates safely
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

  // Recommendations: Other reviews of the same type or similar rating
  const relatedReviews = reviews
    .filter((r) => r.id !== review.id && r.type === review.type)
    .slice(0, 4);

  return (
    <div className="fade-in">
      {/* Cinematic Hero Header */}
      <div className="detail-hero-section">
        {review.artwork?.pageArt && (
          <img
            src={review.artwork.pageArt}
            alt={`${review.name} banner artwork`}
            className="detail-pageart-backdrop"
          />
        )}
        <div className="detail-backdrop-gradient" />

        <div className="container" style={{ width: '100%' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Link
              to="/reviews"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to all reviews</span>
            </Link>
          </div>

          <div className="detail-header-grid">
            <PosterImage
              src={review.artwork?.poster}
              alt={review.name}
              className="detail-poster-img"
              loading="eager"
            />

            <div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className={`badge ${review.type === 'tv' ? 'badge-tv' : 'badge-film'}`}>
                  {review.type === 'tv' ? 'Television Series' : 'Feature Film'}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{review.year}</span>
              </div>

              <h1 className="detail-title">{review.name}</h1>

              {/* Score Display */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', margin: '1rem 0 1.5rem 0', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(245, 158, 11, 0.15)', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <Star size={24} fill="var(--color-accent-amber)" color="var(--color-accent-amber)" />
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-accent-amber)', lineHeight: 1 }}>
                    {review.score.toFixed(2)}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 5.00</span>
                </div>

                {review.imdb?.url && (
                  <a
                    href={review.imdb.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  >
                    <span>View on IMDb</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>

              {/* Quick info row */}
              <div className="detail-meta-row">
                {review.credits?.directors && review.credits.directors.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clapperboard size={15} color="var(--text-muted)" />
                    <span>Directed by <strong>{review.credits.directors.join(', ')}</strong></span>
                  </div>
                )}
                {formattedWatched && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={15} color="var(--text-muted)" />
                    <span>Watched: {formattedWatched}</span>
                  </div>
                )}
                {formattedReviewed && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={15} color="var(--text-muted)" />
                    <span>Reviewed: {formattedReviewed}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container">
        <div className="detail-content-layout">
          {/* Left Column: Written Review + Rating Breakdown */}
          <div>
            {/* Written Review */}
            <article className="review-article-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent-gold)' }}>
                  Emanuel's Review
                </span>
              </div>
              <div className="review-text">{review.review}</div>
            </article>

            {/* Subcategory Scoring Matrix */}
            {review.scores && <RatingBreakdown scores={review.scores} />}
          </div>

          {/* Right Column: Metadata Sidebar */}
          <aside className="detail-sidebar">
            {/* IMDb Synopsis box */}
            {review.imdb?.description && (
              <div className="sidebar-box">
                <div className="sidebar-title">Synopsis</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {review.imdb.description}
                </p>
              </div>
            )}

            {/* Directors */}
            {review.credits?.directors && review.credits.directors.length > 0 && (
              <div className="sidebar-box">
                <div className="sidebar-title">
                  <Clapperboard size={15} />
                  <span>Directing</span>
                </div>
                <div className="credits-tag-list">
                  {review.credits.directors.map((dir, i) => (
                    <Link key={i} to={`/search?q=director:${encodeURIComponent(dir)}`} className="credit-tag">
                      {dir}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Actors / Cast */}
            {review.credits?.actors && review.credits.actors.length > 0 && (
              <div className="sidebar-box">
                <div className="sidebar-title">
                  <User size={15} />
                  <span>Featured Cast</span>
                </div>
                <div className="credits-tag-list">
                  {review.credits.actors.map((actor, i) => (
                    <Link key={i} to={`/search?q=actor:${encodeURIComponent(actor)}`} className="credit-tag">
                      {actor}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Composers / Music */}
            {review.credits?.composers && review.credits.composers.length > 0 && (
              <div className="sidebar-box">
                <div className="sidebar-title">
                  <Music size={15} />
                  <span>Score & Music</span>
                </div>
                <div className="credits-tag-list">
                  {review.credits.composers.map((composer, i) => (
                    <Link key={i} to={`/search?q=${encodeURIComponent(composer)}`} className="credit-tag">
                      {composer}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* More Like This Strip */}
        {relatedReviews.length > 0 && (
          <section style={{ marginTop: '4rem', marginBottom: '2rem' }}>
            <div className="section-header">
              <div>
                <h3 className="section-title">More {review.type === 'tv' ? 'Television' : 'Film'} Reviews</h3>
                <p className="section-subtitle">Continue exploring other entries from Emanuel's archive</p>
              </div>
            </div>
            <div className="reviews-grid">
              {relatedReviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
