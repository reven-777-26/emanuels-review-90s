import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReviews } from '../hooks/useReviews';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const RandomReviewPage: React.FC = () => {
  const { reviews } = useReviews();
  const navigate = useNavigate();

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const randomIndex = Math.floor(Math.random() * reviews.length);
      const chosen = reviews[randomIndex];
      navigate(`/reviews/${chosen.id}`, { replace: true });
    }
  }, [reviews, navigate]);

  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '6rem' }}>
      <LoadingSpinner message="Selecting a surprise review at random..." />
    </div>
  );
};
