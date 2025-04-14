import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import apiService from '../../services/api';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import RaceCard from './RaceCard';

const RaceList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [seasonFilter, setSeasonFilter] = useState('');
  const [weatherFilter, setWeatherFilter] = useState('');

  // Fetch races data
  const { data: racesData, isLoading: racesLoading, error: racesError, refetch } = useQuery(
    ['races', { sort: sortBy, season: seasonFilter, weather: weatherFilter }],
    () => apiService.getRaces({ 
      ordering: sortBy,
      season: seasonFilter || undefined,
      weather_condition: weatherFilter || undefined
    }),
    {
      keepPreviousData: true,
    }
  );

  // Fetch seasons for filter dropdown
  const { data: seasonsData } = useQuery(
    'seasons',
    () => apiService.getSeasons(),
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

  const handleSeasonFilterChange = (e) => {
    setSeasonFilter(e.target.value);
  };

  const handleWeatherFilterChange = (e) => {
    setWeatherFilter(e.target.value);
  };

  // Filter races based on search term
  const filteredRaces = racesData?.data.results
    ? racesData.data.results.filter(race => 
        race.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        race.circuit_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const seasons = seasonsData?.data.results || [];
  
  // Get unique weather conditions for filter
  const weatherConditions = new Set();
  if (racesData?.data.results) {
    racesData.data.results.forEach(race => {
      if (race.weather_condition) {
        weatherConditions.add(race.weather_condition);
      }
    });
  }

  // Helper function to check if a race is in the past
  const isPastRace = (raceDate) => {
    return new Date(raceDate) < new Date();
  };

  return (
    <div className="race-list-container">
      <div className="page-header">
        <h1 className="page-title">Formula 1 Races</h1>
        <p className="page-description">
          View all Formula 1 races in the championship calendar
        </p>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search races..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="filter-options">
          <div className="filter-option">
            <label htmlFor="season-select">Season:</label>
            <select
              id="season-select"
              value={seasonFilter}
              onChange={handleSeasonFilterChange}
              className="filter-select"
            >
              <option value="">All Seasons</option>
              {seasons.map(season => (
                <option key={season.season_id} value={season.season_id}>
                  {season.year} Season
                </option>
              ))}
            </select>
          </div>

          <div className="filter-option">
            <label htmlFor="weather-select">Weather:</label>
            <select
              id="weather-select"
              value={weatherFilter}
              onChange={handleWeatherFilterChange}
              className="filter-select"
            >
              <option value="">All Weather</option>
              {Array.from(weatherConditions).map(weather => (
                <option key={weather} value={weather}>
                  {weather}
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
              <option value="date">Date (Ascending)</option>
              <option value="-date">Date (Descending)</option>
              <option value="location">Location</option>
              <option value="circuit__name">Circuit</option>
              <option value="number_of_laps">Laps</option>
            </select>
          </div>
        </div>
      </div>

      {racesLoading ? (
        <Loading message="Loading races..." />
      ) : racesError ? (
        <ErrorMessage 
          message="Failed to load races. Please try again." 
          onRetry={refetch}
        />
      ) : (
        <>
          {filteredRaces.length > 0 && isPastRace(filteredRaces[0].date) && (
            <div className="race-section">
              <h2 className="section-title">Recent Races</h2>
              <div className="races-grid">
                {filteredRaces
                  .filter(race => isPastRace(race.date))
                  .map(race => (
                    <RaceCard key={race.race_id} race={race} isPast={true} />
                  ))}
              </div>
            </div>
          )}

          {filteredRaces.length > 0 && !isPastRace(filteredRaces[filteredRaces.length - 1].date) && (
            <div className="race-section">
              <h2 className="section-title">Upcoming Races</h2>
              <div className="races-grid">
                {filteredRaces
                  .filter(race => !isPastRace(race.date))
                  .map(race => (
                    <RaceCard key={race.race_id} race={race} isPast={false} />
                  ))}
              </div>
            </div>
          )}

          {filteredRaces.length === 0 && (
            <p className="no-results">No races match your search criteria</p>
          )}
        </>
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
        
        .race-section {
          margin-bottom: 30px;
        }
        
        .section-title {
          font-size: 1.25rem;
          color: var(--secondary-color);
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .races-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .no-results {
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

export default RaceList;
