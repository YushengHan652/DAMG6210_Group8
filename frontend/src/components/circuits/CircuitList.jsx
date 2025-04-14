import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const CircuitList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [typeFilter, setTypeFilter] = useState('');

  // Fetch circuits data
  const { data: circuitsData, isLoading, error, refetch } = useQuery(
    ['circuits', { sort: sortBy, type: typeFilter }],
    () => apiService.getCircuits({ 
      ordering: sortBy,
      type: typeFilter || undefined
    }),
    {
      keepPreviousData: true,
    }
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
  };

  // Filter circuits based on search term
  const filteredCircuits = circuitsData?.data.results
    ? circuitsData.data.results.filter(circuit => 
        circuit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        circuit.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Circuit types for filter
  const circuitTypes = [
    { value: 'Street', label: 'Street Circuit' },
    { value: 'Permanent', label: 'Permanent Circuit' },
    { value: 'Temporary', label: 'Temporary Circuit' },
    { value: 'Oval', label: 'Oval Circuit' },
  ];

  return (
    <div className="circuit-list-container">
      <div className="page-header">
        <h1 className="page-title">Formula 1 Circuits</h1>
        <p className="page-description">
          Explore all Formula 1 race circuits around the world
        </p>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search circuits by name or country..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="filter-options">
          <div className="filter-option">
            <label htmlFor="type-select">Circuit Type:</label>
            <select
              id="type-select"
              value={typeFilter}
              onChange={handleTypeFilterChange}
              className="filter-select"
            >
              <option value="">All Types</option>
              {circuitTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-option">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={handleSortChange}
              className="filter-select"
            >
              <option value="name">Name</option>
              <option value="country">Country</option>
              <option value="-length_circuit">Length (Descending)</option>
              <option value="-number_of_turns">Turns (Descending)</option>
              <option value="-seating_capacity">Capacity (Descending)</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Loading message="Loading circuits..." />
      ) : error ? (
        <ErrorMessage 
          message="Failed to load circuits. Please try again." 
          onRetry={refetch}
        />
      ) : (
        <div className="circuits-grid">
          {filteredCircuits.length > 0 ? (
            filteredCircuits.map(circuit => (
              <div key={circuit.circuit_id} className="circuit-card">
                <div className="circuit-header">
                  <div className="circuit-country">{circuit.country}</div>
                  <div className="circuit-type">{circuit.type || 'Unknown Type'}</div>
                </div>
                <div className="circuit-content">
                  <h3 className="circuit-name">
                    <Link to={`/circuits/${circuit.circuit_id}`}>{circuit.name}</Link>
                  </h3>
                  
                  <div className="circuit-stats">
                    <div className="stat-item">
                      <span className="stat-value">{circuit.length_circuit}</span>
                      <span className="stat-label">KM</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{circuit.number_of_turns}</span>
                      <span className="stat-label">Turns</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{circuit.drs_zones || 0}</span>
                      <span className="stat-label">DRS Zones</span>
                    </div>
                  </div>
                  
                  <div className="circuit-details">
                    {circuit.seating_capacity && (
                      <div className="circuit-detail">
                        <span className="detail-label">Capacity:</span>
                        <span className="detail-value">
                          {circuit.seating_capacity.toLocaleString()} spectators
                        </span>
                      </div>
                    )}
                    
                    {circuit.lap_record_time && (
                      <div className="circuit-detail">
                        <span className="detail-label">Lap Record:</span>
                        <span className="detail-value">{circuit.lap_record_time}s</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="circuit-footer">
                  <Link to={`/circuits/${circuit.circuit_id}`} className="view-circuit-btn">
                    View Circuit
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No circuits match your search criteria</p>
          )}
        </div>
      )}

      <style jsx>{`
        .page-header {
          margin-bottom: 30px;
        }
        
        .page-title {
          color: var(--secondary-color);
          margin-bottom: 10px;
        }
        
        .page-description {
          color: var(--text-color);
        }
        
        .filters {
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 8px;
        }
        
        .search-box {
          margin-bottom: 15px;
        }
        
        .search-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 14px;
        }
        
        .filter-options {
          display: flex;
          gap: 15px;
        }
        
        .filter-option {
          display: flex;
          align-items: center;
        }
        
        .filter-option label {
          margin-right: 10px;
          font-size: 14px;
        }
        
        .filter-select {
          padding: 8px 12px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 14px;
          background-color: white;
          min-width: 150px;
        }
        
        .circuits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .circuit-card {
          display: flex;
          flex-direction: column;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .circuit-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
        
        .circuit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 15px;
          background-color: var(--secondary-color);
          color: white;
        }
        
        .circuit-country {
          font-weight: 500;
        }
        
        .circuit-type {
          font-size: 0.8rem;
          background-color: rgba(255, 255, 255, 0.2);
          padding: 3px 8px;
          border-radius: 4px;
        }
        
        .circuit-content {
          padding: 15px;
          flex: 1;
        }
        
        .circuit-name {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 1.25rem;
        }
        
        .circuit-name a {
          color: var(--text-color);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        .circuit-name a:hover {
          color: var(--primary-color);
        }
        
        .circuit-stats {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .stat-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary-color);
        }
        
        .stat-label {
          font-size: 0.8rem;
          color: #666;
        }
        
        .circuit-details {
          margin-bottom: 15px;
        }
        
        .circuit-detail {
          margin-bottom: 5px;
          font-size: 0.9rem;
        }
        
        .detail-label {
          font-weight: 500;
          color: #666;
          margin-right: 5px;
        }
        
        .circuit-footer {
          padding: 15px;
          background-color: #f5f5f5;
          text-align: center;
          border-top: 1px solid var(--border-color);
        }
        
        .view-circuit-btn {
          display: inline-block;
          padding: 8px 16px;
          background-color: var(--secondary-color);
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-size: 0.9rem;
          transition: background-color 0.2s ease;
        }
        
        .view-circuit-btn:hover {
          background-color: var(--primary-color);
          color: white;
        }
        
        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px;
          color: var(--text-color);
          font-style: italic;
          background-color: #f9f9f9;
          border-radius: 8px;
        }
        
        @media (max-width: 768px) {
          .filter-options {
            flex-direction: column;
            gap: 10px;
          }
          
          .filter-option {
            width: 100%;
          }
          
          .filter-select {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default CircuitList;
