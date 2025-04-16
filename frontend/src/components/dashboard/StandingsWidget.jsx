import React from 'react';
import { Link } from 'react-router-dom';

const StandingsWidget = ({ standings, type }) => {
  // Show only top 10 standings
  const displayStandings = standings ? standings.slice(0, 10) : [];

  if (!displayStandings.length) {
    return <p className="no-data">No standings data available</p>;
  }

  return (
    <div className="standings-widget">
      <div className="table-container">
        <table className="table standings-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>{type}</th>
              <th>Pts</th>
              <th>Wins</th>
            </tr>
          </thead>
          <tbody>
            {displayStandings.map((standing) => (
              <tr key={standing.standings_id}>
                <td className="position">{standing.rank || '-'}</td>
                <td className="name">
                  <Link to={`/${type.toLowerCase()}s/${standing.entity_id}`}>
                    {type === 'Driver' 
                      ? standing.driver_name
                      : standing.team_name}
                  </Link>
                </td>
                <td className="points">{standing.points}</td>
                <td className="wins">{standing.wins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="see-more">
        <Link to={`/seasons/${standings[0]?.season_id}`} className="see-more-link">
          View Complete Standings
        </Link>
      </div>

      <style jsx>{`
        .standings-widget {
          width: 100%;
        }
        
        .standings-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .standings-table th {
          font-weight: 500;
          text-align: left;
          padding: 10px;
          border-bottom: 2px solid var(--border-color);
        }
        
        .standings-table td {
          padding: 10px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .position {
          font-weight: 700;
          width: 40px;
          text-align: center;
        }
        
        .points, .wins {
          text-align: center;
          width: 60px;
        }
        
        .name {
          font-weight: 500;
        }
        
        .name a {
          color: var(--text-color);
          text-decoration: none;
        }
        
        .name a:hover {
          color: var(--primary-color);
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
      `}</style>
    </div>
  );
};

export default StandingsWidget;
