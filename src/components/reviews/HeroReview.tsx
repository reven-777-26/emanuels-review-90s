import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReviewDetail } from '../../types/review';

interface HeroReviewProps {
  reviews: ReviewDetail[];
}

export const HeroReview: React.FC<HeroReviewProps> = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const items = reviews.filter(Boolean);

  // Auto slide smoothly every 3 seconds
  React.useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [items.length, isPaused]);

  if (items.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <section
      className="hero-viewport"
      aria-label="Featured Reviews"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Track that slides smoothly via transform */}
      <div
        className="hero-track"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={`hero-slide-item ${idx === currentIndex ? 'active' : ''}`}
            aria-hidden={idx !== currentIndex}
          >
            {/* Background artwork */}
            <img
              src={item.artwork?.pageArt || item.artwork?.poster}
              alt={item.name}
              className="hero-slide-bg"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
            <div className="hero-slide-overlay" />

            {/* Content panel */}
            <div className="hero-slide-panel">
              {/* Clean minimal metadata row */}
              <div className="hero-meta-strip">
                <span className="hero-pill-tag">
                  {item.type === 'tv' ? 'TV SERIES' : 'FEATURE FILM'}
                </span>
                <span className="hero-meta-year">{item.year}</span>
                {item.credits?.directors?.[0] && (
                  <>
                    <span className="hero-meta-bullet">•</span>
                    <span className="hero-meta-director">
                      Dir. {item.credits.directors[0]}
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="hero-movie-title">{item.name}</h1>

              {/* Rating */}
              <div className="hero-rating-badge">
                <Star size={15} fill="#fbbf24" color="#fbbf24" />
                <span className="hero-rating-val">{item.score.toFixed(2)}</span>
                <span className="hero-rating-scale">/ 5.0</span>
              </div>

              {/* Concise quote */}
              <p className="hero-review-quote">{item.review}</p>

              {/* Actions */}
              <div className="hero-action-buttons">
                <Link to={`/reviews/${item.id}`} className="hero-btn-red">
                  <span>Read Review</span>
                  <ArrowRight size={16} />
                </Link>

                <Link to="/reviews" className="hero-btn-dark">
                  <span>Browse All</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <div className="hero-nav-arrows">
          <button
            onClick={handlePrev}
            className="hero-nav-arrow-btn"
            aria-label="Previous review"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={handleNext}
            className="hero-nav-arrow-btn"
            aria-label="Next review"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}

      {/* Indicator Bars */}
      {items.length > 1 && (
        <div className="hero-bars-indicator">
          {items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={`hero-bar-item ${idx === currentIndex ? 'active' : ''}`}
              aria-label={`Switch to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
