import React from 'react';
import { useQuery } from 'react-query';
import apiService from '../../services/api';
import { useAppContext } from '../../context/AppContext';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import StandingsWidget from './StandingsWidget';
import RecentRacesWidget from './RecentRacesWidget';

const Dashboard = () => {
  const { currentSeason, currentSeasonDriverStandings, currentSeasonTeamStandings, loading, error } = useAppContext();

  // Fetch races for the current season
  const { data: racesData, isLoading: racesLoading, error: racesError } = useQuery(
    ['races', currentSeason?.season_id],
    () => apiService.getSeasonRaces(currentSeason?.season_id),
    {
      enabled: !!currentSeason,
      select: (response) => {
        const races = Array.isArray(response.data) ? response.data : [];
        const today = new Date();
        
        // Filter races into upcoming and past
        const upcoming = races
          .filter(race => new Date(race.date) > today)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 5);
          
        const recent = races
          .filter(race => new Date(race.date) <= today)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
          
        return { upcoming, recent };
      }
    }
  );

  if (loading) {
    return <Loading message="Loading dashboard data..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!currentSeason) {
    return <ErrorMessage message="No season data available." />;
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">F1 Dashboard</h1>
      
      {currentSeason && (
        <div className="season-header">
          <h2>{currentSeason.year} Formula 1 Season</h2>
          <p>{currentSeason.number_of_races} races • 
             Championship Leader: {currentSeason.champion_driver_name || 'TBD'} • 
             Team Leader: {currentSeason.champion_team_name || 'TBD'}</p>
        </div>
      )}
      
      <div className="dashboard-grid">
        <div className="dashboard-column">
          <div className="card">
            <div className="card-header">
              <h3>Driver Standings</h3>
            </div>
            <div className="card-body">
              {racesLoading ? (
                <Loading message="Loading standings..." />
              ) : racesError ? (
                <ErrorMessage message="Failed to load driver standings." />
              ) : (
                <StandingsWidget 
                  standings={currentSeasonDriverStandings} 
                  type="Driver" 
                />
              )}
            </div>
          </div>
          
          <div className="card mt-4">
            <div className="card-header">
              <h3>Team Standings</h3>
            </div>
            <div className="card-body">
              {racesLoading ? (
                <Loading message="Loading standings..." />
              ) : racesError ? (
                <ErrorMessage message="Failed to load team standings." />
              ) : (
                <StandingsWidget 
                  standings={currentSeasonTeamStandings} 
                  type="Team" 
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="dashboard-column">
          <div className="card">
            <div className="card-header">
              <h3>Upcoming Races</h3>
            </div>
            <div className="card-body">
              {racesLoading ? (
                <Loading message="Loading races..." />
              ) : racesError ? (
                <ErrorMessage message="Failed to load upcoming races." />
              ) : racesData?.upcoming?.length > 0 ? (
                <RecentRacesWidget races={racesData.upcoming} type="upcoming" />
              ) : (
                <p className="no-data">No upcoming races scheduled</p>
              )}
            </div>
          </div>
          
          <div className="card mt-4">
            <div className="card-header">
              <h3>Recent Results</h3>
            </div>
            <div className="card-body">
              {racesLoading ? (
                <Loading message="Loading results..." />
              ) : racesError ? (
                <ErrorMessage message="Failed to load recent results." />
              ) : racesData?.recent?.length > 0 ? (
                <RecentRacesWidget races={racesData.recent} type="recent" />
              ) : (
                <p className="no-data">No recent race results</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-title {
          margin-bottom: 20px;
          color: var(--secondary-color);
        }
        
        .season-header {
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .season-header h2 {
          color: var(--primary-color);
          margin-bottom: 5px;
        }
        
        .season-header p {
          color: var(--text-color);
          font-size: 0.9rem;
        }
        
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .dashboard-column {
          display: flex;
          flex-direction: column;
        }
        
        .no-data {
          padding: 20px;
          text-align: center;
          color: var(--text-color);
          font-style: italic;
        }
        
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
