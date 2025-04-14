import React from 'react';
import { Link } from 'react-router-dom';

const TeamCard = ({ team }) => {
  // Determine team color based on team name for visual identification
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

  // Format budget to a readable string with currency symbol
  const formatBudget = (budget) => {
    if (!budget) return 'Not disclosed';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(budget);
  };

  return (
    <div className="team-card">
      <div className="team-color-bar" style={{ backgroundColor: getTeamColor(team.team_name) }}></div>
      <div className="team-card-content">
        <h3 className="team-name">
          <Link to={`/teams/${team.team_id}`}>{team.team_name}</Link>
        </h3>
        
        <div className="team-details">
          <div className="team-detail">
            <span className="detail-label">Country:</span>
            <span className="detail-value">{team.team_country}</span>
          </div>
          
          <div className="team-detail">
            <span className="detail-label">Principal:</span>
            <span className="detail-value">{team.team_principal || 'N/A'}</span>
          </div>
          
          <div className="team-detail">
            <span className="detail-label">Founded:</span>
            <span className="detail-value">{team.founded_year || 'N/A'}</span>
          </div>
          
          <div className="team-detail">
            <span className="detail-label">Budget:</span>
            <span className="detail-value">{formatBudget(team.budget)}</span>
          </div>
          
          <div className="team-detail">
            <span className="detail-label">Championships:</span>
            <span className="detail-value championships">
              {team.championships_won}
            </span>
          </div>
        </div>
        
        <div className="team-card-footer">
          <Link to={`/teams/${team.team_id}`} className="view-team-btn">View Team</Link>
        </div>
      </div>

      <style jsx>{`
        .team-card {
          border-radius: 8px;
          overflow: hidden;
          background-color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        
        .team-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
        
        .team-color-bar {
          height: 8px;
          width: 100%;
        }
        
        .team-card-content {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .team-name {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 1.25rem;
        }
        
        .team-name a {
          color: var(--text-color);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        .team-name a:hover {
          color: var(--primary-color);
        }
        
        .team-details {
          margin-bottom: 20px;
          flex: 1;
        }
        
        .team-detail {
          margin-bottom: 8px;
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
        
        .championships {
          font-weight: 700;
          color: var(--primary-color);
        }
        
        .team-card-footer {
          margin-top: auto;
          text-align: center;
        }
        
        .view-team-btn {
          display: inline-block;
          padding: 8px 16px;
          background-color: var(--secondary-color);
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-size: 0.9rem;
          transition: background-color 0.2s ease;
        }
        
        .view-team-btn:hover {
          background-color: var(--primary-color);
          color: white;
        }
      `}</style>
    </div>
  );
};

export default TeamCard;
