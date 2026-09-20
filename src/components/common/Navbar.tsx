import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      let url = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      if (searchCategory) {
        url += `&type=${encodeURIComponent(searchCategory)}`;
      }
      navigate(url);
    }
  };

  const todayString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const searchParams = new URLSearchParams(location.search);
  const typeParam = searchParams.get('type');
  const sortParam = searchParams.get('sort');

  const isHomeActive = location.pathname === '/';
  const isFeatureFilmsActive = location.pathname === '/reviews' && typeParam === 'film';
  const isTvSeriesActive = location.pathname === '/reviews' && typeParam === 'tv';
  const isTopRatedActive = location.pathname === '/reviews' && sortParam === 'highest';
  const isAllReviewsActive =
    location.pathname === '/reviews' &&
    !isFeatureFilmsActive &&
    !isTvSeriesActive &&
    !isTopRatedActive;
  const isSearchActive = location.pathname === '/search';
  const isStatsActive = location.pathname === '/stats';
  const isRandomActive = location.pathname === '/random';

  return (
    <header className="retro-header">
      {/* Top Utility Strip */}
      <div className="retro-utility-bar">
        <div className="retro-utility-left">
          <span>Welcome to <strong>Emanuel's Reviews</strong>!</span>
          <span className="retro-pipe">|</span>
          <span className="retro-date-stamp">{todayString}</span>
        </div>
      </div>

      {/* Main Banner: 1999 Amazon / Portal Table Layout */}
      <div className="retro-banner-table">
        <div className="retro-logo-cell">
          <Link to="/" className="retro-logo-link">
            <div className="retro-logo-title">
              <span className="logo-emanuel">EMANUEL'S</span>{' '}
              <span className="logo-reviews">REVIEWS</span>
            </div>
            <div className="retro-logo-sub">
              THE WEB'S PREMIER FILM &amp; TV CRITICISM DATABASE &bull; EST. 1998
            </div>
          </Link>
        </div>

        {/* Integrated Header Search Box (Amazon 1999 Style) */}
        <div className="retro-search-cell">
          <form onSubmit={handleSearchSubmit} className="retro-header-search-form">
            <span className="search-label">SEARCH:</span>
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="retro-header-select"
            >
              <option value="">All Categories</option>
              <option value="film">Feature Films</option>
              <option value="tv">Television Series</option>
            </select>
            <input
              type="text"
              placeholder="Title, Director, Actor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="retro-header-input"
            />
            <button type="submit" className="btn-retro btn-retro-gold header-go-btn">
              GO!
            </button>
          </form>
        </div>
      </div>

      {/* 1999 Amazon Style Category Tabs */}
      <nav className="retro-tabs-bar" aria-label="Main Navigation">
        <Link
          to="/"
          className={`retro-tab ${isHomeActive ? 'active' : ''}`}
        >
          WELCOME
        </Link>
        <Link
          to="/reviews"
          className={`retro-tab ${isAllReviewsActive ? 'active' : ''}`}
        >
          ALL REVIEWS
        </Link>
        <Link
          to="/reviews?type=film"
          className={`retro-tab ${isFeatureFilmsActive ? 'active' : ''}`}
        >
          FEATURE FILMS
        </Link>
        <Link
          to="/reviews?type=tv"
          className={`retro-tab ${isTvSeriesActive ? 'active' : ''}`}
        >
          TV SERIES
        </Link>
        <Link
          to="/reviews?sort=highest"
          className={`retro-tab ${isTopRatedActive ? 'active' : ''}`}
        >
          TOP RATED
        </Link>
        <Link
          to="/search"
          className={`retro-tab ${isSearchActive ? 'active' : ''}`}
        >
          SEARCH ARCHIVE
        </Link>
        <Link
          to="/stats"
          className={`retro-tab ${isStatsActive ? 'active' : ''}`}
        >
          DATABASE STATS
        </Link>
        <Link
          to="/random"
          className={`retro-tab ${isRandomActive ? 'active' : ''}`}
          onClick={() => {
            if (location.pathname === '/random') {
              window.dispatchEvent(new CustomEvent('pick-random-review'));
            }
          }}
        >
          RANDOM PICK
        </Link>
      </nav>

      {/* Sub-Banner Ticker / Information Line */}
      <div className="retro-subticker">
        <strong>HOT TOPICS:</strong>{' '}
        <Link to="/reviews/avatar">Avatar</Link> &bull;{' '}
        <Link to="/reviews/obsession">Obsession</Link> &bull;{' '}
        <Link to="/reviews/jumanji">Jumanji (1995)</Link> &bull;{' '}
        <Link to="/reviews/wandavision">WandaVision</Link> &bull;{' '}
        <Link to="/reviews/venom-the-last-dance">Venom: The Last Dance</Link>
      </div>
    </header>
  );
};
