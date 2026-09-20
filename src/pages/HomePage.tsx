import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReviews } from '../hooks/useReviews';
import { reviewsApi } from '../api/reviews';
import type { ReviewDetail } from '../types/review';
import { HeroReview } from '../components/reviews/HeroReview';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorDisplay } from '../components/common/ErrorDisplay';

export const HomePage: React.FC = () => {
  const { reviews, loading, error, refetch } = useReviews();
  const [featuredList, setFeaturedList] = useState<ReviewDetail[]>([]);

  // Fetch full details for most recently added spotlight reviews
  useEffect(() => {
    if (reviews && reviews.length > 0) {
      // Select the top 4 most recently added reviews
      const sortedByRecent = [...reviews].sort(
        (a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime()
      );
      const chosenIds = sortedByRecent.slice(0, 4).map((r) => r.id);

      Promise.all(
        chosenIds.map((id) => reviewsApi.getReviewById(id).catch(() => null))
      ).then((details) => {
        setFeaturedList(details.filter((d): d is ReviewDetail => Boolean(d)));
      });
    }
  }, [reviews]);

  if (loading) {
    return <LoadingSpinner message="Accessing Emanuel's film archive..." />;
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Could not connect to database"
        message={error}
        onRetry={refetch}
      />
    );
  }

  // Derive data
  const bestOfFilm = [...reviews]
    .filter((r) => r.type === 'film')
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const bestOfTV = [...reviews]
    .filter((r) => r.type === 'tv')
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const latestReviews = [...reviews]
    .sort((a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime())
    .slice(0, 5);

  const sortedAll = [...reviews].sort((a, b) => b.score - a.score);
  const highestEver = sortedAll[0];
  const lowestEver = sortedAll[sortedAll.length - 1];
  const avgScore = (reviews.reduce((acc, r) => acc + r.score, 0) / reviews.length).toFixed(2);

  return (
    <div className="retro-home-page">
      {/* Editorial Welcome Box (Late-90s Web Greeting) */}
      <div className="box-yellow" style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <strong style={{ color: '#003366', fontSize: '12px' }}>
            EDITOR'S WELCOME NOTICE
          </strong>
          <span style={{ fontSize: '10px', color: '#666' }}>Updated Daily</span>
        </div>
        <p style={{ margin: '4px 0 0 0', fontSize: '11px', lineHeight: 1.35 }}>
          Welcome to <strong>Emanuel's Reviews</strong>, the internet's home for uncompromising,
          mathematically calibrated film and television criticism. Each work is dissected across eight
          distinct criteria groups to yield an objective score out of 5.00. Bookmark this page (Ctrl+D)
          and explore our archive below!
        </p>
      </div>

      {/* Featured Spotlight Review (Amazon 1999 Highlight Box) */}
      {featuredList.length > 0 && <HeroReview reviews={featuredList} />}

      {/* Overview Statistics Strip */}
      <table className="retro-metric-table">
        <tbody>
          <tr>
            <td>
              <Link to="/reviews" style={{ textDecoration: 'none' }}>
                <span className="metric-huge">{reviews.length}</span>
                <span className="metric-caption">Titles Reviewed</span>
              </Link>
            </td>
            <td>
              <Link to="/reviews?type=film" style={{ textDecoration: 'none' }}>
                <span className="metric-huge">{reviews.filter((r) => r.type === 'film').length}</span>
                <span className="metric-caption">Feature Films</span>
              </Link>
            </td>
            <td>
              <Link to="/reviews?type=tv" style={{ textDecoration: 'none' }}>
                <span className="metric-huge">{reviews.filter((r) => r.type === 'tv').length}</span>
                <span className="metric-caption">TV Series</span>
              </Link>
            </td>
            <td>
              <Link to="/stats" style={{ textDecoration: 'none' }}>
                <span className="metric-huge" style={{ color: '#cc8800' }}>{avgScore}</span>
                <span className="metric-caption">Database Avg</span>
              </Link>
            </td>
          </tr>
        </tbody>
      </table>

      {/* The Extremes: Masterpiece vs Disaster */}
      {highestEver && lowestEver && (
        <div className="retro-extremes-section" style={{ marginBottom: '12px' }}>
          <div className="retro-section-header gold">
            <span className="retro-section-title">THE EXTREMES: MASTERPIECE VS. DISASTER</span>
          </div>

          <div className="retro-extremes-grid">
            {/* Highest */}
            <div className="retro-extreme-box highest">
              <div className="retro-extreme-label high">&#9650; HIGHEST RATED TITLE</div>
              <div className="retro-extreme-body">
                <Link to={`/reviews/${highestEver.id}`}>
                  <img
                    src={highestEver.poster}
                    alt={highestEver.name}
                    className="retro-extreme-thumb"
                  />
                </Link>
                <div className="retro-extreme-info">
                  <div className="retro-extreme-title">
                    <Link to={`/reviews/${highestEver.id}`}>{highestEver.name}</Link> ({highestEver.year})
                  </div>
                  <div style={{ color: '#006600', fontWeight: 'bold' }}>
                    Score: {highestEver.score.toFixed(2)} / 5.00
                  </div>
                  <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                    [{highestEver.type === 'tv' ? 'Television' : 'Feature Film'}]
                  </div>
                  <div style={{ marginTop: '3px' }}>
                    <Link to={`/reviews/${highestEver.id}`}>Read Review &gt;&gt;</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Lowest */}
            <div className="retro-extreme-box lowest">
              <div className="retro-extreme-label low">&#9660; LOWEST RATED ("THE RAZZIE")</div>
              <div className="retro-extreme-body">
                <Link to={`/reviews/${lowestEver.id}`}>
                  <img
                    src={lowestEver.poster}
                    alt={lowestEver.name}
                    className="retro-extreme-thumb"
                  />
                </Link>
                <div className="retro-extreme-info">
                  <div className="retro-extreme-title">
                    <Link to={`/reviews/${lowestEver.id}`}>{lowestEver.name}</Link> ({lowestEver.year})
                  </div>
                  <div style={{ color: '#990000', fontWeight: 'bold' }}>
                    Score: {lowestEver.score.toFixed(2)} / 5.00
                  </div>
                  <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                    [{lowestEver.type === 'tv' ? 'Television' : 'Feature Film'}]
                  </div>
                  <div style={{ marginTop: '3px' }}>
                    <Link to={`/reviews/${lowestEver.id}`}>Read Review &gt;&gt;</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Latest Reviews Section */}
      <section style={{ marginBottom: '14px' }}>
        <div className="retro-section-header">
          <span className="retro-section-title">LATEST REVIEWS ADDED TO ARCHIVE</span>
          <Link to="/reviews" className="retro-section-more">
            [ View All {reviews.length} Titles &gt;&gt; ]
          </Link>
        </div>

        <div className="retro-reviews-list">
          {latestReviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </section>

      {/* Best of Film Section */}
      <section style={{ marginBottom: '14px' }}>
        <div className="retro-section-header red">
          <span className="retro-section-title">BEST OF FILM (HIGHEST EVALUATED MOVIES)</span>
          <Link to="/reviews?type=film" className="retro-section-more">
            [ More Films &gt;&gt; ]
          </Link>
        </div>

        <div className="retro-reviews-list">
          {bestOfFilm.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </section>

      {/* Best of TV Section */}
      {bestOfTV.length > 0 && (
        <section style={{ marginBottom: '14px' }}>
          <div className="retro-section-header">
            <span className="retro-section-title">BEST OF TELEVISION (SERIALIZED DRAMA &amp; COMEDY)</span>
            <Link to="/reviews?type=tv" className="retro-section-more">
              [ More TV &gt;&gt; ]
            </Link>
          </div>

          <div className="retro-reviews-list">
            {bestOfTV.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
