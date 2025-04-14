import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import apiService from '../../services/api';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const RaceDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('results');

  // Fetch race details
  const { data: raceData, isLoading: raceLoading, error: raceError } = useQuery(
    ['race', id],
    () => apiService.getRace(id)
  );

  // Fetch race results
  const { data: resultsData, isLoading: resultsLoading } = useQuery(
    ['raceResults', id],
    () => apiService.getRaceResults(id),
    {
      enabled: !!id && (activeTab === 'results' || activeTab === 'overview')
    }
  );

  // Fetch race entries
  const { data: entriesData, isLoading: entriesLoading } = useQuery(
    ['raceEntries', id],
    () => apiService.getRaceEntries(id),
    {
      enabled: !!id && activeTab === 'grid'
    }
  );

  // Fetch failures
  const { data: failuresData, isLoading: failuresLoading } = useQuery(
    ['raceFailures', id],
    () => apiService.getRaceFailures(id),
    {
      enabled: !!id && activeTab === 'failures'
    }
  );

  // Fetch penalties
  const { data: penaltiesData, isLoading: penaltiesLoading } = useQuery(
    ['racePenalties', id],
    () => apiService.getRacePenalties(id),
    {
      enabled: !!id && activeTab === 'penalties'
    }
  );

  if (raceLoading) {
    return <Loading message="Loading race details..." />;
  }

  if (raceError) {
    return <ErrorMessage message="Failed to load race details." />;
  }

  const race = raceData?.data;
  const results = resultsData?.data?.results || [];
  const entries = entriesData?.data?.results || [];
  const failures = failuresData?.data?.results || [];
  const penalties = penaltiesData?.data?.results || [];

  // Format date to be more readable
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

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

  const weatherIcon = getWeatherIcon(race.weather_condition);
  const isPastRace = new Date(race.date) < new Date();

  return (
    <div className="race-detail-container">
      <div className="race-header">
        <div className="race-header-content">
          <div className="race-meta">
            <span className="race-date">{formatDate(race.date)}</span>
            <span className="race-season">Season {race.season_year}</span>
            <span className="race-weather">
              {weatherIcon} {race.weather_condition || 'Weather data not available'}
            </span>
          </div>
          <h1 className="race-title">{race.location} Grand Prix</h1>
          <div className="race-circuit">
            <Link to={`/circuits/${race.circuit_id}`}>{race.circuit_name}</Link>
          </div>
          <div className="race-stats">
            <div className="race-stat">
              <span className="stat-value">{race.number_of_laps}</span>
              <span className="stat-label">Laps</span>
            </div>
            <div className="race-stat">
              <span className="stat-value">{race.circuit_length}</span>
              <span className="stat-label">KM Per Lap</span>
            </div>
            <div className="race-stat">
              <span className="stat-value">{race.race_distance}</span>
              <span className="stat-label">Total KM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="race-tabs">
        <button 
          className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          Race Results
        </button>
        <button 
          className={`tab-button ${activeTab === 'grid' ? 'active' : ''}`}
          onClick={() => setActiveTab('grid')}
        >
          Starting Grid
        </button>
        <button 
          className={`tab-button ${activeTab === 'failures' ? 'active' : ''}`}
          onClick={() => setActiveTab('failures')}
        >
          Technical Failures
        </button>
        <button 
          className={`tab-button ${activeTab === 'penalties' ? 'active' : ''}`}
          onClick={() => setActiveTab('penalties')}
        >
          Penalties
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'results' && (
          <div className="results-tab">
            <h2>Race Results</h2>
            {!isPastRace ? (
              <div className="upcoming-message">
                <p>This race has not yet taken place. Check back after {formatDate(race.date)} for results.</p>
              </div>
            ) : resultsLoading ? (
              <Loading message="Loading race results..." />
            ) : results.length > 0 ? (
              <div className="results-table-container">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Pos</th>
                      <th>Driver</th>
                      <th>Team</th>
                      <th>Points</th>
                      <th>Status</th>
                      <th>Pit Stops</th>
                      <th>Fastest Lap</th>
                      <th>Overtakes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results
                      .sort((a, b) => {
                        // Sort by position, with DNFs at the end
                        if (a.final_position === null && b.final_position === null) return 0;
                        if (a.final_position === null) return 1;
                        if (b.final_position === null) return -1;
                        return a.final_position - b.final_position;
                      })
                      .map(result => (
                        <tr key={result.result_id}>
                          <td className="position-cell">
                            {result.final_position || '-'}
                          </td>
                          <td>
                            <Link to={`/drivers/${result.driver_id}`}>
                              {result.driver_name}
                            </Link>
                          </td>
                          <td>
                            <Link to={`/teams/${result.team_id}`}>
                              {result.team_name}
                            </Link>
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
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No results available for this race</p>
            )}
          </div>
        )}

        {activeTab === 'grid' && (
          <div className="grid-tab">
            <h2>Starting Grid</h2>
            {entriesLoading ? (
              <Loading message="Loading starting grid..." />
            ) : entries.length > 0 ? (
              <div className="grid-table-container">
                <table className="grid-table">
                  <thead>
                    <tr>
                      <th>Grid Pos</th>
                      <th>Driver</th>
                      <th>Team</th>
                      <th>Car</th>
                      <th>Final Pos</th>
                      <th>Upgrades</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries
                      .sort((a, b) => {
                        // Sort by grid position
                        if (a.grid_position === null && b.grid_position === null) return 0;
                        if (a.grid_position === null) return 1;
                        if (b.grid_position === null) return -1;
                        return a.grid_position - b.grid_position;
                      })
                      .map(entry => (
                        <tr key={entry.entry_id}>
                          <td className="position-cell">
                            {entry.grid_position || '-'}
                          </td>
                          <td>
                            <Link to={`/drivers/${entry.driver_id}`}>
                              {entry.driver_name}
                            </Link>
                          </td>
                          <td>
                            <Link to={`/teams/${entry.team_id}`}>
                              {entry.team_name}
                            </Link>
                          </td>
                          <td>{entry.car_model}</td>
                          <td className="position-cell">
                            {entry.grid_position_final || '-'}
                          </td>
                          <td>{entry.upgrades_applied || 'None'}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No starting grid available for this race</p>
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
                      <th>Driver</th>
                      <th>Team</th>
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
                          <Link to={`/drivers/${failure.driver_id}`}>
                            {failure.driver_name}
                          </Link>
                        </td>
                        <td>
                          <Link to={`/teams/${failure.team_id}`}>
                            {failure.team_name}
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
              <p className="no-data">No technical failures recorded for this race</p>
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
                      <th>Driver</th>
                      <th>Team</th>
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
                          <Link to={`/drivers/${penalty.driver_id}`}>
                            {penalty.driver_name}
                          </Link>
                        </td>
                        <td>
                          <Link to={`/teams/${penalty.team_id}`}>
                            {penalty.team_name}
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
              <p className="no-data">No penalties recorded for this race</p>
            )}
          </div>
        )}
      </div>

      <div className="back-link">
        <Link to="/races">&larr; Back to Races</Link>
      </div>

      <style jsx>{`
        .race-detail-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .race-header {
          margin-bottom: 30px;
          background-color: var(--secondary-color);
          color: white;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .race-header-content {
          padding: 25px;
        }
        
        .race-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 10px;
          font-size: 0.9rem;
        }
        
        .race-date, .race-season, .race-weather {
          display: flex;
          align-items: center;
        }
        
        .race-title {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 2rem;
        }
        
        .race-circuit {
          margin-bottom: 20px;
          font-size: 1.1rem;
        }
        
        .race-circuit a {
          color: var(--light-text-color);
          text-decoration: none;
          border-bottom: 1px dotted rgba(255, 255, 255, 0.5);
        }
        
        .race-circuit a:hover {
          border-bottom-color: white;
        }
        
        .race-stats {
          display: flex;
          gap: 40px;
        }
        
        .race-stat {
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
        
        .race-tabs {
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
        
        .results-tab h2,
        .grid-tab h2,
        .failures-tab h2,
        .penalties-tab h2 {
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 1.2rem;
          color: var(--secondary-color);
        }
        
        .upcoming-message {
          padding: 20px;
          background-color: #f8f8f8;
          border-radius: 8px;
          text-align: center;
          color: var(--text-color);
        }
        
        .results-table-container,
        .grid-table-container,
        .failures-table-container,
        .penalties-table-container {
          overflow-x: auto;
        }
        
        .results-table,
        .grid-table,
        .failures-table,
        .penalties-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .results-table th,
        .results-table td,
        .grid-table th,
        .grid-table td,
        .failures-table th,
        .failures-table td,
        .penalties-table th,
        .penalties-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }
        
        .results-table th,
        .grid-table th,
        .failures-table th,
        .penalties-table th {
          background-color: var(--secondary-color);
          color: white;
          font-weight: 500;
        }
        
        .results-table tr:hover,
        .grid-table tr:hover,
        .failures-table tr:hover,
        .penalties-table tr:hover {
          background-color: rgba(0, 0, 0, 0.02);
        }
        
        .position-cell {
          font-weight: 700;
          text-align: center;
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
          .race-meta {
            flex-direction: column;
            gap: 5px;
          }
          
          .race-stats {
            flex-wrap: wrap;
            gap: 20px;
          }
          
          .race-tabs {
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

export default RaceDetail;
