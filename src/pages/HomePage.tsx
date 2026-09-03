import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Tv, ArrowRight } from 'lucide-react';
import { useReviews } from '../hooks/useReviews';
import { reviewsApi } from '../api/reviews';
import type { ReviewDetail } from '../types/review';
import { HeroReview } from '../components/reviews/HeroReview';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorDisplay } from '../components/common/ErrorDisplay';
import { PosterImage } from '../components/common/PosterImage';

export const HomePage: React.FC = () => {
  const { reviews, loading, error, refetch } = useReviews();
  const [featuredList, setFeaturedList] = useState<ReviewDetail[]>([]);

  // Fetch full details for the top 3-4 notable reviews for the sliding hero carousel
  useEffect(() => {
    if (reviews && reviews.length > 0) {
      // Pick standout titles: Django Unchained, Obsession, Loki, Inglourious Basterds
      const preferredIds = ['django-unchained', 'obsession', 'loki', 'inglourious-basterds'];
      const targetIds = preferredIds.filter((id) => reviews.some((r) => r.id === id));
      const chosenIds = targetIds.length > 0 ? targetIds : reviews.slice(0, 3).map((r) => r.id);

      Promise.all(
        chosenIds.map((id) => reviewsApi.getReviewById(id).catch(() => null))
      ).then((details) => {
        setFeaturedList(details.filter((d): d is ReviewDetail => Boolean(d)));
      });
    }
  }, [reviews]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <LoadingSpinner message="Fetching reviews from Emanuel's API..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <ErrorDisplay title="Unable to connect to Review API" message={error} onRetry={refetch} />
      </div>
    );
  }

  // Derive Best of Film and TV dynamically (6 items each for a balanced grid)
  const bestOfFilm = [...reviews]
    .filter((r) => r.type === 'film')
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const bestOfTV = [...reviews]
    .filter((r) => r.type === 'tv')
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const latestReviews = [...reviews]
    .sort((a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime())
    .slice(0, 6);

  const sortedAll = [...reviews].sort((a, b) => b.score - a.score);
  const highestEver = sortedAll[0];
  const lowestEver = sortedAll[sortedAll.length - 1];

  return (
    <div className="container fade-in" style={{ paddingTop: '2rem' }}>
      {/* Dynamic Sliding Hero Carousel */}
      {featuredList.length > 0 && <HeroReview reviews={featuredList} />}

      {/* Overview Stats Strip */}
      <div className="overview-metric-strip">
        <Link to="/reviews" className="metric-item">
          <span className="metric-number">{reviews.length}</span>
          <span className="metric-text">Total Reviews</span>
        </Link>

        <Link to="/reviews" className="metric-item">
          <span className="metric-number">{reviews.filter((r) => r.type === 'film').length}</span>
          <span className="metric-text">Feature Films</span>
        </Link>

        <Link to="/reviews" className="metric-item">
          <span className="metric-number">{reviews.filter((r) => r.type === 'tv').length}</span>
          <span className="metric-text">TV Series</span>
        </Link>

        <Link to="/stats" className="metric-item">
          <div className="metric-rating-wrapper">
            <span className="metric-number text-gold">
              {(reviews.reduce((acc, r) => acc + r.score, 0) / reviews.length).toFixed(2)}
            </span>
            <span className="metric-star-icon">★</span>
          </div>
          <span className="metric-text">Average Rating</span>
        </Link>
      </div>

      {/* Latest Reviews Section */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div className="section-header">
          <div className="section-header-info">
            <h2 className="section-title">Latest Reviews</h2>
            <p className="section-subtitle">Freshly added entries evaluated with Emanuel's precision matrix</p>
          </div>
          <Link to="/reviews" className="btn btn-secondary section-view-all">
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="reviews-grid">
          {latestReviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </section>

      {/* Best of Film Section */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <Trophy size={20} color="var(--color-accent-gold)" />
              <span>Best of Film</span>
            </h2>
            <p className="section-subtitle">Top scoring motion pictures ranked by objective metrics</p>
          </div>
        </div>

        <div className="reviews-grid">
          {bestOfFilm.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </section>

      {/* Best of TV Section */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <Tv size={20} color="#a78bfa" />
              <span>Best of Television</span>
            </h2>
            <p className="section-subtitle">The finest serialized storytelling according to Emanuel</p>
          </div>
        </div>

        <div className="reviews-grid">
          {bestOfTV.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </section>

      {/* The Extremes Section */}
      {highestEver && lowestEver && (
        <section style={{ marginBottom: '3rem' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">The Extremes</h2>
              <p className="section-subtitle">The masterpiece vs. the absolute disaster</p>
            </div>
          </div>

          <div className="extremes-grid">
            {/* Highest */}
            <Link to={`/reviews/${highestEver.id}`} className="extreme-card highest">
              <img src={highestEver.poster} alt="" className="extreme-bg-art" />
              <div className="extreme-overlay-gradient" />
              <div className="extreme-content-inner">
                <PosterImage
                  src={highestEver.poster}
                  alt={highestEver.name}
                  className="extreme-poster-thumb"
                />
                <div className="extreme-info">
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-accent-gold)', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                    Highest Score Ever
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem', color: '#fff' }}>
                    {highestEver.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="extreme-score-display" style={{ color: 'var(--color-accent-amber)' }}>
                      {highestEver.score.toFixed(2)}
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/ 5.00</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Lowest */}
            <Link to={`/reviews/${lowestEver.id}`} className="extreme-card lowest">
              <img src={lowestEver.poster} alt="" className="extreme-bg-art" />
              <div className="extreme-overlay-gradient" />
              <div className="extreme-content-inner">
                <PosterImage
                  src={lowestEver.poster}
                  alt={lowestEver.name}
                  className="extreme-poster-thumb"
                />
                <div className="extreme-info">
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-accent-red)', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                    Lowest Score Ever
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem', color: '#fff' }}>
                    {lowestEver.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="extreme-score-display" style={{ color: 'var(--color-accent-red)' }}>
                      {lowestEver.score.toFixed(2)}
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/ 5.00</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};
