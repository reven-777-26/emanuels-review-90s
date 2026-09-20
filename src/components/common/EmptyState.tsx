import React from 'react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Matching Records Found',
  message = 'No reviews match your query criteria in Emanuel\'s archive.',
  action,
}) => {
  return (
    <div className="retro-empty-box">
      <div className="retro-empty-title">*** {title} ***</div>
      <p className="retro-empty-message">{message}</p>
      {action && (
        <div style={{ marginTop: '8px' }}>
          <button onClick={action.onClick} className="btn-retro">
            [ {action.label} ]
          </button>
        </div>
      )}
    </div>
  );
};
