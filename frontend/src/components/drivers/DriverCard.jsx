import React from 'react';
import { Link } from 'react-router-dom';

const DriverCard = ({ driver }) => {
  // Determine driver card accent color based on team
  const getTeamColor = (teamName) => {
    const teamColors = {
      'Red Bull Racing': '#0600EF',
      'Mercedes-AMG Petronas': '#00D2BE',
      'Scuderia Ferrari': '#DC0000',
      'McLaren Racing': '#FF8700',
      'Aston Martin': '#006F62',
      'Alpine F1 Team': '#0090FF',
      'Williams Racing': '#005AFF',
      'Visa Cash App RB': '#1E41FF',
      'Stake F1 Team Kick Sauber': '#900000',
      'MoneyGram Haas F1 Team': '#FFFFFF',
    };
    
    return teamColors[teamName] || '#333333';
  };

  // Format salary to a readable string
  const formatSalary = (salary) => {
    if (!salary) return 'Not disclosed';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(salary);
  };

  const teamColor = getTeamColor(driver.team_name);

  return (
    <div className="driver-card">
      <div className="driver-card-header" style={{ backgroundColor: teamColor }}>
        <div className="driver-name-container">
          <h3 className="driver-name">
            <Link to={`/drivers/${driver.driver_id}`}>{driver.name}</Link>
          </h3>
          <div className="driver-number">#{driver.driver_id}</div>
        </div>
      </div>
      
      <div className="driver-card-content">
        <div className="driver-details">
          <div className="driver-detail">
            <span className="detail-label">Team:</span>
            <Link to={`/teams/${driver.team_id}`} className="team-link">
              {driver.team_name}
            </Link>
          </div>
          
          <div className="driver-detail">
            <span className="detail-label">Age:</span>
            <span className="detail-value">{driver.age}</span>
          </div>
          
          <div className="driver-detail">
            <span className="detail-label">Nationality:</span>
            <span className="detail-value">{driver.nationality}</span>
          </div>
          
          <div className="driver-stats">
            <div className="stat-item">
              <span className="stat-value">{driver.number_of_wins}</span>
              <span className="stat-label">Wins</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-value">{driver.pole_positions}</span>
              <span className="stat-label">Poles</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-value">{driver.fastest_laps}</span>
              <span className="stat-label">Fast Laps</span>
            </div>
          </div>
        </div>
        
        <div className="driver-card-footer">
          <Link to={`/drivers/${driver.driver_id}`} className="view-driver-btn">View Profile</Link>
        </div>
      </div>

      <style jsx>{`
        .driver-card {
          border-radius: 8px;
          overflow: hidden;
          background-color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .driver-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
        
        .driver-card-header {
          padding: 15px;
          color: white;
        }
        
        .driver-name-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .driver-name {
          margin: 0;
          font-size: 1.25rem;
        }
        
        .driver-name a {
          color: white;
          text-decoration: none;
        }
        
        .driver-number {
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .driver-card-content {
          padding: 20px;
        }
        
        .driver-details {
          margin-bottom: 15px;
        }
        
        .driver-detail {
          margin-bottom: 8px;
          display: flex;
          font-size: 0.9rem;
        }
        
        .detail-label {
          font-weight: 500;
          width: 100px;
          color: #666;
        }
        
        .detail-value {
          flex: 1;
        }
        
        .team-link {
          color: var(--text-color);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        .team-link:hover {
          color: var(--primary-color);
        }
        
        .driver-stats {
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid var(--border-color);
        }
        
        .stat-item {
          text-align: center;
          flex: 1;
        }
        
        .stat-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary-color);
        }
        
        .stat-label {
          display: block;
          font-size: 0.8rem;
          color: #666;
        }
        
        .driver-card-footer {
          margin-top: 15px;
          text-align: center;
        }
        
        .view-driver-btn {
          display: inline-block;
          padding: 8px 16px;
          background-color: var(--secondary-color);
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-size: 0.9rem;
          transition: background-color 0.2s ease;
        }
        
        .view-driver-btn:hover {
          background-color: var(--primary-color);
          color: white;
        }
      `}</style>
    </div>
  );
};

export default DriverCard;
