import apiClient from './client'

/**
 * Get list of all drivers
 * @param {Object} params - Query parameters for filtering, pagination, etc.
 * @returns {Promise<Array>} - List of drivers
 */
export const getDrivers = async (params = {}) => {
  try {
    return await apiClient.get('/drivers/', { params })
  } catch (error) {
    console.error('Error fetching drivers:', error)
    throw error
  }
}

/**
 * Get a specific driver by ID
 * @param {number} id - Driver ID
 * @returns {Promise<Object>} - Driver details
 */
export const getDriver = async (id) => {
  try {
    return await apiClient.get(`/drivers/${id}/`)
  } catch (error) {
    console.error(`Error fetching driver ${id}:`, error)
    throw error
  }
}

/**
 * Get race results for a specific driver
 * @param {number} driverId - Driver ID
 * @param {number} seasonId - Season ID (optional)
 * @returns {Promise<Array>} - List of race results
 */
export const getDriverResults = async (driverId, seasonId = null) => {
  try {
    const params = seasonId ? { season: seasonId } : {}
    return await apiClient.get(`/drivers/${driverId}/race_results/`, { params })
  } catch (error) {
    console.error(`Error fetching race results for driver ${driverId}:`, error)
    throw error
  }
}

/**
 * Get race entries for a specific driver
 * @param {number} driverId - Driver ID
 * @param {number} seasonId - Season ID (optional)
 * @returns {Promise<Array>} - List of race entries
 */
export const getDriverEntries = async (driverId, seasonId = null) => {
  try {
    const params = seasonId ? { season: seasonId } : {}
    return await apiClient.get(`/drivers/${driverId}/race_entries/`, { params })
  } catch (error) {
    console.error(`Error fetching race entries for driver ${driverId}:`, error)
    throw error
  }
}

/**
 * Get penalties for a specific driver
 * @param {number} driverId - Driver ID
 * @returns {Promise<Array>} - List of penalties
 */
export const getDriverPenalties = async (driverId) => {
  try {
    return await apiClient.get(`/drivers/${driverId}/penalties/`)
  } catch (error) {
    console.error(`Error fetching penalties for driver ${driverId}:`, error)
    throw error
  }
}

/**
 * Get failures for a specific driver
 * @param {number} driverId - Driver ID
 * @returns {Promise<Array>} - List of failures
 */
export const getDriverFailures = async (driverId) => {
  try {
    return await apiClient.get(`/drivers/${driverId}/failures/`)
  } catch (error) {
    console.error(`Error fetching failures for driver ${driverId}:`, error)
    throw error
  }
}

/**
 * Get season standings for a specific driver
 * @param {number} driverId - Driver ID
 * @param {number} seasonId - Season ID (optional)
 * @returns {Promise<Array>} - List of standings
 */
export const getDriverSeasonStandings = async (driverId, seasonId = null) => {
  try {
    const params = seasonId ? { season: seasonId } : {}
    return await apiClient.get(`/drivers/${driverId}/season_standings/`, { params })
  } catch (error) {
    console.error(`Error fetching standings for driver ${driverId}:`, error)
    throw error
  }
}

/**
 * Get driver statistics (calculated from results)
 * @param {number} driverId - Driver ID
 * @returns {Promise<Object>} - Driver statistics
 */
export const getDriverStats = async (driverId) => {
  try {
    return await apiClient.get(`/drivers/${driverId}/stats/`)
  } catch (error) {
    console.error(`Error fetching stats for driver ${driverId}:`, error)
    throw error
  }
}
