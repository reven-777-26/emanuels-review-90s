import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Shuffle, Menu, X } from 'lucide-react';
import { useReviews } from '../../hooks/useReviews';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { reviews } = useReviews();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRandomClick = () => {
    setMobileMenuOpen(false);
    if (reviews && reviews.length > 0) {
      const randomIndex = Math.floor(Math.random() * reviews.length);
      const randomReview = reviews[randomIndex];
      navigate(`/reviews/${randomReview.id}`);
    } else {
      navigate('/random');
    }
  };

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container header-inner">
        {/* Brand Logo - Authentic Netflix Style */}
        <Link to="/" className="header-brand" onClick={() => setMobileMenuOpen(false)}>
          <img
            src="/logo.png"
            alt="Emanuel's Reviews Logo"
            className="header-brand-icon"
          />
          <span className="header-brand-title">
            <span className="title-white">EMANUEL'S</span>
            <span className="title-red">REVIEWS</span>
          </span>
        </Link>

        {/* Clean, Flat Navigation Links (No bulky pill borders) */}
        <nav className="header-nav-menu" aria-label="Main Navigation">
          <NavLink to="/" end className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/reviews" className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}>
            All Reviews
          </NavLink>
          <NavLink to="/stats" className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}>
            Stats
          </NavLink>
        </nav>

        {/* Right Action Icons */}
        <div className="header-actions">
          <Link
            to="/search"
            className={`header-action-btn ${location.pathname === '/search' ? 'active' : ''}`}
            title="Search"
            aria-label="Search reviews"
          >
            <Search size={18} />
          </Link>

          <button
            onClick={handleRandomClick}
            className="header-action-btn"
            title="Random Review"
            aria-label="Random review"
          >
            <Shuffle size={18} />
          </button>

          {/* Mobile hamburger */}
          <button
            className="header-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="header-mobile-menu">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/reviews"
            className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            All Reviews
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Statistics
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Search
          </NavLink>
          <button
            onClick={handleRandomClick}
            className="mobile-menu-item"
            style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
          >
            Random Review
          </button>
        </div>
      )}
    </header>
  );
};
