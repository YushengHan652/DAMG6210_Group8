import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const RaceCard = ({ race, isPast }) => {
  // Function to get weather icon based on condition
  const getWeatherIcon = (condition) => {
    if (!condition) return '☀️'; // Default to sunny
    
    condition = condition.toLowerCase();
    
    if (condition.includes('rain') || condition.includes('shower')) {
      return '🌧️';
    } else if (condition.includes('cloud')) {
      return '☁️';
    } else if (condition.includes('clear') || condition.includes('sunny')) {
      return '☀️';
    } else if (condition.includes('storm')) {
      return '⛈️';
    } else if (condition.includes('fog') || condition.includes('mist')) {
      return '🌫️';
    } else if (condition.includes('snow')) {
      return '❄️';
    } else if (condition.includes('wind')) {
      return '💨';
    } else {
      return '🌈'; // For any other weather
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  const weatherIcon = getWeatherIcon(race.weather_condition);

  return (
    <div className={`race-card ${isPast ? 'past-race' : 'upcoming-race'}`}>
      <div className="race-header">
        <div className="race-flag">{race.location.slice(0, 2).toUpperCase()}</div>
        <div className="race-date">{formatDate(race.date)}</div>
        <div className="race-weather" title={race.weather_condition || 'Weather data not available'}>
          {weatherIcon}
        </div>
      </div>
      
      <div className="race-content">
        <h3 className="race-name">
          <Link to={`/races/${race.race_id}`}>{race.location} Grand Prix</Link>
        </h3>
        
        <div className="race-circuit">
          <Link to={`/circuits/${race.circuit_id}`}>{race.circuit_name}</Link>
        </div>
        
        <div className="race-details">
          <div className="race-detail">
            <span className="detail-label">Laps:</span>
            <span className="detail-value">{race.number_of_laps}</span>
          </div>
          
          <div className="race-detail">
            <span className="detail-label">Distance:</span>
            <span className="detail-value">{race.race_distance} km</span>
          </div>
          
          <div className="race-detail">
            <span className="detail-label">Circuit Length:</span>
            <span className="detail-value">{race.circuit_length} km</span>
          </div>
        </div>
      </div>
      
      <div className="race-footer">
        <Link to={`/races/${race.race_id}`} className="race-link">
          {isPast ? 'View Results' : 'Race Details'}
        </Link>
      </div>

      <style jsx>{`
        .race-card {
          border-radius: 8px;
          overflow: hidden;
          background-color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        
        .race-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
        
        .race-card.past-race {
          position: relative;
        }
        
        .race-card.past-race:after {
          content: "COMPLETED";
          position: absolute;
          top: 15px;
          right: 15px;
          background-color: var(--success-color);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 30px;
        }
        
        .race-card.upcoming-race {
          position: relative;
        }
        
        .race-card.upcoming-race:after {
          content: "UPCOMING";
          position: absolute;
          top: 15px;
          right: 15px;
          background-color: var(--accent-color);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 30px;
        }
        
        .race-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background-color: var(--secondary-color);
          color: white;
        }
        
        .race-flag {
          font-weight: 700;
          background-color: rgba(255, 255, 255, 0.2);
          padding: 3px 6px;
          border-radius: 4px;
        }
        
        .race-date {
          font-weight: 500;
          font-size: 0.9rem;
        }
        
        .race-weather {
          font-size: 1.2rem;
        }
        
        .race-content {
          padding: 20px;
          flex-grow: 1;
        }
        
        .race-name {
          margin-top: 0;
          margin-bottom: 5px;
          font-size: 1.25rem;
        }
        
        .race-name a {
          color: var(--text-color);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        .race-name a:hover {
          color: var(--primary-color);
        }
        
        .race-circuit {
          margin-bottom: 15px;
          font-size: 0.9rem;
        }
        
        .race-circuit a {
          color: var(--accent-color);
          text-decoration: none;
        }
        
        .race-circuit a:hover {
          color: var(--primary-color);
          text-decoration: underline;
        }
        
        .race-details {
          margin-top: 15px;
        }
        
        .race-detail {
          margin-bottom: 5px;
          display: flex;
          font-size: 0.9rem;
        }
        
        .detail-label {
          font-weight: 500;
          width: 110px;
          color: #666;
        }
        
        .detail-value {
          flex: 1;
        }
        
        .race-footer {
          padding: 15px;
          background-color: #f5f5f5;
          text-align: center;
          border-top: 1px solid var(--border-color);
        }
        
        .race-link {
          display: inline-block;
          padding: 8px 16px;
          background-color: var(--secondary-color);
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-size: 0.9rem;
          transition: background-color 0.2s ease;
        }
        
        .race-link:hover {
          background-color: var(--primary-color);
          color: white;
        }
      `}</style>
    </div>
  );
};

export default RaceCard;
