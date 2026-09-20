import React, { useState } from 'react';

interface PosterImageProps {
  src?: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  style?: React.CSSProperties;
}

export const PosterImage: React.FC<PosterImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  style,
}) => {
  const [hasError, setHasError] = useState(!src);

  if (!src || hasError) {
    return (
      <div
        className={`${className} retro-poster-fallback`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e0e0e0',
          color: '#333333',
          border: '1px solid #999999',
          padding: '6px',
          textAlign: 'center',
          fontSize: '11px',
          fontFamily: 'Arial, sans-serif',
          minHeight: '80px',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>[No Image]</div>
        <div style={{ fontSize: '10px' }}>{alt}</div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setHasError(true)}
      style={{
        border: '1px solid #000000',
        display: 'block',
        ...style,
      }}
    />
  );
};
