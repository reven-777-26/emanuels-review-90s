import React from 'react';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = 'System Error Encountered',
  message,
  onRetry,
}) => {
  return (
    <div className="retro-error-box">
      <div className="retro-error-title">&#9888; {title}</div>
      <div className="retro-error-message">{message}</div>
      <p style={{ fontSize: '11px', color: '#666', marginTop: '6px' }}>
        Please verify your network connection or contact the webmaster if the issue persists.
      </p>
      {onRetry && (
        <div style={{ marginTop: '10px' }}>
          <button onClick={onRetry} className="btn-retro">
            [ Retry Database Request ]
          </button>
        </div>
      )}
    </div>
  );
};
