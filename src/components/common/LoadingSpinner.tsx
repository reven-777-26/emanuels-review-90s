import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading movie archive records from database, please wait...',
}) => {
  return (
    <div className="retro-loading-box">
      <div className="retro-loading-inner">
        <div className="retro-hourglass">&#9203;</div>
        <div className="retro-loading-text">
          <strong>DATABASE ACCESS IN PROGRESS...</strong>
          <p>{message}</p>
          <div className="retro-loading-bar">
            <div className="retro-loading-bar-fill" />
          </div>
        </div>
      </div>
    </div>
  );
};
