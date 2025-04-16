import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import TeamCard from './TeamCard';

const TeamList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('team_name');

  // Fetch teams data
  const { data, isLoading, error, refetch } = useQuery(
    ['teams', { sort: sortBy }],
    () => apiService.getTeams({ ordering: sortBy }),
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

  // Filter teams based on search term
  const filteredTeams = data?.data.results
    ? data.data.results.filter(team => 
        team.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.team_country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (team.team_principal && team.team_principal.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  return (
    <div className="team-list-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Formula 1 Teams</h1>
          <Link to="/teams/new" className="add-new-btn">Add New Team</Link>
        </div>
        <p className="page-description">
          View all Formula 1 teams competing in the championship
        </p>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search teams..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="sort-box">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="team_name">Team Name</option>
            <option value="-championships_won">Championships</option>
            <option value="team_country">Country</option>
            <option value="founded_year">Founded Year</option>
            <option value="-budget">Budget</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <Loading message="Loading teams..." />
      ) : error ? (
        <ErrorMessage 
          message="Failed to load teams. Please try again." 
          onRetry={refetch}
        />
      ) : (
        <div className="teams-grid">
          {filteredTeams.length > 0 ? (
            filteredTeams.map(team => (
              <TeamCard key={team.team_id} team={team} />
            ))
          ) : (
            <p className="no-results">No teams match your search criteria</p>
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
          margin-bottom: 10px;
        }
        
        .page-title {
          color: var(--secondary-color);
          margin: 0;
        }
        
        .add-new-btn {
          padding: 8px 16px;
          background-color: var(--primary-color);
          color: white;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
        }
        
        .page-description {
          color: var(--text-color);
        }
        
        .filters {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 8px;
        }
        
        .search-box {
          flex: 1;
          margin-right: 20px;
        }
        
        .search-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 14px;
        }
        
        .sort-box {
          display: flex;
          align-items: center;
        }
        
        .sort-box label {
          margin-right: 10px;
          font-size: 14px;
        }
        
        .sort-select {
          padding: 8px 12px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 14px;
          background-color: white;
        }
        
        .teams-grid {
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
          .filters {
            flex-direction: column;
          }
          
          .search-box {
            margin-right: 0;
            margin-bottom: 10px;
          }
          
          .teams-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default TeamList;
