import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSearchParams({ q: suggestion });
  };

  return (
    <div className="retro-search-page">
      {/* Page Title */}
      <div style={{ marginBottom: '8px' }}>
        <h1 style={{ fontSize: '18px', color: '#003366', margin: '0 0 2px 0' }}>
          ARCHIVE SEARCH ENGINE
        </h1>
        <div style={{ fontSize: '11px', color: '#555' }}>
          Search through Emanuel's catalog of reviews by film title, actor, director, or soundtrack composer.
        </div>
      </div>

      {/* 90s Bordered Search Panel (AltaVista / Yahoo 1999 Style) */}
      <div className="retro-search-page-box">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="retro-search-form-row">
            <strong style={{ fontSize: '11px' }}>Keywords:</strong>
            <input
              type="text"
              className="search-large-input"
              placeholder="e.g. Tarantino, Loki, Serkis, Jumanji..."
              value={query}
              onChange={handleInputChange}
              autoFocus
            />
            <button type="submit" className="btn-retro btn-retro-gold" style={{ height: '24px' }}>
              [ SEARCH ]
            </button>
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="btn-retro"
                style={{ height: '24px' }}
              >
                [ Clear ]
              </button>
            )}
          </div>
        </form>

        <div className="popular-chips-line">
          <strong>Popular Inquiries:</strong>
          {POPULAR_QUERIES.map((item, idx) => (
            <React.Fragment key={item}>
              {idx > 0 && ' | '}
              <a
                href={`#${item}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSuggestionClick(item);
                }}
              >
                {item}
              </a>
            </React.Fragment>
          ))}
        </div>

        <div style={{ fontSize: '10px', color: '#777', marginTop: '6px', borderTop: '1px dotted #ccc', paddingTop: '4px' }}>
          <strong>Query Syntax Tip:</strong> Advanced queries are supported! Prefix with <code>actor:Name</code> or <code>director:Name</code> to query specific personnel credits.
        </div>
      </div>

      {/* Loading indicator */}
      {loading && <LoadingSpinner message={`Searching index records for "${query}"...`} />}

      {/* Error display */}
      {error && !loading && (
        <ErrorDisplay title="Search System Exception" message={error} onRetry={() => setQuery(query)} />
      )}

      {/* Search Results */}
      {!loading && !error && query.trim() && (
        <div>
          <div className="retro-section-header">
            <span className="retro-section-title">
              SEARCH RESULTS: {results.length} {results.length === 1 ? 'MATCH' : 'MATCHES'} FOUND FOR &ldquo;{query}&rdquo;
            </span>
          </div>

          {results.length === 0 ? (
            <EmptyState
              title="No Matching Reviews Located"
              message={`Your search for "${query}" did not match any reviews currently cataloged in Emanuel's database. Check spelling or try a broader term.`}
              action={{
                label: 'Reset Search',
                onClick: handleClear,
              }}
            />
          ) : (
            <div className="retro-reviews-list">
              {results.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Landing instructions when query is empty */}
      {!loading && !query.trim() && (
        <div className="box-cream" style={{ marginTop: '10px', textAlign: 'center', padding: '16px' }}>
          <div style={{ fontWeight: 'bold', color: '#663300', marginBottom: '4px' }}>
            READY TO SEARCH
          </div>
          <p style={{ fontSize: '11px', color: '#555', margin: 0 }}>
            Enter a film title, director, or cast member into the search box above to instantly query Emanuel's film archive.
          </p>
        </div>
      )}
    </div>
  );
};
