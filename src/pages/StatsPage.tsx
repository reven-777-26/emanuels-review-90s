import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
            .filter(([, count]) => count > 1)
            .sort((a, b) => b[1] - a[1])
            .map(([name, count]) => ({ name, count, type: 'actor' }));

          const topDirectors: PersonCount[] = Array.from(directorCounts.entries())
            .filter(([, count]) => count > 1)
            .sort((a, b) => b[1] - a[1])
            .map(([name, count]) => ({ name, count, type: 'director' }));

          const topComposers: PersonCount[] = Array.from(composerCounts.entries())
            .filter(([, count]) => count > 1)
            .sort((a, b) => b[1] - a[1])
            .map(([name, count]) => ({ name, count, type: 'composer' }));

          setPeople([...topActors, ...topDirectors, ...topComposers]);
        })
        .finally(() => setPeopleLoading(false));
    }
  }, [reviews]);

  if (reviewsLoading) {
    return <LoadingSpinner message="Aggregating database statistics and computing averages..." />;
  }

  if (error) {
    return <ErrorDisplay title="Failed to compute statistical data" message={error} onRetry={refetch} />;
  }

  const directors = people.filter((p) => p.type === 'director');
  const actors = people.filter((p) => p.type === 'actor');
  const composers = people.filter((p) => p.type === 'composer');

  return (
    <div className="retro-stats-page">
      {/* Page Heading */}
      <div style={{ marginBottom: '8px' }}>
        <h1 style={{ fontSize: '18px', color: '#003366', margin: '0 0 2px 0' }}>
          ARCHIVE DATABASE ALMANAC &amp; STATISTICS
        </h1>
        <div style={{ fontSize: '11px', color: '#555' }}>
          Automated numerical analysis of Emanuel's critical evaluations, scoring distributions, and personnel frequency.
        </div>
      </div>

      {/* KPI Overview Table */}
      <table className="stats-kpi-table">
        <tbody>
          <tr>
            <td>
              <span className="stats-big-num">{stats.totalReviews}</span>
              <div><strong>TOTAL REVIEWS</strong></div>
              <div style={{ fontSize: '10px', color: '#666' }}>100% of Catalog</div>
            </td>
            <td>
              <span className="stats-big-num" style={{ color: '#800000' }}>
                {stats.averageScore.toFixed(2)}
              </span>
              <div><strong>AVERAGE SCORE</strong></div>
              <div style={{ fontSize: '10px', color: '#666' }}>Out of 5.00</div>
            </td>
            <td>
              <span className="stats-big-num">{stats.filmCount}</span>
              <div><strong>FEATURE FILMS</strong></div>
              <div style={{ fontSize: '10px', color: '#666' }}>{stats.filmPercentage}% of Archive</div>
            </td>
            <td>
              <span className="stats-big-num">{stats.tvCount}</span>
              <div><strong>TV SERIES</strong></div>
              <div style={{ fontSize: '10px', color: '#666' }}>{stats.tvPercentage}% of Archive</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* The Extremes Table */}
      {stats.highestRated && stats.lowestRated && (
        <div style={{ marginBottom: '14px' }}>
          <div className="retro-section-header gold">
            <span className="retro-section-title">THE EXTREMES: MASTERPIECE VS. DISASTER</span>
          </div>

          <table className="retro-data-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>DISTINCTION</th>
                <th style={{ width: '40%' }}>TITLE &amp; YEAR</th>
                <th style={{ width: '15%' }}>TYPE</th>
                <th style={{ width: '20%' }}>SCORE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong style={{ color: '#006600' }}>&#9650; Highest Ever</strong></td>
                <td>
                  <Link to={`/reviews/${stats.highestRated.id}`}>
                    <strong>{stats.highestRated.name}</strong>
                  </Link>{' '}
                  ({stats.highestRated.year})
                </td>
                <td>{stats.highestRated.type === 'tv' ? 'Television' : 'Feature Film'}</td>
                <td>
                  <strong style={{ color: '#006600' }}>
                    {stats.highestRated.score.toFixed(2)} / 5.00
                  </strong>
                </td>
              </tr>
              <tr>
                <td><strong style={{ color: '#990000' }}>&#9660; Lowest Ever ("Razzie")</strong></td>
                <td>
                  <Link to={`/reviews/${stats.lowestRated.id}`}>
                    <strong>{stats.lowestRated.name}</strong>
                  </Link>{' '}
                  ({stats.lowestRated.year})
                </td>
                <td>{stats.lowestRated.type === 'tv' ? 'Television' : 'Feature Film'}</td>
                <td>
                  <strong style={{ color: '#990000' }}>
                    {stats.lowestRated.score.toFixed(2)} / 5.00
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Top Personnel Tables (Directors, Actors, Composers) */}
      <div className="retro-section-header">
        <span className="retro-section-title">FREQUENTLY EVALUATED CREATIVE TALENT</span>
      </div>

      {peopleLoading ? (
        <div style={{ fontSize: '11px', color: '#666', padding: '10px' }}>
          Loading personnel cross-index...
        </div>
      ) : (
        <div className="stats-top-people-grid">
          {/* Directors */}
          <div className="stats-people-col">
            <table className="retro-data-table">
              <thead>
                <tr>
                  <th>TOP DIRECTORS</th>
                  <th style={{ textAlign: 'right', width: '50px' }}>TITLES</th>
                </tr>
              </thead>
              <tbody>
                {directors.length > 0 ? (
                  directors.map((dir, i) => (
                    <tr key={i}>
                      <td>
                        <Link to={`/search?q=director:${encodeURIComponent(dir.name)}`}>
                          {dir.name}
                        </Link>
                      </td>
                      <td style={{ textAlign: 'right' }}><strong>{dir.count}</strong></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} style={{ color: '#888' }}>Various (1 title each)</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Actors */}
          <div className="stats-people-col">
            <table className="retro-data-table">
              <thead>
                <tr>
                  <th>TOP PERFORMERS</th>
                  <th style={{ textAlign: 'right', width: '50px' }}>TITLES</th>
                </tr>
              </thead>
              <tbody>
                {actors.length > 0 ? (
                  actors.map((act, i) => (
                    <tr key={i}>
                      <td>
                        <Link to={`/search?q=actor:${encodeURIComponent(act.name)}`}>
                          {act.name}
                        </Link>
                      </td>
                      <td style={{ textAlign: 'right' }}><strong>{act.count}</strong></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} style={{ color: '#888' }}>Various (1 title each)</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Composers */}
          <div className="stats-people-col">
            <table className="retro-data-table">
              <thead>
                <tr>
                  <th>TOP COMPOSERS</th>
                  <th style={{ textAlign: 'right', width: '50px' }}>TITLES</th>
                </tr>
              </thead>
              <tbody>
                {composers.length > 0 ? (
                  composers.map((comp, i) => (
                    <tr key={i}>
                      <td>
                        <Link to={`/search?q=${encodeURIComponent(comp.name)}`}>
                          {comp.name}
                        </Link>
                      </td>
                      <td style={{ textAlign: 'right' }}><strong>{comp.count}</strong></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} style={{ color: '#888' }}>Various (1 title each)</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Catalog Listing Quick Table */}
      <div className="retro-section-header red">
        <span className="retro-section-title">FULL CATALOG MASTER INDEX TABLE</span>
      </div>

      <table className="retro-data-table">
        <thead>
          <tr>
            <th style={{ width: '45%' }}>TITLE</th>
            <th style={{ width: '15%' }}>YEAR</th>
            <th style={{ width: '20%' }}>FORMAT</th>
            <th style={{ width: '20%' }}>SCORE</th>
          </tr>
        </thead>
        <tbody>
          {[...reviews].sort((a, b) => b.score - a.score).map((r) => (
            <tr key={r.id}>
              <td>
                <Link to={`/reviews/${r.id}`}>
                  <strong>{r.name}</strong>
                </Link>
              </td>
              <td>{r.year}</td>
              <td>{r.type === 'tv' ? 'Television' : 'Film'}</td>
              <td>
                <strong style={{ color: '#800000' }}>{r.score.toFixed(2)}</strong> / 5.00
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
