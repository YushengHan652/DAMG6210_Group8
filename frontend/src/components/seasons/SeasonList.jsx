import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const SeasonList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch seasons data
  const { data: seasonsData, isLoading, error, refetch } = useQuery(
    'seasons',
    () => apiService.getSeasons(),
    {
      staleTime: 60 * 60 * 1000, // 1 hour
    }
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter seasons based on search term
  const filteredSeasons = seasonsData?.data.results
    ? seasonsData.data.results
        .filter(season => 
          season.year.toString().includes(searchTerm) ||
          (season.title_sponsor && season.title_sponsor.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => b.year - a.year) // Sort by year (descending)
    : [];

  return (
    <div className="season-list-container">
      <div className="page-header">
        <h1 className="page-title">Formula 1 Seasons</h1>
        <p className="page-description">
          Browse through the history of Formula 1 championships
        </p>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search seasons by year or sponsor..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {isLoading ? (
        <Loading message="Loading seasons..." />
      ) : error ? (
        <ErrorMessage 
          message="Failed to load seasons. Please try again." 
          onRetry={refetch}
        />
      ) : (
        <div className="seasons-grid">
          {filteredSeasons.length > 0 ? (
            filteredSeasons.map(season => (
              <div key={season.season_id} className="season-card">
                <div className="season-year">{season.year}</div>
                <div className="season-content">
                  <h3 className="season-title">
                    <Link to={`/seasons/${season.season_id}`}>
                      {season.year} Formula 1 Season
                    </Link>
                  </h3>
                  
                  <div className="season-sponsor">
                    {season.title_sponsor ? (
                      <span>Sponsored by {season.title_sponsor}</span>
                    ) : (
                      <span>No title sponsor</span>
                    )}
                  </div>
                  
                  <div className="season-details">
                    <div className="season-detail">
                      <span className="detail-label">Races:</span>
                      <span className="detail-value">{season.number_of_races}</span>
                    </div>
                    
                    <div className="season-detail">
                      <span className="detail-label">Driver Champion:</span>
                      <span className="detail-value">
                        {season.champion_driver_name || 'TBD'}
                      </span>
                    </div>
                    
                    <div className="season-detail">
                      <span className="detail-label">Constructor Champion:</span>
                      <span className="detail-value">
                        {season.champion_team_name || 'TBD'}
                      </span>
                    </div>
                    
                    <div className="season-detail">
                      <span className="detail-label">Prize Money:</span>
                      <span className="detail-value">
                        {season.prize_money_awarded 
                          ? `$${(season.prize_money_awarded / 1000000).toFixed(0)}M` 
                          : 'Not disclosed'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="season-actions">
                    <Link to={`/seasons/${season.season_id}`} className="view-season-btn">
                      View Season
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No seasons match your search criteria</p>
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
        
        .search-box {
          margin-bottom: 20px;
        }
        
        .search-input {
          width: 100%;
          padding: 10px 15px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 1rem;
        }
        
        .seasons-grid {
          display: grid;
          gap: 20px;
        }
        
        .season-card {
          display: flex;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .season-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
        
        .season-year {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 120px;
          background-color: var(--primary-color);
          color: white;
          font-size: 2rem;
          font-weight: 700;
        }
        
        .season-content {
          flex: 1;
          padding: 20px;
        }
        
        .season-title {
          margin-top: 0;
          margin-bottom: 5px;
        }
        
        .season-title a {
          color: var(--secondary-color);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        .season-title a:hover {
          color: var(--primary-color);
        }
        
        .season-sponsor {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 15px;
        }
        
        .season-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 20px;
          margin-bottom: 20px;
        }
        
        .season-detail {
          display: flex;
          flex-direction: column;
        }
        
        .detail-label {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 3px;
        }
        
        .detail-value {
          font-weight: 500;
        }
        
        .season-actions {
          display: flex;
          justify-content: flex-end;
        }
        
        .view-season-btn {
          padding: 8px 16px;
          background-color: var(--secondary-color);
          color: white;
          border-radius: 4px;
          text-decoration: none;
          font-size: 0.9rem;
          transition: background-color 0.2s ease;
        }
        
        .view-season-btn:hover {
          background-color: var(--primary-color);
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
          .season-card {
            flex-direction: column;
          }
          
          .season-year {
            width: 100%;
            padding: 10px;
          }
          
          .season-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default SeasonList;
