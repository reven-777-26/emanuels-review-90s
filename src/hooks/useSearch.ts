import { useState, useEffect, useRef } from 'react';
import { reviewsApi } from '../api/reviews';
import type { ReviewSummary } from '../types/review';

export function useSearch(initialQuery = '', debounceMs = 300) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ReviewSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    setLoading(true);
    setError(null);

    timerRef.current = window.setTimeout(async () => {
      try {
        const res = await reviewsApi.searchReviews(trimmed);
        setResults(res.results || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [query, debounceMs]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
  };
}
