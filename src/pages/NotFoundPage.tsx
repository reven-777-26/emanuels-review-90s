import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{ padding: '15px 10px', textAlign: 'center' }}>
      <div className="retro-section-header red" style={{ textAlign: 'left' }}>
        <span className="retro-section-title">HTTP 404 - FILE OR REVIEW NOT LOCATED</span>
      </div>

      <div className="box-yellow" style={{ textAlign: 'left', marginTop: '10px' }}>
        <h2 style={{ fontSize: '15px', color: '#990000', margin: '0 0 6px 0' }}>
          Error 404: The Specified Document Was Not Found
        </h2>
        <p style={{ fontSize: '12px', lineHeight: 1.4 }}>
          The movie review, television series analysis, or catalog page you requested does not exist
          in Emanuel's archive database or may have been relocated during an archive rebuild.
        </p>

        <div style={{ fontSize: '11px', marginTop: '8px' }}>
          <strong>Suggested Troubleshooting Steps:</strong>
          <ul style={{ margin: '4px 0 8px 18px', padding: 0 }}>
            <li>Verify the spelling of the URL address in your browser.</li>
            <li>Use the navigation tabs above or the directory on the left.</li>
            <li>Consult the archive search engine to find the title by keyword.</li>
          </ul>
        </div>

        <div style={{ marginTop: '12px' }}>
          <Link to="/" className="btn-retro btn-retro-navy">
            &lt;&lt; Return to Home Page
          </Link>{' '}
          <Link to="/reviews" className="btn-retro">
            Browse All Reviews
          </Link>{' '}
          <Link to="/search" className="btn-retro">
            Search Archive
          </Link>
        </div>
      </div>
    </div>
  );
};
