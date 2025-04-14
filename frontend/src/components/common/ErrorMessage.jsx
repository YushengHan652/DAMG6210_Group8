import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-container">
      <div className="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 className="error-title">Oops! Something went wrong</h3>
      <p className="error-message">{message || 'An error occurred while fetching data.'}</p>
      
      {onRetry && (
        <button className="btn btn-primary error-retry" onClick={onRetry}>
          Try Again
        </button>
      )}

      <style jsx>{`
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
          background-color: #fff0f0;
          border-radius: 8px;
          border: 1px solid var(--danger-color);
          margin: 20px 0;
        }
        
        .error-icon {
          color: var(--danger-color);
          margin-bottom: 20px;
        }
        
        .error-title {
          color: var(--danger-color);
          margin-bottom: 10px;
          font-size: 1.2rem;
        }
        
        .error-message {
          margin-bottom: 20px;
          color: var(--text-color);
        }
        
        .error-retry {
          background-color: var(--danger-color);
        }
        
        .error-retry:hover {
          background-color: #c0392b;
        }
      `}</style>
    </div>
  );
};

export default ErrorMessage;
