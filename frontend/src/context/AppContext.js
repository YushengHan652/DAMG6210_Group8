import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

// Create context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

// Provider component
export const AppProvider = ({ children }) => {
  // State
  const [currentSeason, setCurrentSeason] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSeasonDriverStandings, setCurrentSeasonDriverStandings] = useState([]);
  const [currentSeasonTeamStandings, setCurrentSeasonTeamStandings] = useState([]);

  // Fetch current season on mount
  useEffect(() => {
    const fetchCurrentSeason = async () => {
      try {
        setLoading(true);
        const response = await apiService.getSeasons();
        // Assuming seasons are returned in descending order by year
        const latestSeason = response.data.results[0];
        setCurrentSeason(latestSeason);
        
        if (latestSeason) {
          // Fetch driver standings for current season
          const driverStandingsResponse = await apiService.getSeasonStandings(
            latestSeason.season_id,
            'Driver'
          );
          setCurrentSeasonDriverStandings(driverStandingsResponse.data.results);
          
          // Fetch team standings for current season
          const teamStandingsResponse = await apiService.getSeasonStandings(
            latestSeason.season_id,
            'Team'
          );
          setCurrentSeasonTeamStandings(teamStandingsResponse.data.results);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching current season:', err);
        setError('Failed to load current season data');
        setLoading(false);
      }
    };

    fetchCurrentSeason();
  }, []);

  // Value to be provided by the context
  const contextValue = {
    currentSeason,
    currentSeasonDriverStandings,
    currentSeasonTeamStandings,
    loading,
    error,
    setCurrentSeason,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;