import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import apiService from '../../services/api';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const SeasonDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch season details
  const { data: seasonData, isLoading: seasonLoading, error: seasonError } = useQuery(
    ['season', id],
    () => apiService.getSeason(id)
  );

  // Fetch season races
  const { data: racesData, isLoading: racesLoading } = useQuery(
    ['seasonRaces', id],
    () => apiService.getSeasonRaces(id),
    {
      enabled: !!id
    }
  );

  // Fetch driver standings
  const { data: driverStandingsData, isLoading: driverStandingsLoading } = useQuery(
    ['seasonDriverStandings', id],
    () => apiService.getSeasonStandings(id, 'Driver'),
    {
      enabled: !!id && (activeTab === 'drivers' || activeTab === 'overview')
    }
  );

  // Fetch team standings
  const { data: teamStandingsData, isLoading: teamStandingsLoading } = useQuery(
    ['seasonTeamStandings', id],
    () => apiService.getSeasonStandings(id, 'Team'),
    {
      enabled: !!id && (activeTab === 'teams' || activeTab === 'overview')
    }
  );

  if (seasonLoading) {
    return <Loading message="Loading season details..." />;
  }

  if (seasonError) {
    return <ErrorMessage message="Failed to load season details." />;
  }

  const season = seasonData?.data;
  const races = racesData?.data?.results || [];
  const driverStandings = driverStandingsData?.data?.results || [];
  const teamStandings = teamStandingsData?.data?.results || [];

  // Sort races by date
  const sortedRaces = [...races].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Split races into past and upcoming
  const today = new Date();
  const pastRaces = sortedRaces.filter(race => new Date(race.date) < today);
  const upcomingRaces = sortedRaces.filter(race => new Date(race.date) >= today);

  // Format date for display
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  // Format money value
  const formatMoney = (amount) => {
    if (!amount) return 'Not disclosed';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="season-detail-container">
      <div className="season-header">
        <div className="season-header-content">
          <h1 className="season-title">{season.year} Formula 1 Season</h1>
          
          {season.title_sponsor && (
            <div className="season-sponsor">
              Sponsored by {season.title_sponsor}
            </div>
          )}
          
          <div className="season-stats">
            <div className="season-stat">
              <span className="stat-value">{season.number_of_races}</span>
              <span className="stat-label">Races</span>
            </div>
            <div className="season-stat">
              <span className="stat-value">{season.champion_driver_name || 'TBD'}</span>
              <span className="stat-label">Driver Champion</span>
            </div>
            <div className="season-stat">
              <span className="stat-value">{season.champion_team_name || 'TBD'}</span>
              <span className="stat-label">Team Champion</span>
            </div>
            {season.prize_money_awarded && (
              <div className="season-stat">
                <span className="stat-value">
                  ${(season.prize_money_awarded / 1000000).toFixed(0)}M
                </span>
                <span className="stat-label">Prize Money</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="season-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          Race Calendar
        </button>
        <button 
          className={`tab-button ${activeTab === 'drivers' ? 'active' : ''}`}
          onClick={() => setActiveTab('drivers')}
        >
          Driver Standings
        </button>
        <button 
          className={`tab-button ${activeTab === 'teams' ? 'active' : ''}`}
          onClick={() => setActiveTab('teams')}
        >
          Team Standings
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-grid">
              <div className="standings-summary card">
                <div className="card-header">
                  <h3>Current Standings Summary</h3>
                </div>
                <div className="card-body">
                  <div className="standings-summary-container">
                    <div className="standings-section">
                      <h4>Top Drivers</h4>
                      {driverStandingsLoading ? (
                        <Loading message="Loading standings..." />
                      ) : driverStandings.length > 0 ? (
                        <table className="standings-table small">
                          <thead>
                            <tr>
                              <th>Pos</th>
                              <th>Driver</th>
                              <th>Points</th>
                              <th>Wins</th>
                            </tr>
                          </thead>
                          <tbody>
                            {driverStandings.slice(0, 5).map(standing => (
                              <tr key={standing.standings_id}>
                                <td className="position-cell">{standing.rank || '-'}</td>
                                <td>
                                  <Link to={`/drivers/${standing.entity_id}`}>
                                    {standing.driver_name}
                                  </Link>
                                </td>
                                <td>{standing.points}</td>
                                <td>{standing.wins}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="no-data">No driver standings available</p>
                      )}
                    </div>
                    
                    <div className="standings-section">
                      <h4>Top Teams</h4>
                      {teamStandingsLoading ? (
                        <Loading message="Loading standings..." />
                      ) : teamStandings.length > 0 ? (
                        <table className="standings-table small">
                          <thead>
                            <tr>
                              <th>Pos</th>
                              <th>Team</th>
                              <th>Points</th>
                              <th>Wins</th>
                            </tr>
                          </thead>
                          <tbody>
                            {teamStandings.slice(0, 5).map(standing => (
                              <tr key={standing.standings_id}>
                                <td className="position-cell">{standing.rank || '-'}</td>
                                <td>
                                  <Link to={`/teams/${standing.entity_id}`}>
                                    {standing.team_name}
                                  </Link>
                                </td>
                                <td>{standing.points}</td>
                                <td>{standing.wins}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="no-data">No team standings available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="race-summary card">
                <div className="card-header">
                  <h3>Race Calendar Summary</h3>
                </div>
                <div className="card-body">
                  {racesLoading ? (
                    <Loading message="Loading races..." />
                  ) : races.length > 0 ? (
                    <div className="race-calendar-summary">
                      <div className="race-calendar-section">
                        <h4>Upcoming Races</h4>
                        {upcomingRaces.length > 0 ? (
                          <div className="race-list">
                            {upcomingRaces.slice(0, 3).map(race => (
                              <div key={race.race_id} className="race-item">
                                <div className="race-date">{formatDate(race.date)}</div>
                                <div className="race-name">
                                  <Link to={`/races/${race.race_id}`}>
                                    {race.location} Grand Prix
                                  </Link>
                                </div>
                                <div className="race-circuit">
                                  <Link to={`/circuits/${race.circuit_id}`}>
                                    {race.circuit_name}
                                  </Link>
                                </div>
                              </div>
                            ))}
                            {upcomingRaces.length > 3 && (
                              <div className="more-link">
                                <button 
                                  className="link-button"
                                  onClick={() => setActiveTab('calendar')}
                                >
                                  See {upcomingRaces.length - 3} more upcoming races
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="no-data">No upcoming races</p>
                        )}
                      </div>
                      
                      <div className="race-calendar-section">
                        <h4>Recent Results</h4>
                        {pastRaces.length > 0 ? (
                          <div className="race-list">
                            {pastRaces.slice(-3).reverse().map(race => (
                              <div key={race.race_id} className="race-item">
                                <div className="race-date">{formatDate(race.date)}</div>
                                <div className="race-name">
                                  <Link to={`/races/${race.race_id}`}>
                                    {race.location} Grand Prix
                                  </Link>
                                </div>
                                <div className="race-circuit">
                                  <Link to={`/circuits/${race.circuit_id}`}>
                                    {race.circuit_name}
                                  </Link>
                                </div>
                              </div>
                            ))}
                            {pastRaces.length > 3 && (
                              <div className="more-link">
                                <button 
                                  className="link-button"
                                  onClick={() => setActiveTab('calendar')}
                                >
                                  See {pastRaces.length - 3} more completed races
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="no-data">No completed races</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="no-data">No races scheduled for this season</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="calendar-tab">
            <h2>Race Calendar</h2>
            {racesLoading ? (
              <Loading message="Loading race calendar..." />
            ) : races.length > 0 ? (
              <div className="race-calendar">
                {upcomingRaces.length > 0 && (
                  <div className="race-section">
                    <h3 className="section-title">Upcoming Races</h3>
                    <div className="race-table-container">
                      <table className="race-table">
                        <thead>
                          <tr>
                            <th>Round</th>
                            <th>Date</th>
                            <th>Grand Prix</th>
                            <th>Circuit</th>
                            <th>Laps</th>
                            <th>Distance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcomingRaces.map((race, index) => (
                            <tr key={race.race_id}>
                              <td className="round-cell">{pastRaces.length + index + 1}</td>
                              <td>{formatDate(race.date)}</td>
                              <td>
                                <Link to={`/races/${race.race_id}`}>
                                  {race.location} Grand Prix
                                </Link>
                              </td>
                              <td>
                                <Link to={`/circuits/${race.circuit_id}`}>
                                  {race.circuit_name}
                                </Link>
                              </td>
                              <td>{race.number_of_laps}</td>
                              <td>{race.race_distance} km</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {pastRaces.length > 0 && (
                  <div className="race-section">
                    <h3 className="section-title">Completed Races</h3>
                    <div className="race-table-container">
                      <table className="race-table">
                        <thead>
                          <tr>
                            <th>Round</th>
                            <th>Date</th>
                            <th>Grand Prix</th>
                            <th>Circuit</th>
                            <th>Winner</th>
                            <th>Team</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pastRaces.map((race, index) => (
                            <tr key={race.race_id}>
                              <td className="round-cell">{index + 1}</td>
                              <td>{formatDate(race.date)}</td>
                              <td>
                                <Link to={`/races/${race.race_id}`}>
                                  {race.location} Grand Prix
                                </Link>
                              </td>
                              <td>
                                <Link to={`/circuits/${race.circuit_id}`}>
                                  {race.circuit_name}
                                </Link>
                              </td>
                              <td>{race.winner_name || 'N/A'}</td>
                              <td>{race.winner_team || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="no-data">No races scheduled for this season</p>
            )}
          </div>
        )}

        {activeTab === 'drivers' && (
          <div className="drivers-tab">
            <h2>Driver Standings</h2>
            {driverStandingsLoading ? (
              <Loading message="Loading driver standings..." />
            ) : driverStandings.length > 0 ? (
              <div className="standings-table-container">
                <table className="standings-table">
                  <thead>
                    <tr>
                      <th>Position</th>
                      <th>Driver</th>
                      <th>Team</th>
                      <th>Points</th>
                      <th>Wins</th>
                      <th>Podiums</th>
                      <th>Fastest Laps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {driverStandings.map(standing => (
                      <tr key={standing.standings_id}>
                        <td className="position-cell">{standing.rank || '-'}</td>
                        <td>
                          <Link to={`/drivers/${standing.entity_id}`}>
                            {standing.driver_name}
                          </Link>
                        </td>
                        <td>
                          <Link to={`/teams/${standing.team_id}`}>
                            {standing.team_name}
                          </Link>
                        </td>
                        <td className="points-cell">{standing.points}</td>
                        <td>{standing.wins}</td>
                        <td>{standing.podiums}</td>
                        <td>{standing.fastest_laps}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No driver standings available for this season</p>
            )}
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="teams-tab">
            <h2>Team Standings</h2>
            {teamStandingsLoading ? (
              <Loading message="Loading team standings..." />
            ) : teamStandings.length > 0 ? (
              <div className="standings-table-container">
                <table className="standings-table">
                  <thead>
                    <tr>
                      <th>Position</th>
                      <th>Team</th>
                      <th>Points</th>
                      <th>Wins</th>
                      <th>Podiums</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamStandings.map(standing => (
                      <tr key={standing.standings_id}>
                        <td className="position-cell">{standing.rank || '-'}</td>
                        <td>
                          <Link to={`/teams/${standing.entity_id}`}>
                            {standing.team_name}
                          </Link>
                        </td>
                        <td className="points-cell">{standing.points}</td>
                        <td>{standing.wins}</td>
                        <td>{standing.podiums}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No team standings available for this season</p>
            )}
          </div>
        )}
      </div>

      <div className="back-link">
        <Link to="/seasons">&larr; Back to Seasons</Link>
      </div>

      <style jsx>{`
        .season-detail-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .season-header {
          margin-bottom: 30px;
          background-color: var(--secondary-color);
          color: white;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .season-header-content {
          padding: 25px;
        }
        
        .season-title {
          margin-top: 0;
          margin-bottom: 5px;
          font-size: 2rem;
        }
        
        .season-sponsor {
          margin-bottom: 20px;
          font-size: 1.1rem;
          opacity: 0.8;
        }
        
        .season-stats {
          display: flex;
          gap: 40px;
        }
        
        .season-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .season-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 20px;
        }
        
        .tab-button {
          padding: 12px 20px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-color);
          transition: color 0.2s ease, border-color 0.2s ease;
        }
        
        .tab-button:hover {
          color: var(--primary-color);
        }
        
        .tab-button.active {
          color: var(--primary-color);
          border-bottom-color: var(--primary-color);
        }
        
        .tab-content {
          margin-bottom: 30px;
        }
        
        .overview-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .card-header {
          padding: 15px 20px;
          background-color: #f5f5f5;
          border-bottom: 1px solid var(--border-color);
        }
        
        .card-header h3 {
          margin: 0;
          font-size: 1.2rem;
          color: var(--secondary-color);
        }
        
        .card-body {
          padding: 20px;
        }
        
        .standings-summary-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .standings-section h4,
        .race-calendar-section h4 {
          margin-top: 0;
          margin-bottom: 15px;
          color: var(--secondary-color);
          font-size: 1rem;
        }
        
        .standings-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .standings-table th,
        .standings-table td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }
        
        .standings-table th {
          background-color: var(--secondary-color);
          color: white;
          font-weight: 500;
        }
        
        .standings-table.small th,
        .standings-table.small td {
          padding: 8px;
          font-size: 0.9rem;
        }
        
        .race-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .race-item {
          padding: 10px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
        }
        
        .race-date {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 5px;
        }
        
        .race-name {
          font-weight: 500;
          margin-bottom: 3px;
        }
        
        .race-name a {
          color: var(--text-color);
          text-decoration: none;
        }
        
        .race-name a:hover {
          color: var(--primary-color);
        }
        
        .race-circuit {
          font-size: 0.85rem;
        }
        
        .race-circuit a {
          color: var(--accent-color);
          text-decoration: none;
        }
        
        .race-circuit a:hover {
          text-decoration: underline;
        }
        
        .more-link {
          text-align: center;
          margin-top: 10px;
        }
        
        .link-button {
          background: none;
          border: none;
          color: var(--accent-color);
          cursor: pointer;
          font-size: 0.9rem;
          text-decoration: underline;
        }
        
        .link-button:hover {
          color: var(--primary-color);
        }
        
        .calendar-tab h2,
        .drivers-tab h2,
        .teams-tab h2 {
          margin-top: 0;
          margin-bottom: 20px;
          color: var(--secondary-color);
        }
        
        .race-section {
          margin-bottom: 30px;
        }
        
        .section-title {
          margin-bottom: 15px;
          padding-bottom: 5px;
          border-bottom: 1px solid var(--border-color);
          color: var(--secondary-color);
        }
        
        .race-table-container,
        .standings-table-container {
          overflow-x: auto;
        }
        
        .race-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .race-table th,
        .race-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }
        
        .race-table th {
          background-color: var(--secondary-color);
          color: white;
          font-weight: 500;
        }
        
        .position-cell,
        .round-cell {
          font-weight: 700;
          text-align: center;
        }
        
        .points-cell {
          font-weight: 700;
        }
        
        .no-data {
          padding: 20px;
          text-align: center;
          color: #666;
          font-style: italic;
          background-color: #f9f9f9;
          border-radius: 8px;
        }
        
        .back-link {
          margin-top: 30px;
        }
        
        .back-link a {
          color: var(--accent-color);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        
        .back-link a:hover {
          color: var(--primary-color);
          text-decoration: underline;
        }
        
        @media (max-width: 992px) {
          .overview-grid {
            grid-template-columns: 1fr;
          }
          
          .standings-summary-container {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .season-stats {
            flex-wrap: wrap;
            gap: 20px;
          }
          
          .season-tabs {
            flex-wrap: wrap;
          }
          
          .tab-button {
            flex: 1;
            min-width: 120px;
            padding: 10px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default SeasonDetail;
