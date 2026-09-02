import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Clapperboard } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorDisplay } from '../components/common/ErrorDisplay';
import { EmptyState } from '../components/common/EmptyState';

const POPULAR_QUERIES = [
  'Quentin Tarantino',
  'Andy Serkis',
  'Planet of the Apes',
  'Loki',
  'Megamind',
  'Marvel',
  'Morricone',
];

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const { query, setQuery, results, loading, error } = useSearch(queryParam, 300);

  // Sync URL query param to search state
  useEffect(() => {
    if (queryParam !== query) {
      setQuery(queryParam);
    }
  }, [queryParam]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearchParams({}, { replace: true });
  };

  const handleChipClick = (suggestion: string) => {
    setQuery(suggestion);
    setSearchParams({ q: suggestion });
  };

  return (
    <div className="container fade-in" style={{ paddingTop: '1.5rem' }}>
      {/* Search Header Box */}
      <div className="search-header-box">
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Search Emanuel's Archive
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto' }}>
          Find reviews by movie or TV title, lead actor, director, or soundtrack composer.
        </p>

        {/* Search Input Bar */}
        <div className="search-input-wrapper">
          <Search size={20} className="search-input-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search titles, directors, actors..."
            value={query}
            onChange={handleInputChange}
            autoFocus
          />
          {query && (
            <button className="search-clear-btn" onClick={handleClear} aria-label="Clear search">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="search-chips">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>
            Try searching:
          </span>
          {POPULAR_QUERIES.map((item) => (
            <button key={item} className="search-chip" onClick={() => handleChipClick(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && <LoadingSpinner message={`Searching for "${query}"...`} />}

      {/* Error state */}
      {error && !loading && (
        <ErrorDisplay title="Search Error" message={error} onRetry={() => setQuery(query)} />
      )}

      {/* Search Results */}
      {!loading && !error && query.trim() && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {results.length} {results.length === 1 ? 'Result' : 'Results'} for "{query}"
            </h2>
          </div>

          {results.length === 0 ? (
            <EmptyState
              title="No matching reviews found"
              message={`We couldn't find any reviews matching "${query}". Try searching by actor name, director name, or title keyword.`}
              action={{
                label: 'Clear Search',
                onClick: handleClear,
              }}
            />
          ) : (
            <div className="reviews-grid">
              {results.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Initial Landing prompt when query is empty */}
      {!loading && !query.trim() && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <Clapperboard size={48} style={{ opacity: 0.3, marginBottom: '1rem', display: 'inline-block' }} />
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Type in the search bar above to instantly query Emanuel's film and TV review database.
          </p>
        </div>
      )}
    </div>
  );
};
