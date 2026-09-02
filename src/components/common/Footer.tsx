import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src="/logo.png"
              alt="Emanuel's Reviews Logo"
              style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }}
            />
            <div>
              <strong style={{ color: '#fff', fontSize: '0.95rem' }}>
                <span style={{ color: '#fff' }}>EMANUEL'S </span>
                <span style={{ color: '#e50914', fontWeight: 900 }}>REVIEWS</span>
              </strong>
              <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem', fontSize: '0.8rem' }}>
                Objective & Precisely Scored
              </span>
            </div>
          </div>

          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/reviews">Reviews</Link>
            <Link to="/stats">Stats</Link>
            <Link to="/search">Search</Link>
            <a
              href="http://api.emanuels.review/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
            >
              REST API <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <p>
            Images, posters, artwork, titles, and related media belong to their respective owners and are used here for identification and commentary purposes.
          </p>
          <p>
            © {new Date().getFullYear()} Sai Kiran. Data provided by <a href='https://emanuels.review/'>Emanuel's Review</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
