import React, { createContext, useContext, useState, useEffect } from 'react'
import { getSeasons } from '../api/seasons'
import { getStandings } from '../api/standings'

const AppContext = createContext()

export const useAppContext = () => useContext(AppContext)

export const AppProvider = ({ children }) => {
  const [currentSeason, setCurrentSeason] = useState(null)
  const [seasons, setSeasons] = useState([])
  const [driverStandings, setDriverStandings] = useState([])
  const [teamStandings, setTeamStandings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadInitialData = async () => {
    setLoading(true)
    try {
      // Load seasons
      const seasonsData = await getSeasons()
      if (seasonsData.length > 0) {
        setSeasons(seasonsData)
        // Set current season to the most recent one
        const currentSeasonData = seasonsData[0] // Assuming they're ordered by year desc
        setCurrentSeason(currentSeasonData)
        
        // Load current season standings
        const driverStandingsData = await getStandings(currentSeasonData.season_id, 'Driver')
        const teamStandingsData = await getStandings(currentSeasonData.season_id, 'Team')
        
        setDriverStandings(driverStandingsData)
        setTeamStandings(teamStandingsData)
      }
    } catch (err) {
      console.error('Failed to load initial data:', err)
      setError('Failed to load data. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const changeSeason = async (seasonId) => {
    setLoading(true)
    try {
      const selectedSeason = seasons.find(s => s.season_id === parseInt(seasonId))
      if (selectedSeason) {
        setCurrentSeason(selectedSeason)
        
        // Load selected season standings
        const driverStandingsData = await getStandings(seasonId, 'Driver')
        const teamStandingsData = await getStandings(seasonId, 'Team')
        
        setDriverStandings(driverStandingsData)
        setTeamStandings(teamStandingsData)
      }
    } catch (err) {
      console.error('Failed to change season:', err)
      setError('Failed to load season data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  const value = {
    currentSeason,
    seasons,
    driverStandings,
    teamStandings,
    loading,
    error,
    loadInitialData,
    changeSeason,
    clearError
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
