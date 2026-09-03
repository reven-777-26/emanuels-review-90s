import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useReviews } from '../hooks/useReviews';
import { useStats } from '../hooks/useStats';
import { reviewsApi } from '../api/reviews';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorDisplay } from '../components/common/ErrorDisplay';
import { PosterImage } from '../components/common/PosterImage';

interface PersonCount {
  name: string;
  count: number;
  type: 'actor' | 'director' | 'composer';
}

export const StatsPage: React.FC = () => {
  const { reviews, loading: reviewsLoading, error, refetch } = useReviews();
  const stats = useStats(reviews);

  // Load detailed reviews to calculate top actors/directors safely from real API data
  const [people, setPeople] = useState<PersonCount[]>([]);
  const [peopleLoading, setPeopleLoading] = useState(false);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      setPeopleLoading(true);
      Promise.all(reviews.map((r) => reviewsApi.getReviewById(r.id).catch(() => null)))
        .then((details) => {
          const actorCounts = new Map<string, number>();
          const directorCounts = new Map<string, number>();
          const composerCounts = new Map<string, number>();

          details.forEach((d) => {
            if (!d) return;
            d.credits?.actors?.forEach((a) => actorCounts.set(a, (actorCounts.get(a) || 0) + 1));
            d.credits?.directors?.forEach((dir) => directorCounts.set(dir, (directorCounts.get(dir) || 0) + 1));
            d.credits?.composers?.forEach((c) => composerCounts.set(c, (composerCounts.get(c) || 0) + 1));
          });

          const topActors: PersonCount[] = Array.from(actorCounts.entries())
            .filter(([_, count]) => count > 1)
            .sort((a, b) => b[1] - a[1])
            .map(([name, count]) => ({ name, count, type: 'actor' }));

          const topDirectors: PersonCount[] = Array.from(directorCounts.entries())
            .filter(([_, count]) => count > 1)
            .sort((a, b) => b[1] - a[1])
            .map(([name, count]) => ({ name, count, type: 'director' }));

          const topComposers: PersonCount[] = Array.from(composerCounts.entries())
            .filter(([_, count]) => count > 1)
            .sort((a, b) => b[1] - a[1])
            .map(([name, count]) => ({ name, count, type: 'composer' }));

          setPeople([...topActors, ...topDirectors, ...topComposers]);
        })
        .finally(() => setPeopleLoading(false));
    }
  }, [reviews]);

  if (reviewsLoading) {
    return (
      <div className="container" style={{ paddingTop: '4rem' }}>
        <LoadingSpinner message="Calculating database statistics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '4rem' }}>
        <ErrorDisplay title="Failed to compute statistics" message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      {/* Page Title */}
      <div className="stats-header">
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          The Numbers & Data
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          A statistical breakdown of {stats.totalReviews} evaluated motion pictures and television series.
        </p>
      </div>

      {/* Hero KPI Cards */}
      <div className="stats-hero-grid">
        <div className="stat-metric-card">
          <span className="stat-metric-label">Total Reviews</span>
          <div className="stat-metric-value">{stats.totalReviews}</div>
          <span className="stat-metric-caption">All reviewed works</span>
        </div>

        <div className="stat-metric-card">
          <span className="stat-metric-label">Average Score</span>
          <div className="stat-metric-value text-gold">
            {stats.averageScore.toFixed(2)}
            <span className="stat-metric-star">★</span>
          </div>
          <span className="stat-metric-caption">Out of 5.00 scale</span>
        </div>

        <div className="stat-metric-card">
          <span className="stat-metric-label">Feature Films</span>
          <div className="stat-metric-value">{stats.filmCount}</div>
          <span className="stat-metric-caption">{stats.filmPercentage}% of archive</span>
        </div>

        <div className="stat-metric-card">
          <span className="stat-metric-label">TV Series</span>
          <div className="stat-metric-value">{stats.tvCount}</div>
          <span className="stat-metric-caption">{stats.tvPercentage}% of archive</span>
        </div>
      </div>

      {/* The Extremes Section */}
      {stats.highestRated && stats.lowestRated && (
        <section style={{ marginBottom: '2.5rem' }}>
          <div className="section-header">
            <div className="section-header-info">
              <h2 className="section-title">The Extremes</h2>
              <p className="section-subtitle">The catalog masterpiece vs. the lowest evaluated title</p>
            </div>
          </div>

          <div className="extremes-grid">
            {/* Highest */}
            <Link to={`/reviews/${stats.highestRated.id}`} className="extreme-card highest">
              <img src={stats.highestRated.poster} alt="" className="extreme-bg-art" />
              <div className="extreme-overlay-gradient" />
              <div className="extreme-content-inner">
                <PosterImage
                  src={stats.highestRated.poster}
                  alt={stats.highestRated.name}
                  className="extreme-poster-thumb"
                />
                <div className="extreme-info">
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-accent-gold)', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                    Highest Rated
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.45rem', color: '#fff' }}>
                    {stats.highestRated.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-accent-amber)', fontWeight: 800, fontSize: '1.15rem' }}>
                    <span>★</span>
                    <span>{stats.highestRated.score.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Lowest */}
            <Link to={`/reviews/${stats.lowestRated.id}`} className="extreme-card lowest">
              <img src={stats.lowestRated.poster} alt="" className="extreme-bg-art" />
              <div className="extreme-overlay-gradient" />
              <div className="extreme-content-inner">
                <PosterImage
                  src={stats.lowestRated.poster}
                  alt={stats.lowestRated.name}
                  className="extreme-poster-thumb"
                />
                <div className="extreme-info">
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-accent-red)', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                    Lowest Rated
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.45rem', color: '#fff' }}>
                    {stats.lowestRated.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-accent-red)', fontWeight: 800, fontSize: '1.15rem' }}>
                    <span>★</span>
                    <span>{stats.lowestRated.score.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Segmented Media Ratio Card */}
      <div className="stats-card">
        <div className="stats-card-header">
          <h2 className="stats-card-title">Media Distribution</h2>
          <span className="stats-card-subtitle">Feature films versus episodic television</span>
        </div>

        <div className="stats-ratio-bar">
          <div
            className="stats-ratio-segment films"
            style={{ width: `${stats.filmPercentage}%` }}
            title={`Films: ${stats.filmPercentage}%`}
          />
          <div
            className="stats-ratio-segment tv"
            style={{ width: `${stats.tvPercentage}%` }}
            title={`TV Series: ${stats.tvPercentage}%`}
          />
        </div>

        <div className="stats-ratio-legend">
          <div className="ratio-legend-item">
            <span className="ratio-dot films" />
            <span className="ratio-name">Feature Films</span>
            <span className="ratio-count">{stats.filmCount} titles</span>
            <span className="ratio-pct">({stats.filmPercentage}%)</span>
          </div>
          <div className="ratio-legend-item">
            <span className="ratio-dot tv" />
            <span className="ratio-name">Television</span>
            <span className="ratio-count">{stats.tvCount} series</span>
            <span className="ratio-pct">({stats.tvPercentage}%)</span>
          </div>
        </div>
      </div>

      {/* Rating Distribution & Decades Breakdown */}
      <div className="stats-columns-grid">
        {/* Rating Distribution */}
        <div className="stats-card">
          <div className="stats-card-header">
            <h2 className="stats-card-title">Score Distribution</h2>
            <span className="stats-card-subtitle">Reviews grouped by score bracket</span>
          </div>

          <div className="stats-dist-list">
            {stats.distribution.map((d) => (
              <div key={d.stars} className="dist-row">
                <div className="dist-stars">
                  <span>{d.stars}</span>
                  <span className="dist-star-icon">★</span>
                </div>
                <div className="dist-bar-track">
                  <div className="dist-bar-fill" style={{ width: `${d.percentage}%` }} />
                </div>
                <div className="dist-count">
                  <span>{d.count}</span>
                  <span className="dist-pct">({d.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Release Decades Breakdown */}
        <div className="stats-card">
          <div className="stats-card-header">
            <h2 className="stats-card-title">Catalog by Release Decade</h2>
            <span className="stats-card-subtitle">Title counts and historical averages</span>
          </div>

          <div className="decades-grid">
            {stats.decades.map((dec) => (
              <div key={dec.decade} className="decade-tile">
                <div className="decade-name">{dec.decade}</div>
                <div className="decade-score">
                  <span>{dec.avgScore.toFixed(2)}</span>
                  <span className="decade-star">★</span>
                </div>
                <div className="decade-count">
                  {dec.count} {dec.count === 1 ? 'title' : 'titles'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Frequently Evaluated Talent */}
      <div className="stats-card">
        <div className="stats-card-header">
          <h2 className="stats-card-title">Frequently Evaluated Talent</h2>
          <span className="stats-card-subtitle">Directors, actors & composers with multiple reviews</span>
        </div>

        {peopleLoading ? (
          <div className="stats-loading-box">
            Analyzing cast & director credits...
          </div>
        ) : (
          <div className="talent-grid">
            {people.map((person, idx) => (
              <Link
                key={idx}
                to={`/search?q=${encodeURIComponent(person.name)}`}
                className="talent-card"
              >
                <div className="talent-info">
                  <div className="talent-name">{person.name}</div>
                  <span
                    className={`badge ${person.type === 'director' ? 'badge-film' : 'badge-tv'}`}
                    style={{ alignSelf: 'flex-start', fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}
                  >
                    {person.type}
                  </span>
                </div>
                <div className="talent-count-badge">
                  <span>{person.count} reviews</span>
                  <ChevronRight size={14} className="talent-chevron" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
