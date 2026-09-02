import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div
      className="container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-accent-gold)',
          marginBottom: '1.5rem',
        }}
      >
        <Film size={36} />
      </div>

      <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>
        Scene Not Found
      </h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '460px', marginBottom: '2rem' }}>
        The review, page, or reel you're looking for doesn't exist or has been cut from Emanuel's archive.
      </p>

      <Link to="/" className="btn btn-primary">
        <ArrowLeft size={16} />
        <span>Return Home</span>
      </Link>
    </div>
  );
};
