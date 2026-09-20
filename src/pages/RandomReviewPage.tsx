import React, { useState, useEffect, useCallback } from 'react';
import { useReviews } from '../hooks/useReviews';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorDisplay } from '../components/common/ErrorDisplay';
import { ReviewDetailPage } from './ReviewDetailPage';

export const RandomReviewPage: React.FC = () => {
  const { reviews, loading: listLoading, error: listError } = useReviews();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const pickRandom = useCallback(() => {
    if (reviews && reviews.length > 0) {
      const randomIndex = Math.floor(Math.random() * reviews.length);
      setSelectedId(reviews[randomIndex].id);
    }
  }, [reviews]);

  useEffect(() => {
    if (reviews && reviews.length > 0 && !selectedId) {
      pickRandom();
    }
  }, [reviews, selectedId, pickRandom]);

  useEffect(() => {
    const handleReRoll = () => {
      pickRandom();
    };
    window.addEventListener('pick-random-review', handleReRoll);
    return () => window.removeEventListener('pick-random-review', handleReRoll);
  }, [pickRandom]);

  if (listLoading || !selectedId) {
    return (
      <div style={{ textAlign: 'center', padding: '30px 10px' }}>
        <LoadingSpinner message="Consulting random number generator to select a film from the archive..." />
      </div>
    );
  }

  if (listError) {
    return (
      <div style={{ padding: '12px 0' }}>
        <ErrorDisplay title="Random Reel Selection Error" message={listError} onRetry={pickRandom} />
      </div>
    );
  }

  return (
    <ReviewDetailPage
      key={selectedId}
      reviewId={selectedId}
      isRandomPick={true}
      onPickAnother={pickRandom}
    />
  );
};
