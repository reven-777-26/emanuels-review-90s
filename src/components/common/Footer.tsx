import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  return (
    <footer className="retro-footer">
      <hr className="navy" />

      {/* Primary Directory Links */}
      <div className="retro-footer-nav">
        <Link to="/">Home</Link> |{' '}
        <Link to="/reviews">All Reviews</Link> |{' '}
        <Link to="/reviews?type=film">Feature Films</Link> |{' '}
        <Link to="/reviews?type=tv">Television</Link> |{' '}
        <Link to="/reviews?sort=highest">Top Rated</Link> |{' '}
        <Link to="/search">Search Archive</Link> |{' '}
        <Link to="/stats">Database Statistics</Link> |{' '}
        <Link to="/random">Random Reel</Link> |{' '}
        <a href="#top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
          Top of Page &uarr;
        </a>
      </div>

      <div className="retro-footer-copyright">
        <p>
          <strong>Copyright &copy; 1998&ndash;1999 Emanuel's Reviews.</strong> All rights reserved.
          No portion of this website may be duplicated or distributed without written consent.
        </p>
        <p className="retro-footer-disclaimer">
          Images, movie posters, artwork, and character trademarks remain the intellectual property of their respective film production companies and distributors. Evaluated under Fair Use commentary guidelines.
        </p>
      </div>

      {/* Authentic Late-90s Technical Specs */}
      <div className="retro-footer-tech">
        <div className="retro-footer-specs">
          <span>Best viewed with <strong>Netscape Navigator 4.0</strong> or <strong>Microsoft Internet Explorer 4.0+</strong></span>
          <span className="bullet">&bull;</span>
          <span>Resolution: <strong>800 x 600</strong> (16-bit High Color recommended)</span>
          <span className="bullet">&bull;</span>
          <span>
            API Powered by{' '}
            <a href="https://emanuels.review/" target="_blank" rel="noopener noreferrer">
              emanuels.review
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};
