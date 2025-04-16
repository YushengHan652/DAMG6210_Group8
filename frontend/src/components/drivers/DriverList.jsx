import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import DriverCard from './DriverCard';

const DriverList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [teamFilter, setTeamFilter] = useState('');

  // Fetch drivers data
  const { data: driversData, isLoading: driversLoading, error: driversError, refetch } = useQuery(
    ['drivers', { sort: sortBy, team: teamFilter }],
    () => apiService.getDrivers({ 
      ordering: sortBy,
      team: teamFilter || undefined 
    }),
    {
      keepPreviousData: true,
    }
  );

  // Fetch teams for filter dropdown
  const { data: teamsData } = useQuery(
    'teams',
    () => apiService.getTeams(),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleTeamFilterChange = (e) => {
    setTeamFilter(e.target.value);
  };

  // Filter drivers based on search term
  const filteredDrivers = driversData?.data.results
    ? driversData.data.results.filter(driver => 
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.team_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const teams = teamsData?.data.results || [];

  return (
    <div className="driver-list-container">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1 className="page-title">Formula 1 Drivers</h1>
            <p className="page-description">
              View all Formula 1 drivers competing in the championship
            </p>
          </div>
          <Link to="/drivers/new" className="add-driver-btn">
            Add New Driver
          </Link>
        </div>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search drivers..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="filter-options">
          <div className="filter-option">
            <label htmlFor="team-select">Team:</label>
            <select
              id="team-select"
              value={teamFilter}
              onChange={handleTeamFilterChange}
              className="filter-select"
            >
              <option value="">All Teams</option>
              {teams.map(team => (
                <option key={team.team_id} value={team.team_id}>
                  {team.team_name}
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
              <option value="-number_of_wins">Wins</option>
              <option value="-pole_positions">Pole Positions</option>
              <option value="-fastest_laps">Fastest Laps</option>
              <option value="nationality">Nationality</option>
              <option value="age">Age</option>
            </select>
          </div>
        </div>
      </div>

      {driversLoading ? (
        <Loading message="Loading drivers..." />
      ) : driversError ? (
        <ErrorMessage 
          message="Failed to load drivers. Please try again." 
          onRetry={refetch}
        />
      ) : (
        <div className="drivers-grid">
          {filteredDrivers.length > 0 ? (
            filteredDrivers.map(driver => (
              <DriverCard key={driver.driver_id} driver={driver} />
            ))
          ) : (
            <p className="no-results">No drivers match your search criteria</p>
          )}
        </div>
      )}

      <style jsx>{`
        .page-header {
          margin-bottom: 30px;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .page-title {
          color: var(--secondary-color);
          margin-bottom: 10px;
        }
        
        .page-description {
          color: var(--text-color);
        }
        
        .add-driver-btn {
          background-color: var(--primary-color);
          color: white;
          padding: 10px 20px;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        
        .add-driver-btn:hover {
          background-color: var(--primary-color-dark);
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
        
        .drivers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px;
          color: var(--text-color);
          font-style: italic;
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

export default DriverList;
