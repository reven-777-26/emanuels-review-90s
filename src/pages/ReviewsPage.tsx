import React, { useState, useMemo } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { useReviews } from '../hooks/useReviews';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorDisplay } from '../components/common/ErrorDisplay';
import { EmptyState } from '../components/common/EmptyState';
import type { MediaType } from '../types/review';

type SortOption = 'highest' | 'lowest' | 'recent' | 'oldest' | 'title';

export const ReviewsPage: React.FC = () => {
  const { reviews, loading, error, refetch } = useReviews();
  const [filterType, setFilterType] = useState<MediaType | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('highest');
  const [selectedDecade, setSelectedDecade] = useState<string>('all');

  // Extract available decades
  const decades = useMemo(() => {
    const set = new Set<string>();
    reviews.forEach((r) => {
      const dec = `${Math.floor(r.year / 10) * 10}s`;
      set.add(dec);
    });
    return Array.from(set).sort((a, b) => parseInt(b) - parseInt(a));
  }, [reviews]);

  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter((r) => r.type === filterType);
    }

    // Filter by decade
    if (selectedDecade !== 'all') {
      result = result.filter((r) => `${Math.floor(r.year / 10) * 10}s` === selectedDecade);
    }

    // Sort
    switch (sortBy) {
      case 'highest':
        result.sort((a, b) => b.score - a.score);
        break;
      case 'lowest':
        result.sort((a, b) => a.score - b.score);
        break;
      case 'recent':
        result.sort((a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.reviewedAt).getTime() - new Date(b.reviewedAt).getTime());
        break;
      case 'title':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [reviews, filterType, selectedDecade, sortBy]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <LoadingSpinner message="Loading catalog..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <ErrorDisplay title="Failed to load catalog" message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ paddingTop: '1.5rem' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          All Reviews
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Browse through {reviews.length} meticulously scored motion pictures and television series.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1rem 1.25rem',
          background: 'var(--bg-surface-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '2rem',
        }}
      >
        {/* Media type pills */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}
            onClick={() => setFilterType('all')}
          >
            All ({reviews.length})
          </button>
          <button
            className={`btn ${filterType === 'film' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}
            onClick={() => setFilterType('film')}
          >
            Films ({reviews.filter((r) => r.type === 'film').length})
          </button>
          <button
            className={`btn ${filterType === 'tv' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}
            onClick={() => setFilterType('tv')}
          >
            TV Series ({reviews.filter((r) => r.type === 'tv').length})
          </button>
        </div>

        {/* Dropdown controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Decade filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Decade:</span>
            <select
              value={selectedDecade}
              onChange={(e) => setSelectedDecade(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.45rem 0.8rem',
                fontSize: '0.85rem',
                color: '#fff',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="all" style={{ background: '#121620' }}>All Decades</option>
              {decades.map((dec) => (
                <option key={dec} value={dec} style={{ background: '#121620' }}>
                  {dec}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={15} color="var(--text-muted)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.45rem 0.8rem',
                fontSize: '0.85rem',
                color: '#fff',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="highest" style={{ background: '#121620' }}>Highest Rated</option>
              <option value="lowest" style={{ background: '#121620' }}>Lowest Rated</option>
              <option value="recent" style={{ background: '#121620' }}>Recently Reviewed</option>
              <option value="oldest" style={{ background: '#121620' }}>Earliest Reviewed</option>
              <option value="title" style={{ background: '#121620' }}>Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid or Empty */}
      {filteredAndSortedReviews.length === 0 ? (
        <EmptyState
          title="No reviews match your filters"
          message="Try resetting decade or category filters."
          action={{
            label: 'Clear Filters',
            onClick: () => {
              setFilterType('all');
              setSelectedDecade('all');
              setSortBy('highest');
            },
          }}
        />
      ) : (
        <div className="reviews-grid">
          {filteredAndSortedReviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
};
