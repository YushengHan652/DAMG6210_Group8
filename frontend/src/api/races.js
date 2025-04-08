import apiClient from './client'

/**
 * Get list of all races
 * @param {Object} params - Query parameters for filtering, pagination, etc.
 * @returns {Promise<Array>} - List of races
 */
export const getRaces = async (params = {}) => {
  try {
    return await apiClient.get('/races/', { params })
  } catch (error) {
    console.error('Error fetching races:', error)
    throw error
  }
}

/**
 * Get a specific race by ID
 * @param {number} id - Race ID
 * @returns {Promise<Object>} - Race details
 */
export const getRace = async (id) => {
  try {
    return await apiClient.get(`/races/${id}/`)
  } catch (error) {
    console.error(`Error fetching race ${id}:`, error)
    throw error
  }
}

/**
 * Get races for a specific season
 * @param {number} seasonId - Season ID
 * @returns {Promise<Array>} - List of races
 */
export const getSeasonRaces = async (seasonId) => {
  try {
    return await apiClient.get(`/seasons/${seasonId}/races/`)
  } catch (error) {
    console.error(`Error fetching races for season ${seasonId}:`, error)
    throw error
  }
}

/**
 * Get entries for a specific race
 * @param {number} raceId - Race ID
 * @returns {Promise<Array>} - List of race entries
 */
export const getRaceEntries = async (raceId) => {
  try {
    return await apiClient.get(`/races/${raceId}/entries/`)
  } catch (error) {
    console.error(`Error fetching entries for race ${raceId}:`, error)
    throw error
  }
}

/**
 * Get results for a specific race
 * @param {number} raceId - Race ID
 * @returns {Promise<Array>} - List of race results
 */
export const getRaceResults = async (raceId) => {
  try {
    return await apiClient.get(`/races/${raceId}/results/`)
  } catch (error) {
    console.error(`Error fetching results for race ${raceId}:`, error)
    throw error
  }
}

/**
 * Get penalties for a specific race
 * @param {number} raceId - Race ID
 * @returns {Promise<Array>} - List of penalties
 */
export const getRacePenalties = async (raceId) => {
  try {
    return await apiClient.get(`/races/${raceId}/penalties/`)
  } catch (error) {
    console.error(`Error fetching penalties for race ${raceId}:`, error)
    throw error
  }
}

/**
 * Get failures for a specific race
 * @param {number} raceId - Race ID
 * @returns {Promise<Array>} - List of failures
 */
export const getRaceFailures = async (raceId) => {
  try {
    return await apiClient.get(`/races/${raceId}/failures/`)
  } catch (error) {
    console.error(`Error fetching failures for race ${raceId}:`, error)
    throw error
  }
}
