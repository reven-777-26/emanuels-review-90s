import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReviews } from '../../hooks/useReviews';

export const RetroSidebar: React.FC = () => {
  const { reviews } = useReviews();
  const [quickQuery, setQuickQuery] = useState('');
  const navigate = useNavigate();

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(quickQuery.trim())}`);
    }
  };

  const filmsCount = reviews.filter((r) => r.type === 'film').length;
  const tvCount = reviews.filter((r) => r.type === 'tv').length;
  const topFive = [...reviews].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <aside className="retro-sidebar" aria-label="Portal Navigation">
      {/* Box 1: Directory Navigation */}
      <div className="sidebar-box">
        <div className="sidebar-box-header">BROWSE REVIEWS</div>
        <ul className="sidebar-link-list">
          <li>
            <Link to="/">Home Page</Link>
          </li>
          <li>
            <Link to="/reviews">All Reviews ({reviews.length})</Link>
          </li>
          <li>
            <Link to="/reviews?type=film">Feature Films ({filmsCount})</Link>
          </li>
          <li>
            <Link to="/reviews?type=tv">TV Series ({tvCount})</Link>
          </li>
          <li>
            <Link to="/reviews?sort=highest">Top Rated Titles</Link>
          </li>
          <li>
            <Link to="/reviews?sort=lowest">The Razzie Vault</Link>
          </li>
          <li>
            <Link to="/random">Surprise Me! (Random)</Link>
          </li>
        </ul>
      </div>

      {/* Box 2: Browse By Decade */}
      <div className="sidebar-box">
        <div className="sidebar-box-header">BROWSE BY DECADE</div>
        <ul className="sidebar-link-list">
          <li>
            <Link to="/reviews?decade=2020s">2020s Releases</Link>
          </li>
          <li>
            <Link to="/reviews?decade=2010s">2010s Releases</Link>
          </li>
          <li>
            <Link to="/reviews?decade=2000s">2000s Releases</Link>
          </li>
          <li>
            <Link to="/reviews?decade=1990s">1990s Classics</Link>
          </li>
        </ul>
      </div>

      {/* Box 3: Quick Search */}
      <div className="sidebar-box sidebar-search-box">
        <div className="sidebar-box-header">QUICK SEARCH</div>
        <form onSubmit={handleQuickSearch} className="sidebar-search-form">
          <input
            type="text"
            placeholder="Search titles..."
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            className="sidebar-search-input"
          />
          <button type="submit" className="btn-retro sidebar-search-btn">
            GO!
          </button>
        </form>
        <div className="sidebar-search-tags">
          <span>Try: </span>
          <Link to="/search?q=Tarantino">Tarantino</Link> |{' '}
          <Link to="/search?q=Marvel">Marvel</Link> |{' '}
          <Link to="/search?q=Jumanji">Jumanji</Link>
        </div>
      </div>

      {/* Box 4: Top 5 Highest Rated */}
      {topFive.length > 0 && (
        <div className="sidebar-box">
          <div className="sidebar-box-header">TOP 5 HALL OF FAME</div>
          <ol className="sidebar-top-list">
            {topFive.map((m, idx) => (
              <li key={m.id}>
                <Link to={`/reviews/${m.id}`} title={`${m.name} (${m.year})`}>
                  {idx + 1}. {m.name}
                </Link>
                <span className="sidebar-score-label">
                  ({m.score.toFixed(2)})
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Box 5: Database Stats */}
      <div className="sidebar-box">
        <div className="sidebar-box-header">ARCHIVE STATS</div>
        <div className="sidebar-stats-content">
          <div><strong>Total Reviews:</strong> {reviews.length}</div>
          <div><strong>Films:</strong> {filmsCount}</div>
          <div><strong>TV Shows:</strong> {tvCount}</div>
          <div style={{ marginTop: '4px' }}>
            <Link to="/stats">Full Statistics &gt;&gt;</Link>
          </div>
        </div>
      </div>
    </aside>
  );
};
