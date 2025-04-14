import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import apiService from '../../services/api';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const CircuitDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch circuit details
  const { data: circuitData, isLoading: circuitLoading, error: circuitError } = useQuery(
    ['circuit', id],
    () => apiService.getCircuit(id)
  );

  // Fetch races at this circuit
  const { data: racesData, isLoading: racesLoading } = useQuery(
    ['circuitRaces', id],
    () => apiService.getCircuitRaces(id),
    {
      enabled: !!id
    }
  );

  if (circuitLoading) {
    return <Loading message="Loading circuit details..." />;
  }

  if (circuitError) {
    return <ErrorMessage message="Failed to load circuit details." />;
  }

  const circuit = circuitData?.data;
  const races = racesData?.data?.results || [];

  // Sort races by date (descending)
  const sortedRaces = [...races].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Format date for display
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  // Calculate some statistics
  const mostRecentRace = sortedRaces[0];
  const upcomingRaces = sortedRaces.filter(race => new Date(race.date) > new Date());
  
  // Get circuit type label
  const getCircuitTypeLabel = (type) => {
    if (!type) return 'Unknown Type';
    
    const types = {
      'Street': 'Street Circuit',
      'Permanent': 'Permanent Circuit',
      'Temporary': 'Temporary Circuit',
      'Oval': 'Oval Circuit'
    };
    
    return types[type] || type;
  };

  return (
    <div className="circuit-detail-container">
      <div className="circuit-header">
        <div className="circuit-header-content">
          <div className="circuit-meta">
            <span className="circuit-country">{circuit.country}</span>
            <span className="circuit-type">{getCircuitTypeLabel(circuit.type)}</span>
          </div>
          <h1 className="circuit-name">{circuit.name}</h1>
          <div className="circuit-stats">
            <div className="circuit-stat">
              <span className="stat-value">{circuit.length_circuit}</span>
              <span className="stat-label">KM Length</span>
            </div>
            <div className="circuit-stat">
              <span className="stat-value">{circuit.number_of_turns}</span>
              <span className="stat-label">Turns</span>
            </div>
            <div className="circuit-stat">
              <span className="stat-value">{circuit.drs_zones || 0}</span>
              <span className="stat-label">DRS Zones</span>
            </div>
            {circuit.seating_capacity && (
              <div className="circuit-stat">
                <span className="stat-value">{(circuit.seating_capacity / 1000).toFixed(0)}K</span>
                <span className="stat-label">Capacity</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="circuit-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'races' ? 'active' : ''}`}
          onClick={() => setActiveTab('races')}
        >
          Race History
        </button>
        <button 
          className={`tab-button ${activeTab === 'records' ? 'active' : ''}`}
          onClick={() => setActiveTab('records')}
        >
          Circuit Records
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="circuit-overview-grid">
              <div className="circuit-info-card card">
                <div className="card-header">
                  <h3>Circuit Information</h3>
                </div>
                <div className="card-body">
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Name</span>
                      <span className="info-value">{circuit.name}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Country</span>
                      <span className="info-value">{circuit.country}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Circuit Type</span>
                      <span className="info-value">{getCircuitTypeLabel(circuit.type)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Length</span>
                      <span className="info-value">{circuit.length_circuit} km</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Number of Turns</span>
                      <span className="info-value">{circuit.number_of_turns}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">DRS Zones</span>
                      <span className="info-value">{circuit.drs_zones || 0}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Lap Record</span>
                      <span className="info-value">
                        {circuit.lap_record_time ? `${circuit.lap_record_time}s` : 'No record set'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Seating Capacity</span>
                      <span className="info-value">
                        {circuit.seating_capacity 
                          ? circuit.seating_capacity.toLocaleString() + ' spectators' 
                          : 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="circuit-races-summary card">
                <div className="card-header">
                  <h3>Race Summary</h3>
                </div>
                <div className="card-body">
                  {racesLoading ? (
                    <Loading message="Loading races..." />
                  ) : races.length > 0 ? (
                    <div className="races-summary">
                      <div className="races-stat-grid">
                        <div className="races-stat">
                          <span className="stat-value">{races.length}</span>
                          <span className="stat-label">Total Races</span>
                        </div>
                        <div className="races-stat">
                          <span className="stat-value">
                            {mostRecentRace 
                              ? formatDate(mostRecentRace.date).split(' ')[0] 
                              : 'N/A'}
                          </span>
                          <span className="stat-label">Last Race</span>
                        </div>
                        <div className="races-stat">
                          <span className="stat-value">{upcomingRaces.length}</span>
                          <span className="stat-label">Upcoming Races</span>
                        </div>
                      </div>
                      
                      {mostRecentRace && (
                        <div className="latest-race">
                          <h4>Most Recent Race</h4>
                          <div className="race-card">
                            <div className="race-date">{formatDate(mostRecentRace.date)}</div>
                            <div className="race-title">
                              <Link to={`/races/${mostRecentRace.race_id}`}>
                                {mostRecentRace.location} Grand Prix {mostRecentRace.season_year}
                              </Link>
                            </div>
                            <div className="race-details">
                              <div className="race-detail">
                                <span className="detail-label">Laps:</span>
                                <span className="detail-value">{mostRecentRace.number_of_laps}</span>
                              </div>
                              <div className="race-detail">
                                <span className="detail-label">Distance:</span>
                                <span className="detail-value">{mostRecentRace.race_distance} km</span>
                              </div>
                              <div className="race-detail">
                                <span className="detail-label">Weather:</span>
                                <span className="detail-value">{mostRecentRace.weather_condition || 'Not recorded'}</span>
                              </div>
                            </div>
                            <Link to={`/races/${mostRecentRace.race_id}`} className="view-race-link">
                              View Race Details
                            </Link>
                          </div>
                        </div>
                      )}
                      
                      {upcomingRaces.length > 0 && (
                        <div className="upcoming-race">
                          <h4>Next Race at this Circuit</h4>
                          <div className="race-card">
                            <div className="race-date">{formatDate(upcomingRaces[upcomingRaces.length - 1].date)}</div>
                            <div className="race-title">
                              <Link to={`/races/${upcomingRaces[upcomingRaces.length - 1].race_id}`}>
                                {upcomingRaces[upcomingRaces.length - 1].location} Grand Prix {upcomingRaces[upcomingRaces.length - 1].season_year}
                              </Link>
                            </div>
                            <Link to={`/races/${upcomingRaces[upcomingRaces.length - 1].race_id}`} className="view-race-link">
                              View Race Details
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="no-data">No races have been held at this circuit</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'races' && (
          <div className="races-tab">
            <h2>Race History at {circuit.name}</h2>
            {racesLoading ? (
              <Loading message="Loading race history..." />
            ) : races.length > 0 ? (
              <div className="races-table-container">
                <table className="races-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Grand Prix</th>
                      <th>Season</th>
                      <th>Winner</th>
                      <th>Laps</th>
                      <th>Weather</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRaces.map(race => (
                      <tr key={race.race_id}>
                        <td>{formatDate(race.date)}</td>
                        <td>
                          <Link to={`/races/${race.race_id}`}>
                            {race.location} Grand Prix
                          </Link>
                        </td>
                        <td>
                          <Link to={`/seasons/${race.season_id}`}>
                            {race.season_year}
                          </Link>
                        </td>
                        <td>{race.winner_name || 'Not completed'}</td>
                        <td>{race.number_of_laps}</td>
                        <td>{race.weather_condition || 'Not recorded'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No races have been held at this circuit</p>
            )}
          </div>
        )}

        {activeTab === 'records' && (
          <div className="records-tab">
            <h2>Circuit Records</h2>
            <div className="records-card card">
              <div className="card-header">
                <h3>Performance Records</h3>
              </div>
              <div className="card-body">
                <div className="records-grid">
                  <div className="record-item">
                    <span className="record-name">Lap Record</span>
                    <span className="record-value">
                      {circuit.lap_record_time 
                        ? `${circuit.lap_record_time}s` 
                        : 'No record set'}
                    </span>
                  </div>
                  
                  {/* We would add more records here if available in the API */}
                  <div className="record-item">
                    <span className="record-name">Most Wins</span>
                    <span className="record-value">Data not available</span>
                  </div>
                  
                  <div className="record-item">
                    <span className="record-name">Most Pole Positions</span>
                    <span className="record-value">Data not available</span>
                  </div>
                  
                  <div className="record-item">
                    <span className="record-name">Highest Average Speed</span>
                    <span className="record-value">Data not available</span>
                  </div>
                </div>
                
                <div className="records-note">
                  <p>Note: Limited record data is available for this circuit.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="back-link">
        <Link to="/circuits">&larr; Back to Circuits</Link>
      </div>

      <style jsx>{`
        .circuit-detail-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .circuit-header {
          margin-bottom: 30px;
          background-color: var(--secondary-color);
          color: white;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .circuit-header-content {
          padding: 25px;
        }
        
        .circuit-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 0.9rem;
        }
        
        .circuit-type {
          background-color: rgba(255, 255, 255, 0.2);
          padding: 3px 8px;
          border-radius: 4px;
        }
        
        .circuit-name {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 2rem;
        }
        
        .circuit-stats {
          display: flex;
          gap: 40px;
        }
        
        .circuit-stat {
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
        
        .circuit-tabs {
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
        
        .circuit-overview-grid {
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
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
        
        .races-stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .races-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 8px;
        }
        
        .races-stat .stat-value {
          color: var(--primary-color);
        }
        
        .races-stat .stat-label {
          color: #666;
        }
        
        .latest-race,
        .upcoming-race {
          margin-bottom: 20px;
        }
        
        .latest-race h4,
        .upcoming-race h4 {
          margin-top: 0;
          margin-bottom: 10px;
          color: var(--secondary-color);
        }
        
        .race-card {
          padding: 15px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
        }
        
        .race-date {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 5px;
        }
        
        .race-title {
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 10px;
        }
        
        .race-title a {
          color: var(--text-color);
          text-decoration: none;
        }
        
        .race-title a:hover {
          color: var(--primary-color);
        }
        
        .race-details {
          margin-bottom: 15px;
        }
        
        .race-detail {
          font-size: 0.9rem;
          margin-bottom: 5px;
        }
        
        .detail-label {
          font-weight: 500;
          color: #666;
          margin-right: 5px;
        }
        
        .view-race-link {
          display: inline-block;
          padding: 6px 12px;
          background-color: var(--secondary-color);
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-size: 0.9rem;
          transition: background-color 0.2s ease;
        }
        
        .view-race-link:hover {
          background-color: var(--primary-color);
          color: white;
        }
        
        .races-tab h2,
        .records-tab h2 {
          margin-top: 0;
          margin-bottom: 20px;
          color: var(--secondary-color);
        }
        
        .races-table-container {
          overflow-x: auto;
        }
        
        .races-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .races-table th,
        .races-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }
        
        .races-table th {
          background-color: var(--secondary-color);
          color: white;
          font-weight: 500;
        }
        
        .records-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .record-item {
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 8px;
          text-align: center;
        }
        
        .record-name {
          display: block;
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 5px;
        }
        
        .record-value {
          display: block;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--primary-color);
        }
        
        .records-note {
          font-size: 0.9rem;
          color: #666;
          font-style: italic;
          text-align: center;
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
          .circuit-overview-grid {
            grid-template-columns: 1fr;
          }
          
          .races-stat-grid {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .circuit-stats {
            flex-wrap: wrap;
            gap: 20px;
          }
          
          .circuit-tabs {
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

export default CircuitDetail;
