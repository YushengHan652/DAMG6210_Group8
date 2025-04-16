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
        console.log('Fetching seasons...');
        const response = await apiService.getSeasons();
        console.log('Seasons response:', response);
        
        // Get the latest season from the results array
        const latestSeason = response.data?.results?.[0] || null;
        console.log('Latest season:', latestSeason);
        setCurrentSeason(latestSeason);
        
        if (latestSeason?.season_id) {
          // Fetch driver standings for current season
          console.log('Fetching driver standings...');
          const driverStandingsResponse = await apiService.getSeasonStandings(
            latestSeason.season_id,
            'Driver'
          );
          console.log('Driver standings response:', driverStandingsResponse);
          // Handle single standing response
          const driverStandings = driverStandingsResponse.data ? [driverStandingsResponse.data] : [];
          setCurrentSeasonDriverStandings(driverStandings);
          
          // Fetch team standings for current season
          console.log('Fetching team standings...');
          const teamStandingsResponse = await apiService.getSeasonStandings(
            latestSeason.season_id,
            'Team'
          );
          console.log('Team standings response:', teamStandingsResponse);
          // Handle single standing response
          const teamStandings = teamStandingsResponse.data ? [teamStandingsResponse.data] : [];
          setCurrentSeasonTeamStandings(teamStandings);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching current season:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response,
          request: err.request
        });
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