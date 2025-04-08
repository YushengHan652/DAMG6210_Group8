import apiClient from './client'

/**
 * Get list of all teams
 * @param {Object} params - Query parameters for filtering, pagination, etc.
 * @returns {Promise<Array>} - List of teams
 */
export const getTeams = async (params = {}) => {
  try {
    return await apiClient.get('/teams/', { params })
  } catch (error) {
    console.error('Error fetching teams:', error)
    throw error
  }
}

/**
 * Get a specific team by ID
 * @param {number} id - Team ID
 * @returns {Promise<Object>} - Team details
 */
export const getTeam = async (id) => {
  try {
    return await apiClient.get(`/teams/${id}/`)
  } catch (error) {
    console.error(`Error fetching team ${id}:`, error)
    throw error
  }
}

/**
 * Get drivers for a specific team
 * @param {number} teamId - Team ID
 * @returns {Promise<Array>} - List of drivers
 */
export const getTeamDrivers = async (teamId) => {
  try {
    return await apiClient.get(`/teams/${teamId}/drivers/`)
  } catch (error) {
    console.error(`Error fetching drivers for team ${teamId}:`, error)
    throw error
  }
}

/**
 * Get cars for a specific team
 * @param {number} teamId - Team ID
 * @returns {Promise<Array>} - List of cars
 */
export const getTeamCars = async (teamId) => {
  try {
    return await apiClient.get(`/teams/${teamId}/cars/`)
  } catch (error) {
    console.error(`Error fetching cars for team ${teamId}:`, error)
    throw error
  }
}

/**
 * Get staff for a specific team
 * @param {number} teamId - Team ID
 * @returns {Promise<Array>} - List of staff members
 */
export const getTeamStaff = async (teamId) => {
  try {
    return await apiClient.get(`/teams/${teamId}/staff/`)
  } catch (error) {
    console.error(`Error fetching staff for team ${teamId}:`, error)
    throw error
  }
}

/**
 * Get sponsorships for a specific team
 * @param {number} teamId - Team ID
 * @returns {Promise<Array>} - List of sponsorships
 */
export const getTeamSponsorships = async (teamId) => {
  try {
    return await apiClient.get(`/teams/${teamId}/sponsorships/`)
  } catch (error) {
    console.error(`Error fetching sponsorships for team ${teamId}:`, error)
    throw error
  }
}

/**
 * Get season standings for a specific team
 * @param {number} teamId - Team ID
 * @param {number} seasonId - Season ID (optional)
 * @returns {Promise<Array>} - List of standings
 */
export const getTeamSeasonStandings = async (teamId, seasonId = null) => {
  try {
    const params = seasonId ? { season: seasonId } : {}
    return await apiClient.get(`/teams/${teamId}/season_standings/`, { params })
  } catch (error) {
    console.error(`Error fetching standings for team ${teamId}:`, error)
    throw error
  }
}
