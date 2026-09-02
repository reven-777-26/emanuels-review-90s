import { useState, useEffect } from 'react';
import { reviewsApi } from '../api/reviews';
import type { ReviewDetail } from '../types/review';

const reviewDetailCache = new Map<string, ReviewDetail>();

export function useReviewDetail(id?: string) {
  const [review, setReview] = useState<ReviewDetail | null>(
    id ? reviewDetailCache.get(id) || null : null
  );
  const [loading, setLoading] = useState<boolean>(Boolean(id && !reviewDetailCache.has(id)));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setReview(null);
      setLoading(false);
      setError(null);
      return;
    }

    if (reviewDetailCache.has(id)) {
      setReview(reviewDetailCache.get(id)!);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    reviewsApi
      .getReviewById(id)
      .then((data) => {
        if (isMounted) {
          reviewDetailCache.set(id, data);
          setReview(data);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load review details');
          setReview(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { review, loading, error };
}
