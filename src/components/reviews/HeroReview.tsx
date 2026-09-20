import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ReviewDetail } from '../../types/review';
import { renderStars } from '../../utils/format';

interface HeroReviewProps {
  reviews: ReviewDetail[];
}

export const HeroReview: React.FC<HeroReviewProps> = ({ reviews }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const items = reviews.filter(Boolean);

  if (items.length === 0) return null;

  const current = items[selectedIndex] || items[0];

  return (
    <div className="retro-spotlight-panel">
      {/* 90s Navy Header Strip */}
      <div className="retro-spotlight-header">
        <span>EMANUEL'S SPOTLIGHT REVIEW OF THE WEEK</span>
      </div>

      {/* Main Spotlight Body */}
      <div className="retro-spotlight-body">
        <div className="retro-spotlight-poster-cell">
          <Link to={`/reviews/${current.id}`}>
            <img
              src={current.artwork?.poster}
              alt={current.name}
              className="retro-spotlight-poster-img"
            />
          </Link>
          <div className="retro-spotlight-poster-caption">
            {current.type === 'tv' ? 'TELEVISION' : 'FEATURE FILM'}
          </div>
        </div>

        <div className="retro-spotlight-info-cell">
          <h2 className="retro-spotlight-title">
            <Link to={`/reviews/${current.id}`}>
              {current.name} ({current.year})
            </Link>
          </h2>

          <table className="retro-spotlight-meta-table">
            <tbody>
              <tr>
                <td className="meta-label">Rating:</td>
                <td className="meta-value">
                  <span className="retro-stars" style={{ color: '#b8860b' }}>
                    {renderStars(current.score)}
                  </span>{' '}
                  <strong>{current.score.toFixed(2)} out of 5.00</strong>
                </td>
              </tr>
              {current.credits?.directors && current.credits.directors.length > 0 && (
                <tr>
                  <td className="meta-label">Director:</td>
                  <td className="meta-value">
                    {current.credits.directors.map((dir, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && ', '}
                        <Link to={`/search?q=director:${encodeURIComponent(dir)}`}>
                          {dir}
                        </Link>
                      </React.Fragment>
                    ))}
                  </td>
                </tr>
              )}
              {current.credits?.actors && current.credits.actors.length > 0 && (
                <tr>
                  <td className="meta-label">Starring:</td>
                  <td className="meta-value">
                    {current.credits.actors.slice(0, 3).map((act, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && ', '}
                        <Link to={`/search?q=actor:${encodeURIComponent(act)}`}>
                          {act}
                        </Link>
                      </React.Fragment>
                    ))}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Editorial Excerpt */}
          <div className="retro-spotlight-quote">
            <p>
              {current.review ? (
                <>
                  &ldquo;
                  {current.review.length > 260
                    ? `${current.review.slice(0, 260)}...`
                    : current.review}
                  &rdquo;
                </>
              ) : (
                <span style={{ fontStyle: 'italic', color: '#555' }}>
                  &ldquo;
                  {current.imdb?.description
                    ? (current.imdb.description.length > 260
                        ? `${current.imdb.description.slice(0, 260)}...`
                        : current.imdb.description)
                    : 'Granular 8-category mathematical score evaluation recorded in archive.'}
                  &rdquo;
                </span>
              )}
            </p>
          </div>

          <div className="retro-spotlight-action">
            <Link to={`/reviews/${current.id}`} className="btn-retro btn-retro-navy">
              &gt;&gt; Read Emanuel's Full Critical Assessment &lt;&lt;
            </Link>
          </div>
        </div>
      </div>

      {/* Retro Spotlight Selector Switcher (Amazon 1999 style tabs) */}
      {items.length > 1 && (
        <div className="retro-spotlight-tabs">
          <span className="switcher-label">More Spotlight Picks: </span>
          {items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setSelectedIndex(idx)}
              className={`spotlight-tab-btn ${idx === selectedIndex ? 'active' : ''}`}
            >
              [{idx + 1}] {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
