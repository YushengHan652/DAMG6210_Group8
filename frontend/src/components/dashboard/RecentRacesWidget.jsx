import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const RecentRacesWidget = ({ races, type }) => {
  if (!races || !races.length) {
    return <p className="no-data">No race data available</p>;
  }

  return (
    <div className="races-widget">
      <div className="races-list">
        {races.map((race) => (
          <div key={race.race_id} className="race-card">
            <div className="race-date">
              {format(new Date(race.date), 'MMM d, yyyy')}
            </div>
            <div className="race-info">
              <h4 className="race-location">
                <Link to={`/races/${race.race_id}`}>
                  {race.location} Grand Prix
                </Link>
              </h4>
              <p className="race-circuit">{race.circuit_name}</p>
            </div>
            <div className="race-details">
              {type === 'upcoming' ? (
                <span className="race-status upcoming">
                  Upcoming
                </span>
              ) : (
                <span className="race-status completed">
                  Completed
                </span>
              )}
              <Link to={`/races/${race.race_id}`} className="race-link">
                {type === 'upcoming' ? 'Details' : 'Results'}
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="see-more">
        <Link to="/races" className="see-more-link">
          View All Races
        </Link>
      </div>

      <style jsx>{`
        .races-widget {
          width: 100%;
        }
        
        .races-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .race-card {
          display: flex;
          align-items: center;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .race-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .race-date {
          flex: 0 0 100px;
          font-size: 0.9rem;
          color: var(--text-color);
          font-weight: 500;
        }
        
        .race-info {
          flex: 1;
        }
        
        .race-location {
          margin: 0;
          font-size: 1rem;
        }
        
        .race-location a {
          color: var(--text-color);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        .race-location a:hover {
          color: var(--primary-color);
        }
        
        .race-circuit {
          margin: 0;
          font-size: 0.8rem;
          color: #666;
        }
        
        .race-details {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
        }
        
        .race-status {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .race-status.upcoming {
          background-color: var(--accent-color);
          color: white;
        }
        
        .race-status.completed {
          background-color: var(--success-color);
          color: white;
        }
        
        .race-link {
          font-size: 0.9rem;
          color: var(--accent-color);
          text-decoration: none;
        }
        
        .race-link:hover {
          color: var(--primary-color);
          text-decoration: underline;
        }
        
        .see-more {
          margin-top: 15px;
          text-align: center;
        }
        
        .see-more-link {
          display: inline-block;
          padding: 8px 16px;
          background-color: var(--secondary-color);
          color: var(--light-text-color);
          border-radius: 4px;
          text-decoration: none;
          font-size: 14px;
          transition: background-color 0.3s ease;
        }
        
        .see-more-link:hover {
          background-color: var(--primary-color);
          color: var(--light-text-color);
        }
        
        .no-data {
          padding: 20px;
          text-align: center;
          color: var(--text-color);
          font-style: italic;
        }
        
        @media (max-width: 576px) {
          .race-card {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .race-date {
            margin-bottom: 5px;
          }
          
          .race-details {
            align-items: flex-start;
            margin-top: 10px;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default RecentRacesWidget;
