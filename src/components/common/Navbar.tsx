import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Home, Film, BarChart3, Shuffle, ChevronRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleRandomClick = () => {
    setMobileMenuOpen(false);
    navigate('/random');
  };

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${mobileMenuOpen ? 'menu-open' : ''}`}>
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
            <NavLink to="/reviews" end className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}>
              All Reviews
            </NavLink>
            <NavLink to="/stats" className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}>
              Stats
            </NavLink>
            <button
              onClick={handleRandomClick}
              className="header-nav-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
              title="Random Review"
            >
              Random
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="header-actions">
            <Link
              to="/search"
              className={`header-action-btn ${location.pathname === '/search' ? 'active' : ''}`}
              title="Search"
              aria-label="Search reviews"
            >
              <Search size={20} />
            </Link>

            {/* Mobile hamburger */}
            <button
              className="header-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (rendered outside header to avoid backdrop-filter and height clipping) */}
      {mobileMenuOpen && (
        <div className="header-mobile-menu">
          <div className="mobile-menu-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="mobile-menu-item-left">
                <Home size={20} className="mobile-menu-icon" />
                <span>Home</span>
              </div>
              <ChevronRight size={16} className="mobile-menu-chevron" />
            </NavLink>

            <NavLink
              to="/reviews"
              end
              className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="mobile-menu-item-left">
                <Film size={20} className="mobile-menu-icon" />
                <span>All Reviews</span>
              </div>
              <ChevronRight size={16} className="mobile-menu-chevron" />
            </NavLink>

            <NavLink
              to="/stats"
              className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="mobile-menu-item-left">
                <BarChart3 size={20} className="mobile-menu-icon" />
                <span>Statistics</span>
              </div>
              <ChevronRight size={16} className="mobile-menu-chevron" />
            </NavLink>

            <NavLink
              to="/search"
              className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="mobile-menu-item-left">
                <Search size={20} className="mobile-menu-icon" />
                <span>Search</span>
              </div>
              <ChevronRight size={16} className="mobile-menu-chevron" />
            </NavLink>

            <button
              onClick={handleRandomClick}
              className="mobile-menu-item"
              style={{ width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <div className="mobile-menu-item-left">
                <Shuffle size={20} className="mobile-menu-icon" />
                <span>Random Review</span>
              </div>
              <ChevronRight size={16} className="mobile-menu-chevron" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
