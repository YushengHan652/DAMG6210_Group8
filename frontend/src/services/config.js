// API base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// API endpoints
export const API_ENDPOINTS = {
  // Teams
  TEAMS: `${API_BASE_URL}/teams/`,
  TEAM_DETAIL: (id) => `${API_BASE_URL}/teams/${id}/`,
  TEAM_DRIVERS: (id) => `${API_BASE_URL}/teams/${id}/drivers/`,
  TEAM_CARS: (id) => `${API_BASE_URL}/teams/${id}/cars/`,
  TEAM_STAFF: (id) => `${API_BASE_URL}/teams/${id}/staff/`,
  TEAM_SPONSORSHIPS: (id) => `${API_BASE_URL}/teams/${id}/sponsorships/`,
  TEAM_STANDINGS: (id, season) => 
    `${API_BASE_URL}/teams/${id}/season_standings/${season ? `?season=${season}` : ''}`,

  // Drivers
  DRIVERS: `${API_BASE_URL}/drivers/`,
  DRIVER_DETAIL: (id) => `${API_BASE_URL}/drivers/${id}/`,
  DRIVER_RACE_RESULTS: (id, season) => 
    `${API_BASE_URL}/drivers/${id}/race_results/${season ? `?season=${season}` : ''}`,
  DRIVER_RACE_ENTRIES: (id, season) => 
    `${API_BASE_URL}/drivers/${id}/race_entries/${season ? `?season=${season}` : ''}`,
  DRIVER_PENALTIES: (id) => `${API_BASE_URL}/drivers/${id}/penalties/`,
  DRIVER_FAILURES: (id) => `${API_BASE_URL}/drivers/${id}/failures/`,
  DRIVER_STANDINGS: (id, season) => 
    `${API_BASE_URL}/drivers/${id}/season_standings/${season ? `?season=${season}` : ''}`,

  // Races
  RACES: `${API_BASE_URL}/races/`,
  RACE_DETAIL: (id) => `${API_BASE_URL}/races/${id}/`,
  RACE_ENTRIES: (id) => `${API_BASE_URL}/races/${id}/entries/`,
  RACE_RESULTS: (id) => `${API_BASE_URL}/races/${id}/results/`,
  RACE_PENALTIES: (id) => `${API_BASE_URL}/races/${id}/penalties/`,
  RACE_FAILURES: (id) => `${API_BASE_URL}/races/${id}/failures/`,

  // Seasons
  SEASONS: `${API_BASE_URL}/seasons/`,
  SEASON_DETAIL: (id) => `${API_BASE_URL}/seasons/${id}/`,
  SEASON_RACES: (id) => `${API_BASE_URL}/seasons/${id}/races/`,
  SEASON_STANDINGS: (id, type = 'Driver') => 
    `${API_BASE_URL}/seasons/${id}/standings/?type=${type}`,

  // Circuits
  CIRCUITS: `${API_BASE_URL}/circuits/`,
  CIRCUIT_DETAIL: (id) => `${API_BASE_URL}/circuits/${id}/`,
  CIRCUIT_RACES: (id) => `${API_BASE_URL}/circuits/${id}/races/`,

  // Other endpoints
  STANDINGS: `${API_BASE_URL}/standings/`,
  RECORDS: `${API_BASE_URL}/records/`,
  EXTERNAL_DATA: `${API_BASE_URL}/api/external/`,
  SYNC_DATA: `${API_BASE_URL}/sync/`,
};

// Default request headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// Other API configuration
export const API_CONFIG = {
  withCredentials: true, // Include cookies with requests
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  DEFAULT_HEADERS,
  REQUEST_TIMEOUT,
  API_CONFIG,
};