import axios from 'axios';
import { API_ENDPOINTS, DEFAULT_HEADERS, REQUEST_TIMEOUT, API_CONFIG } from './config';

// Create axios instance with default config
const apiClient = axios.create({
  timeout: REQUEST_TIMEOUT,
  headers: DEFAULT_HEADERS,
  ...API_CONFIG,
});

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can add authentication tokens here
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Handle successful responses
    if (response.data) {
      return response;
    }
    return Promise.reject(new Error('No data in response'));
  },
  (error) => {
    // Handle common error scenarios here
    if (error.response) {
      // The request was made and the server responded with an error status
      console.error('API Error Response:', error.response.data);
      
      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - handle auth errors
        console.log('Authentication required');
        // Redirect to login or show auth message
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('API Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API service functions
const apiService = {
  // Teams
  getTeams: (params) => apiClient.get(API_ENDPOINTS.TEAMS, { params }),
  getTeam: (id) => apiClient.get(API_ENDPOINTS.TEAM_DETAIL(id)),
  createTeam: (data) => apiClient.post(API_ENDPOINTS.TEAMS, data),
  updateTeam: (id, data) => apiClient.put(API_ENDPOINTS.TEAM_DETAIL(id), data),
  deleteTeam: (id) => apiClient.delete(API_ENDPOINTS.TEAM_DETAIL(id)),
  getTeamDrivers: (id) => apiClient.get(API_ENDPOINTS.TEAM_DRIVERS(id)),
  getTeamCars: (id) => apiClient.get(API_ENDPOINTS.TEAM_CARS(id)),
  getTeamStaff: (id) => apiClient.get(API_ENDPOINTS.TEAM_STAFF(id)),
  getTeamSponsorships: (id) => apiClient.get(API_ENDPOINTS.TEAM_SPONSORSHIPS(id)),
  getTeamStandings: (id, season) => apiClient.get(API_ENDPOINTS.TEAM_STANDINGS(id, season)),

  // Drivers
  getDrivers: (params) => apiClient.get(API_ENDPOINTS.DRIVERS, { params }),
  getDriver: (id) => apiClient.get(API_ENDPOINTS.DRIVER_DETAIL(id)),
  createDriver: (data) => apiClient.post(API_ENDPOINTS.DRIVERS, data),
  updateDriver: (id, data) => apiClient.put(API_ENDPOINTS.DRIVER_DETAIL(id), data),
  deleteDriver: (id) => apiClient.delete(API_ENDPOINTS.DRIVER_DETAIL(id)),
  getDriverRaceResults: (id, season) => apiClient.get(API_ENDPOINTS.DRIVER_RACE_RESULTS(id, season)),
  getDriverRaceEntries: (id, season) => apiClient.get(API_ENDPOINTS.DRIVER_RACE_ENTRIES(id, season)),
  getDriverPenalties: (id) => apiClient.get(API_ENDPOINTS.DRIVER_PENALTIES(id)),
  getDriverFailures: (id) => apiClient.get(API_ENDPOINTS.DRIVER_FAILURES(id)),
  getDriverStandings: (id, season) => apiClient.get(API_ENDPOINTS.DRIVER_STANDINGS(id, season)),

  // Races
  getRaces: (params) => apiClient.get(API_ENDPOINTS.RACES, { params }),
  getRace: (id) => apiClient.get(API_ENDPOINTS.RACE_DETAIL(id)),
  createRace: (data) => apiClient.post(API_ENDPOINTS.RACES, data),
  updateRace: (id, data) => apiClient.put(API_ENDPOINTS.RACE_DETAIL(id), data),
  deleteRace: (id) => apiClient.delete(API_ENDPOINTS.RACE_DETAIL(id)),
  getRaceEntries: (id) => apiClient.get(API_ENDPOINTS.RACE_ENTRIES(id)),
  getRaceResults: (id) => apiClient.get(API_ENDPOINTS.RACE_RESULTS(id)),
  getRacePenalties: (id) => apiClient.get(API_ENDPOINTS.RACE_PENALTIES(id)),
  getRaceFailures: (id) => apiClient.get(API_ENDPOINTS.RACE_FAILURES(id)),
  
  // Race Entries
  createRaceEntry: (data) => apiClient.post(API_ENDPOINTS.RACE_ENTRIES, data),
  updateRaceEntry: (id, data) => apiClient.put(`${API_ENDPOINTS.RACE_ENTRIES}${id}/`, data),
  deleteRaceEntry: (id) => apiClient.delete(`${API_ENDPOINTS.RACE_ENTRIES}${id}/`),
  
  // Race Results
  createRaceResult: (data) => apiClient.post(API_ENDPOINTS.RACE_RESULTS, data),
  updateRaceResult: (id, data) => apiClient.put(`${API_ENDPOINTS.RACE_RESULTS}${id}/`, data),
  deleteRaceResult: (id) => apiClient.delete(`${API_ENDPOINTS.RACE_RESULTS}${id}/`),

  // Seasons
  getSeasons: () => apiClient.get(API_ENDPOINTS.SEASONS),
  getSeason: (id) => apiClient.get(API_ENDPOINTS.SEASON_DETAIL(id)),
  createSeason: (data) => apiClient.post(API_ENDPOINTS.SEASONS, data),
  updateSeason: (id, data) => apiClient.put(API_ENDPOINTS.SEASON_DETAIL(id), data),
  deleteSeason: (id) => apiClient.delete(API_ENDPOINTS.SEASON_DETAIL(id)),
  getSeasonRaces: (id) => apiClient.get(API_ENDPOINTS.SEASON_RACES(id)),
  getSeasonStandings: (id, type) => apiClient.get(API_ENDPOINTS.SEASON_STANDINGS(id, type)),

  // Circuits
  getCircuits: (params) => apiClient.get(API_ENDPOINTS.CIRCUITS, { params }),
  getCircuit: (id) => apiClient.get(API_ENDPOINTS.CIRCUIT_DETAIL(id)),
  createCircuit: (data) => apiClient.post(API_ENDPOINTS.CIRCUITS, data),
  updateCircuit: (id, data) => apiClient.put(API_ENDPOINTS.CIRCUIT_DETAIL(id), data),
  deleteCircuit: (id) => apiClient.delete(API_ENDPOINTS.CIRCUIT_DETAIL(id)),
  getCircuitRaces: (id) => apiClient.get(API_ENDPOINTS.CIRCUIT_RACES(id)),

  // Cars
  getCars: (params) => apiClient.get(API_ENDPOINTS.CARS, { params }),
  getCar: (id) => apiClient.get(`${API_ENDPOINTS.CARS}${id}/`),
  createCar: (data) => apiClient.post(API_ENDPOINTS.CARS, data),
  updateCar: (id, data) => apiClient.put(`${API_ENDPOINTS.CARS}${id}/`, data),
  deleteCar: (id) => apiClient.delete(`${API_ENDPOINTS.CARS}${id}/`),

  // Sponsors
  getSponsors: (params) => apiClient.get(API_ENDPOINTS.SPONSORS, { params }),
  getSponsor: (id) => apiClient.get(`${API_ENDPOINTS.SPONSORS}${id}/`),
  createSponsor: (data) => apiClient.post(API_ENDPOINTS.SPONSORS, data),
  updateSponsor: (id, data) => apiClient.put(`${API_ENDPOINTS.SPONSORS}${id}/`, data),
  deleteSponsor: (id) => apiClient.delete(`${API_ENDPOINTS.SPONSORS}${id}/`),

  // Sponsorships
  getSponsorships: (params) => apiClient.get(API_ENDPOINTS.SPONSORSHIPS, { params }),
  getSponsorship: (id) => apiClient.get(`${API_ENDPOINTS.SPONSORSHIPS}${id}/`),
  createSponsorship: (data) => apiClient.post(API_ENDPOINTS.SPONSORSHIPS, data),
  updateSponsorship: (id, data) => apiClient.put(`${API_ENDPOINTS.SPONSORSHIPS}${id}/`, data),
  deleteSponsorship: (id) => apiClient.delete(`${API_ENDPOINTS.SPONSORSHIPS}${id}/`),

  // Staff
  getStaff: (params) => apiClient.get(API_ENDPOINTS.STAFF, { params }),
  getStaffMember: (id) => apiClient.get(`${API_ENDPOINTS.STAFF}${id}/`),
  createStaffMember: (data) => apiClient.post(API_ENDPOINTS.STAFF, data),
  updateStaffMember: (id, data) => apiClient.put(`${API_ENDPOINTS.STAFF}${id}/`, data),
  deleteStaffMember: (id) => apiClient.delete(`${API_ENDPOINTS.STAFF}${id}/`),

  // Records
  getRecords: () => apiClient.get(API_ENDPOINTS.RECORDS),
  getRecord: (id) => apiClient.get(`${API_ENDPOINTS.RECORDS}${id}/`),
  createRecord: (data) => apiClient.post(API_ENDPOINTS.RECORDS, data),
  updateRecord: (id, data) => apiClient.put(`${API_ENDPOINTS.RECORDS}${id}/`, data),
  deleteRecord: (id) => apiClient.delete(`${API_ENDPOINTS.RECORDS}${id}/`),

  // Other endpoints
  getStandings: (params) => apiClient.get(API_ENDPOINTS.STANDINGS, { params }),
  
  // External API and data sync
  fetchExternalData: (params) => apiClient.get(API_ENDPOINTS.EXTERNAL_DATA, { params }),
  syncData: (params) => apiClient.get(API_ENDPOINTS.SYNC_DATA, { params }),
};

export default apiService;