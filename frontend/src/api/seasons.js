import apiClient from './client'

/**
 * Get list of all seasons
 * @param {Object} params - Query parameters for filtering, pagination, etc.
 * @returns {Promise<Array>} - List of seasons
 */
export const getSeasons = async (params = {}) => {
  try {
    return await apiClient.get('/seasons/', { params })
  } catch (error) {
    console.error('Error fetching seasons:', error)
    throw error
  }
}

/**
 * Get a specific season by ID
 * @param {number} id - Season ID
 * @returns {Promise<Object>} - Season details
 */
export const getSeason = async (id) => {
  try {
    return await apiClient.get(`/seasons/${id}/`)
  } catch (error) {
    console.error(`Error fetching season ${id}:`, error)
    throw error
  }
}

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
 * Get current season
 * @returns {Promise<Object>} - Current season details
 */
export const getCurrentSeason = async () => {
  try {
    const seasons = await getSeasons({ ordering: '-year' })
    return seasons.length > 0 ? seasons[0] : null
  } catch (error) {
    console.error('Error fetching current season:', error)
    throw error
  }
}
