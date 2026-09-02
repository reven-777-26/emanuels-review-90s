import React, { useState } from 'react';
import { Film } from 'lucide-react';

interface PosterImageProps {
  src?: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const PosterImage: React.FC<PosterImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
}) => {
  const [hasError, setHasError] = useState(!src);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`${className} poster-fallback`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#161c2b',
          color: '#64748b',
          padding: '1rem',
          textAlign: 'center',
          height: '100%',
        }}
      >
        <Film size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onLoad={() => setIsLoaded(true)}
      onError={() => setHasError(true)}
      style={{
        opacity: isLoaded ? 1 : 0.4,
        transition: 'opacity 0.3s ease',
      }}
    />
  );
};
