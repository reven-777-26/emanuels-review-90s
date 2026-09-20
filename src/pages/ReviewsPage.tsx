import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReviews } from '../hooks/useReviews';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorDisplay } from '../components/common/ErrorDisplay';
import { EmptyState } from '../components/common/EmptyState';
import type { MediaType } from '../types/review';

type SortOption = 'highest' | 'lowest' | 'recent' | 'oldest' | 'title';

export const ReviewsPage: React.FC = () => {
  const { reviews, loading, error, refetch } = useReviews();
  const [searchParams, setSearchParams] = useSearchParams();

  const typeParam = (searchParams.get('type') as MediaType | 'all') || 'all';
  const sortParam = (searchParams.get('sort') as SortOption) || 'highest';
  const decadeParam = searchParams.get('decade') || 'all';

  const [filterType, setFilterType] = useState<MediaType | 'all'>(typeParam);
  const [sortBy, setSortBy] = useState<SortOption>(sortParam);
  const [selectedDecade, setSelectedDecade] = useState<string>(decadeParam);

  // Sync state if URL query params change
  useEffect(() => {
    if (typeParam !== filterType) setFilterType(typeParam);
    if (sortParam !== sortBy) setSortBy(sortParam);
    if (decadeParam !== selectedDecade) setSelectedDecade(decadeParam);
  }, [typeParam, sortParam, decadeParam]);

  // Extract available decades
  const decades = useMemo(() => {
    const set = new Set<string>();
    reviews.forEach((r) => {
      const dec = `${Math.floor(r.year / 10) * 10}s`;
      set.add(dec);
    });
    return Array.from(set).sort((a, b) => parseInt(b) - parseInt(a));
  }, [reviews]);

  const updateFilters = (type: MediaType | 'all', decade: string, sort: SortOption) => {
    setFilterType(type);
    setSelectedDecade(decade);
    setSortBy(sort);

    const newParams: Record<string, string> = {};
    if (type !== 'all') newParams.type = type;
    if (decade !== 'all') newParams.decade = decade;
    if (sort !== 'highest') newParams.sort = sort;
    setSearchParams(newParams);
  };

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
    return <LoadingSpinner message="Querying review database index..." />;
  }

  if (error) {
    return <ErrorDisplay title="Failed to load review archive" message={error} onRetry={refetch} />;
  }

  return (
    <div className="retro-reviews-page">
      {/* Page Heading */}
      <div style={{ marginBottom: '8px' }}>
        <h1 style={{ fontSize: '18px', color: '#003366', margin: '0 0 2px 0' }}>
          COMPLETE REVIEW ARCHIVE
        </h1>
        <div style={{ fontSize: '11px', color: '#555' }}>
          Browse all {reviews.length} film and television evaluations cataloged with Emanuel's precision score matrix.
        </div>
      </div>

      {/* Authentic 90s Filter & Sorting Form */}
      <div className="retro-filter-panel">
        <div className="filter-row">
          <div className="filter-group">
            <label>Format:</label>
            <select
              value={filterType}
              onChange={(e) => updateFilters(e.target.value as MediaType | 'all', selectedDecade, sortBy)}
            >
              <option value="all">All Formats ({reviews.length})</option>
              <option value="film">Feature Films Only ({reviews.filter((r) => r.type === 'film').length})</option>
              <option value="tv">Television Series Only ({reviews.filter((r) => r.type === 'tv').length})</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Decade:</label>
            <select
              value={selectedDecade}
              onChange={(e) => updateFilters(filterType, e.target.value, sortBy)}
            >
              <option value="all">All Decades</option>
              {decades.map((dec) => (
                <option key={dec} value={dec}>
                  {dec} Releases
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => updateFilters(filterType, selectedDecade, e.target.value as SortOption)}
            >
              <option value="highest">Highest Score First</option>
              <option value="lowest">Lowest Score (Razzies First)</option>
              <option value="recent">Most Recently Reviewed</option>
              <option value="oldest">Oldest Reviews First</option>
              <option value="title">Alphabetical (A - Z)</option>
            </select>
          </div>

          {(filterType !== 'all' || selectedDecade !== 'all' || sortBy !== 'highest') && (
            <button
              onClick={() => updateFilters('all', 'all', 'highest')}
              className="btn-retro"
              style={{ fontSize: '10px' }}
            >
              [ Reset Filters ]
            </button>
          )}
        </div>

        <div style={{ fontSize: '10px', color: '#666', marginTop: '4px', borderTop: '1px dotted #ccc', paddingTop: '3px' }}>
          <strong>Showing:</strong> {filteredAndSortedReviews.length} matching review(s) &bull; Page 1 of 1
        </div>
      </div>

      {/* Reviews Listing */}
      {filteredAndSortedReviews.length === 0 ? (
        <EmptyState
          title="No Reviews Found"
          message="No records matched your specific filter combination. Try selecting 'All Formats' or 'All Decades'."
          action={{
            label: 'Reset All Filters',
            onClick: () => updateFilters('all', 'all', 'highest'),
          }}
        />
      ) : (
        <div className="retro-reviews-list">
          {filteredAndSortedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};
