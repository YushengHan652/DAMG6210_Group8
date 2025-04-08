import apiClient from './client'

/**
 * Get standings for a specific season
 * @param {number} seasonId - Season ID
 * @param {string} entityType - Entity type (Driver or Team)
 * @returns {Promise<Array>} - List of standings
 */
export const getStandings = async (seasonId, entityType = 'Driver') => {
  try {
    return await apiClient.get(`/seasons/${seasonId}/standings/`, {
      params: { type: entityType }
    })
  } catch (error) {
    console.error(`Error fetching ${entityType} standings for season ${seasonId}:`, error)
    throw error
  }
}

/**
 * Get current season standings
 * @param {string} entityType - Entity type (Driver or Team)
 * @returns {Promise<Array>} - List of current standings
 */
export const getCurrentStandings = async (entityType = 'Driver') => {
  try {
    // First, get the current season
    const seasons = await apiClient.get('/seasons/', {
      params: { ordering: '-year', limit: 1 }
    })
    
    if (seasons.results && seasons.results.length > 0) {
      const currentSeason = seasons.results[0]
      // Then get the standings for that season
      return await getStandings(currentSeason.season_id, entityType)
    }
    
    return []
  } catch (error) {
    console.error(`Error fetching current ${entityType} standings:`, error)
    throw error
  }
}

/**
 * Get detailed standings with extended information
 * @param {number} seasonId - Season ID
 * @param {string} entityType - Entity type (Driver or Team)
 * @returns {Promise<Array>} - List of detailed standings
 */
export const getDetailedStandings = async (seasonId, entityType = 'Driver') => {
  try {
    // Get basic standings data
    const standings = await getStandings(seasonId, entityType)
    
    if (entityType === 'Driver') {
      // Fetch additional driver details
      const detailedStandings = await Promise.all(
        standings.map(async (standing) => {
          const driver = await apiClient.get(`/drivers/${standing.entity_id}/`)
          return {
            ...standing,
            driver_details: driver
          }
        })
      )
      return detailedStandings
    } else {
      // Fetch additional team details
      const detailedStandings = await Promise.all(
        standings.map(async (standing) => {
          const team = await apiClient.get(`/teams/${standing.entity_id}/`)
          return {
            ...standing,
            team_details: team
          }
        })
      )
      return detailedStandings
    }
  } catch (error) {
    console.error(`Error fetching detailed ${entityType} standings:`, error)
    throw error
  }
}
