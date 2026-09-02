import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Star, Film, Tv, Calendar, Users } from 'lucide-react';
import { useReviews } from '../hooks/useReviews';
import { useStats } from '../hooks/useStats';
import { reviewsApi } from '../api/reviews';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorDisplay } from '../components/common/ErrorDisplay';

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
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          The Numbers & Data
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          A granular statistical analysis of Emanuel's film and television viewing catalog.
        </p>
      </div>

      {/* Hero Metrics */}
      <div className="stats-hero-grid">
        <div className="stat-metric-card">
          <div className="stat-metric-label">
            <BarChart3 size={16} color="var(--color-accent-gold)" />
            <span>Total Reviews</span>
          </div>
          <div className="stat-metric-value" style={{ color: '#fff' }}>
            {stats.totalReviews}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            All reviewed works
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-metric-label">
            <Star size={16} color="var(--color-accent-amber)" />
            <span>Average Score</span>
          </div>
          <div className="stat-metric-value" style={{ color: 'var(--color-accent-amber)' }}>
            {stats.averageScore.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Out of 5.00 stars
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-metric-label">
            <Film size={16} color="#60a5fa" />
            <span>Films Evaluated</span>
          </div>
          <div className="stat-metric-value" style={{ color: '#60a5fa' }}>
            {stats.filmCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {stats.filmPercentage}% of collection
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-metric-label">
            <Tv size={16} color="#c084fc" />
            <span>TV Series</span>
          </div>
          <div className="stat-metric-value" style={{ color: '#c084fc' }}>
            {stats.tvCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {stats.tvPercentage}% of collection
          </div>
        </div>
      </div>

      {/* Film vs TV Ratio Card */}
      <div
        style={{
          background: 'var(--bg-surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          marginBottom: '2.5rem',
        }}
      >
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Film vs. Television Distribution
        </h3>

        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Film size={16} color="#60a5fa" />
              <span>Feature Films</span>
            </span>
            <strong style={{ color: '#60a5fa' }}>{stats.filmPercentage}% ({stats.filmCount})</strong>
          </div>
          <div style={{ height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${stats.filmPercentage}%`, height: '100%', background: '#3b82f6', borderRadius: 'inherit' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Tv size={16} color="#c084fc" />
              <span>Television</span>
            </span>
            <strong style={{ color: '#c084fc' }}>{stats.tvPercentage}% ({stats.tvCount})</strong>
          </div>
          <div style={{ height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${stats.tvPercentage}%`, height: '100%', background: '#8b5cf6', borderRadius: 'inherit' }} />
          </div>
        </div>
      </div>

      {/* Rating Distribution & Decades Breakdown (2 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Rating Distribution */}
        <div
          style={{
            background: 'var(--bg-surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={18} color="var(--color-accent-gold)" />
            <span>Score Distribution (1 to 5 Stars)</span>
          </h3>

          <div>
            {stats.distribution.map((d) => (
              <div key={d.stars} className="dist-row">
                <div className="dist-stars">
                  <span>{d.stars}</span>
                  <Star size={13} fill="#fbbf24" strokeWidth={0} />
                </div>
                <div className="dist-bar-track">
                  <div className="dist-bar-fill" style={{ width: `${d.percentage}%` }} />
                </div>
                <div className="dist-count">{d.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Release Decades Breakdown */}
        <div
          style={{
            background: 'var(--bg-surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="var(--color-accent-gold)" />
            <span>Catalog by Release Decade</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {stats.decades.map((dec) => (
              <div
                key={dec.decade}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {dec.decade}
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.35rem 0' }}>
                  {dec.avgScore.toFixed(2)}
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}> avg</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {dec.count} {dec.count === 1 ? 'title' : 'titles'} reviewed
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Frequently Reviewed Talent */}
      <div
        style={{
          background: 'var(--bg-surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} color="var(--color-accent-gold)" />
            <span>Frequently Evaluated Creators & Actors</span>
          </h3>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Multiple appearances in review database
          </span>
        </div>

        {peopleLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            Parsing cast & director credits...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {people.map((person, idx) => (
              <Link
                key={idx}
                to={`/search?q=${encodeURIComponent(person.name)}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1.25rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{person.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {person.type}
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--color-accent-gold)', fontSize: '0.95rem' }}>
                  {person.count} reviews
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
