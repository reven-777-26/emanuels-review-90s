import { useState, useEffect } from 'react';
import { reviewsApi } from '../api/reviews';
import type { ReviewSummary } from '../types/review';

let reviewsCache: ReviewSummary[] | null = null;

export function useReviews() {
  const [reviews, setReviews] = useState<ReviewSummary[]>(reviewsCache || []);
  const [loading, setLoading] = useState<boolean>(!reviewsCache);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async (forceRefresh = false) => {
    if (!forceRefresh && reviewsCache) {
      setReviews(reviewsCache);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await reviewsApi.getAllReviews();
      reviewsCache = data.reviews;
      setReviews(data.reviews);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return {
    reviews,
    loading,
    error,
    refetch: () => fetchReviews(true),
  };
}
