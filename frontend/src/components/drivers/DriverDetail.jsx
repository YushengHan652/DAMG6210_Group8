import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import apiService from '../../services/api';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const DriverDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSeason, setSelectedSeason] = useState('');

  // Fetch driver details
  const { data: driverData, isLoading: driverLoading, error: driverError } = useQuery(
    ['driver', id],
    () => apiService.getDriver(id)
  );

  // Fetch driver race results
  const { data: resultsData, isLoading: resultsLoading } = useQuery(
    ['driverResults', id, selectedSeason],
    () => apiService.getDriverRaceResults(id, selectedSeason),
    {
      enabled: !!id && (activeTab === 'results' || activeTab === 'overview')
    }
  );

  // Fetch driver race entries
  const { data: entriesData, isLoading: entriesLoading } = useQuery(
    ['driverEntries', id, selectedSeason],
    () => apiService.getDriverRaceEntries(id, selectedSeason),
    {
      enabled: !!id && activeTab === 'entries'
    }
  );

  // Fetch failures
  const { data: failuresData, isLoading: failuresLoading } = useQuery(
    ['driverFailures', id],
    () => apiService.getDriverFailures(id),
    {
      enabled: !!id && activeTab === 'failures'
    }
  );

  // Fetch penalties
  const { data: penaltiesData, isLoading: penaltiesLoading } = useQuery(
    ['driverPenalties', id],
    () => apiService.getDriverPenalties(id),
    {
      enabled: !!id && activeTab === 'penalties'
    }
  );

  // Fetch seasons for filter
  const { data: seasonsData } = useQuery(
    'seasons',
    () => apiService.getSeasons(),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  if (driverLoading) {
    return <Loading message="Loading driver details..." />;
  }

  if (driverError) {
    return <ErrorMessage message="Failed to load driver details." />;
  }

  const driver = driverData?.data;
  const results = resultsData?.data?.results || [];
  const entries = entriesData?.data?.results || [];
  const failures = failuresData?.data?.results || [];
  const penalties = penaltiesData?.data?.results || [];
  const seasons = seasonsData?.data?.results || [];

  // Determine team color for styling
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

  const teamColor = getTeamColor(driver.team_name);

  // Calculate career statistics
  const careerStats = {
    races: results.length,
    wins: results.filter(r => r.final_position === 1).length,
    podiums: results.filter(r => r.final_position && r.final_position <= 3).length,
    points: results.reduce((total, r) => total + (r.points_scored || 0), 0),
    dnfs: results.filter(r => r.dnf_status && r.dnf_status !== 'Completed').length,
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy');
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

  return (
    <div className="driver-detail-container">
      <div className="driver-header" style={{ borderColor: teamColor }}>
        <div className="driver-header-content">
          <h1 className="driver-name">{driver.name}</h1>
          <div className="driver-team">
            <Link to={`/teams/${driver.team_id}`} className="team-link">
              {driver.team_name}
            </Link>
          </div>
          <div className="driver-stats">
            <div className="driver-stat">
              <span className="stat-value">{driver.number_of_wins}</span>
              <span className="stat-label">Wins</span>
            </div>
            <div className="driver-stat">
              <span className="stat-value">{driver.pole_positions}</span>
              <span className="stat-label">Poles</span>
            </div>
            <div className="driver-stat">
              <span className="stat-value">{driver.fastest_laps}</span>
              <span className="stat-label">Fastest Laps</span>
            </div>
          </div>
        </div>
      </div>

      <div className="season-filter">
        <label htmlFor="season-select">Filter by Season:</label>
        <select
          id="season-select"
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="season-select"
        >
          <option value="">All Seasons</option>
          {seasons.map(season => (
            <option key={season.season_id} value={season.season_id}>
              {season.year} Season
            </option>
          ))}
        </select>
      </div>

      <div className="driver-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          Race Results
        </button>
        <button 
          className={`tab-button ${activeTab === 'entries' ? 'active' : ''}`}
          onClick={() => setActiveTab('entries')}
        >
          Race Entries
        </button>
        <button 
          className={`tab-button ${activeTab === 'failures' ? 'active' : ''}`}
          onClick={() => setActiveTab('failures')}
        >
          Failures
        </button>
        <button 
          className={`tab-button ${activeTab === 'penalties' ? 'active' : ''}`}
          onClick={() => setActiveTab('penalties')}
        >
          Penalties
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="driver-info-card">
              <h2>Driver Information</h2>
              <div className="driver-info-grid">
                <div className="info-item">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{driver.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Age</span>
                  <span className="info-value">{driver.age}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Nationality</span>
                  <span className="info-value">{driver.nationality}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Team</span>
                  <span className="info-value">
                    <Link to={`/teams/${driver.team_id}`}>{driver.team_name}</Link>
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Contract Until</span>
                  <span className="info-value">{formatDate(driver.contract_end_date)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Salary</span>
                  <span className="info-value">{formatSalary(driver.salary)}</span>
                </div>
              </div>
            </div>

            <div className="career-stats-card">
              <h2>Career Statistics</h2>
              <div className="stats-grid">
                <div className="stat-box">
                  <span className="box-value">{driver.number_of_wins}</span>
                  <span className="box-label">Race Wins</span>
                </div>
                <div className="stat-box">
                  <span className="box-value">{driver.pole_positions}</span>
                  <span className="box-label">Pole Positions</span>
                </div>
                <div className="stat-box">
                  <span className="box-value">{driver.fastest_laps}</span>
                  <span className="box-label">Fastest Laps</span>
                </div>
                <div className="stat-box">
                  <span className="box-value">{careerStats.podiums}</span>
                  <span className="box-label">Podium Finishes</span>
                </div>
                <div className="stat-box">
                  <span className="box-value">{careerStats.races}</span>
                  <span className="box-label">Race Entries</span>
                </div>
                <div className="stat-box">
                  <span className="box-value">{careerStats.points.toFixed(1)}</span>
                  <span className="box-label">Career Points</span>
                </div>
              </div>
            </div>

            <div className="recent-results">
              <h2>Recent Results</h2>
              {resultsLoading ? (
                <Loading message="Loading results..." />
              ) : results.length > 0 ? (
                <div className="results-table-container">
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Race</th>
                        <th>Position</th>
                        <th>Points</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.slice(0, 5).map(result => (
                        <tr key={result.result_id}>
                          <td>
                            <Link to={`/races/${result.race_id}`}>
                              {result.race_name} GP
                            </Link>
                          </td>
                          <td className="position-cell">
                            {result.final_position || '-'}
                          </td>
                          <td>{result.points_scored}</td>
                          <td>
                            <span className={`status ${result.dnf_status === 'Completed' ? 'completed' : 'dnf'}`}>
                              {result.dnf_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-data">No recent results available</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="results-tab">
            <h2>Race Results</h2>
            {resultsLoading ? (
              <Loading message="Loading race results..." />
            ) : results.length > 0 ? (
              <div className="results-table-container">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Race</th>
                      <th>Position</th>
                      <th>Points</th>
                      <th>Status</th>
                      <th>Pit Stops</th>
                      <th>Fastest Lap</th>
                      <th>Overtakes</th>
                      <th>Laps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map(result => (
                      <tr key={result.result_id}>
                        <td>
                          <Link to={`/races/${result.race_id}`}>
                            {result.race_name} GP
                          </Link>
                        </td>
                        <td className="position-cell">
                          {result.final_position || '-'}
                        </td>
                        <td>{result.points_scored}</td>
                        <td>
                          <span className={`status ${result.dnf_status === 'Completed' ? 'completed' : 'dnf'}`}>
                            {result.dnf_status}
                          </span>
                        </td>
                        <td>{result.pit_stops || '-'}</td>
                        <td>{result.fastest_lap_time || '-'}</td>
                        <td>{result.overtakes_made || '-'}</td>
                        <td>{result.laps_completed || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No race results available for this driver</p>
            )}
          </div>
        )}

        {activeTab === 'entries' && (
          <div className="entries-tab">
            <h2>Race Entries</h2>
            {entriesLoading ? (
              <Loading message="Loading race entries..." />
            ) : entries.length > 0 ? (
              <div className="entries-table-container">
                <table className="entries-table">
                  <thead>
                    <tr>
                      <th>Race</th>
                      <th>Car</th>
                      <th>Grid Position</th>
                      <th>Final Position</th>
                      <th>Upgrades</th>
                      <th>Modifications</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map(entry => (
                      <tr key={entry.entry_id}>
                        <td>
                          <Link to={`/races/${entry.race_id}`}>
                            {entry.race_name} GP
                          </Link>
                        </td>
                        <td>{entry.car_model}</td>
                        <td>{entry.grid_position || '-'}</td>
                        <td>{entry.grid_position_final || '-'}</td>
                        <td>{entry.upgrades_applied || 'None'}</td>
                        <td>{entry.race_modifications || 'None'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No race entries available for this driver</p>
            )}
          </div>
        )}

        {activeTab === 'failures' && (
          <div className="failures-tab">
            <h2>Technical Failures</h2>
            {failuresLoading ? (
              <Loading message="Loading failures data..." />
            ) : failures.length > 0 ? (
              <div className="failures-table-container">
                <table className="failures-table">
                  <thead>
                    <tr>
                      <th>Race</th>
                      <th>Failure Type</th>
                      <th>Description</th>
                      <th>Lap</th>
                      <th>DNF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {failures.map(failure => (
                      <tr key={failure.failure_id}>
                        <td>
                          <Link to={`/races/${failure.entry.race_id}`}>
                            {failure.race_name} GP
                          </Link>
                        </td>
                        <td>{failure.failure_type}</td>
                        <td>{failure.failure_description}</td>
                        <td>{failure.failure_lap || '-'}</td>
                        <td>
                          <span className={`status ${failure.dnf ? 'dnf' : 'completed'}`}>
                            {failure.dnf ? 'Yes' : 'No'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No failures recorded for this driver</p>
            )}
          </div>
        )}

        {activeTab === 'penalties' && (
          <div className="penalties-tab">
            <h2>Penalties</h2>
            {penaltiesLoading ? (
              <Loading message="Loading penalties data..." />
            ) : penalties.length > 0 ? (
              <div className="penalties-table-container">
                <table className="penalties-table">
                  <thead>
                    <tr>
                      <th>Race</th>
                      <th>Penalty Type</th>
                      <th>Reason</th>
                      <th>Time Penalty</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {penalties.map(penalty => (
                      <tr key={penalty.penalty_id}>
                        <td>
                          <Link to={`/races/${penalty.entry.race_id}`}>
                            {penalty.race_name} GP
                          </Link>
                        </td>
                        <td>{penalty.penalty_type}</td>
                        <td>{penalty.penalty_reason}</td>
                        <td>{penalty.time_penalty || '-'}</td>
                        <td>
                          <span className={`status ${penalty.penalty_status.toLowerCase()}`}>
                            {penalty.penalty_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No penalties recorded for this driver</p>
            )}
          </div>
        )}
      </div>

      <div className="back-link">
        <Link to="/drivers">&larr; Back to Drivers</Link>
      </div>

      <style jsx>{`
        .driver-detail-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .driver-header {
          margin-bottom: 20px;
          border-left: 8px solid;
          background-color: #f8f8f8;
          border-radius: 0 8px 8px 0;
          overflow: hidden;
        }
        
        .driver-header-content {
          padding: 25px;
        }
        
        .driver-name {
          margin-top: 0;
          margin-bottom: 5px;
          color: var(--secondary-color);
        }
        
        .driver-team {
          margin-bottom: 20px;
          font-size: 1.1rem;
        }
        
        .team-link {
          color: var(--accent-color);
          text-decoration: none;
        }
        
        .team-link:hover {
          color: var(--primary-color);
          text-decoration: underline;
        }
        
        .driver-stats {
          display: flex;
          gap: 30px;
        }
        
        .driver-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: #666;
        }
        
        .season-filter {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .season-filter label {
          margin-right: 10px;
          font-weight: 500;
        }
        
        .season-select {
          padding: 8px 12px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 14px;
          background-color: white;
          min-width: 150px;
        }
        
        .driver-tabs {
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
        
        .overview-tab {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .driver-info-card,
        .career-stats-card,
        .recent-results {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }
        
        .driver-info-card h2,
        .career-stats-card h2,
        .recent-results h2,
        .results-tab h2,
        .entries-tab h2,
        .failures-tab h2,
        .penalties-tab h2 {
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 1.2rem;
          color: var(--secondary-color);
        }
        
        .driver-info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
        }
        
        .info-label {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 5px;
        }
        
        .info-value {
          font-weight: 500;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
        }
        
        .stat-box {
          background-color: #f5f5f5;
          border-radius: 6px;
          padding: 15px;
          text-align: center;
        }
        
        .box-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 5px;
        }
        
        .box-label {
          font-size: 0.8rem;
          color: #666;
        }
        
        .results-table-container,
        .entries-table-container,
        .failures-table-container,
        .penalties-table-container {
          overflow-x: auto;
        }
        
        .results-table,
        .entries-table,
        .failures-table,
        .penalties-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .results-table th,
        .results-table td,
        .entries-table th,
        .entries-table td,
        .failures-table th,
        .failures-table td,
        .penalties-table th,
        .penalties-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }
        
        .results-table th,
        .entries-table th,
        .failures-table th,
        .penalties-table th {
          background-color: var(--secondary-color);
          color: white;
          font-weight: 500;
        }
        
        .results-table tr:hover,
        .entries-table tr:hover,
        .failures-table tr:hover,
        .penalties-table tr:hover {
          background-color: rgba(0, 0, 0, 0.02);
        }
        
        .position-cell {
          font-weight: 700;
        }
        
        .status {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        
        .status.completed {
          background-color: var(--success-color);
          color: white;
        }
        
        .status.dnf {
          background-color: var(--danger-color);
          color: white;
        }
        
        .status.appealed {
          background-color: var(--warning-color);
          color: white;
        }
        
        .status.overturned {
          background-color: #888;
          color: white;
        }
        
        .status.applied {
          background-color: var(--accent-color);
          color: white;
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
        
        @media (max-width: 768px) {
          .driver-tabs {
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

export default DriverDetail;
