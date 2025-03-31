/**
 * Main JavaScript file for F1 Management System
 */

// Base API URL - change this if your backend is hosted elsewhere
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const confirmModal = document.getElementById('confirm-modal');
const confirmTitle = document.getElementById('confirm-title');
const confirmMessage = document.getElementById('confirm-message');
const confirmYesButton = document.getElementById('confirm-yes');
const confirmNoButton = document.getElementById('confirm-no');
const toast = document.getElementById('toast');

// Current action callback for confirmation modal
let currentConfirmCallback = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Set up navigation
    setupNavigation();
    
    // Load dashboard data
    loadDashboardData();
    
    // Set up confirmation modal
    setupConfirmModal();
});

/**
 * Set up navigation between sections
 */
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            contentSections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Show corresponding section
            const sectionId = link.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

/**
 * Load dashboard data
 */
function loadDashboardData() {
    // Load teams overview
    fetch(`${API_BASE_URL}/teams`)
        .then(response => response.json())
        .then(teams => {
            displayTeamsOverview(teams);
        })
        .catch(error => {
            console.error('Error loading teams:', error);
            document.getElementById('teams-overview').innerHTML = 
                '<p class="error-message">Failed to load teams data.</p>';
        });
    
    // Load top drivers
    fetch(`${API_BASE_URL}/drivers`)
        .then(response => response.json())
        .then(drivers => {
            displayTopDrivers(drivers);
        })
        .catch(error => {
            console.error('Error loading drivers:', error);
            document.getElementById('top-drivers').innerHTML = 
                '<p class="error-message">Failed to load drivers data.</p>';
        });
    
    // Load next races
    fetch(`${API_BASE_URL}/races`)
        .then(response => response.json())
        .then(races => {
            displayNextRaces(races);
        })
        .catch(error => {
            console.error('Error loading races:', error);
            document.getElementById('next-races').innerHTML = 
                '<p class="error-message">Failed to load races data.</p>';
        });
    
    // Load standings
    loadStandings();
}

/**
 * Display teams overview on dashboard
 */
function displayTeamsOverview(teams) {
    // Sort teams by championships won
    const sortedTeams = [...teams].sort((a, b) => b.Championships_Won - a.Championships_Won);
    const topTeams = sortedTeams.slice(0, 5);
    
    let html = '<table class="dashboard-table">';
    html += '<thead><tr><th>Team</th><th>Country</th><th>Championships</th></tr></thead><tbody>';
    
    topTeams.forEach(team => {
        html += `<tr>
            <td>${team.Team_Name}</td>
            <td>${team.Team_Country}</td>
            <td>${team.Championships_Won}</td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    document.getElementById('teams-overview').innerHTML = html;
}

/**
 * Display top drivers on dashboard
 */
function displayTopDrivers(drivers) {
    // Sort drivers by number of wins
    const sortedDrivers = [...drivers].sort((a, b) => b.Number_of_Wins - a.Number_of_Wins);
    const topDrivers = sortedDrivers.slice(0, 5);
    
    let html = '<table class="dashboard-table">';
    html += '<thead><tr><th>Driver</th><th>Team</th><th>Wins</th></tr></thead><tbody>';
    
    topDrivers.forEach(driver => {
        html += `<tr>
            <td>${driver.Name}</td>
            <td>${driver.Team_Name}</td>
            <td>${driver.Number_of_Wins}</td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    document.getElementById('top-drivers').innerHTML = html;
}

/**
 * Display next races on dashboard
 */
function displayNextRaces(races) {
    // Filter future races
    const today = new Date();
    const futureRaces = races.filter(race => new Date(race.Date) >= today);
    
    // Sort by date (ascending)
    const sortedRaces = futureRaces.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    const nextRaces = sortedRaces.slice(0, 5);
    
    if (nextRaces.length === 0) {
        document.getElementById('next-races').innerHTML = 
            '<p>No upcoming races scheduled.</p>';
        return;
    }
    
    let html = '<table class="dashboard-table">';
    html += '<thead><tr><th>Location</th><th>Circuit</th><th>Date</th></tr></thead><tbody>';
    
    nextRaces.forEach(race => {
        const raceDate = new Date(race.Date).toLocaleDateString();
        html += `<tr>
            <td>${race.Location}</td>
            <td>${race.CircuitName}</td>
            <td>${raceDate}</td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    document.getElementById('next-races').innerHTML = html;
}

/**
 * Load standings data
 */
function loadStandings() {
    // Get the current year
    const currentYear = new Date().getFullYear();
    
    // Fetch most recent season
    fetch(`${API_BASE_URL}/races/season/5`) // Assuming season ID 5 is the current one
        .then(response => response.json())
        .then(races => {
            if (races.length > 0) {
                // Find the most recent season ID
                const seasonId = races[0].Season_ID;
                
                // Fetch standings for that season
                return fetch(`${API_BASE_URL}/races/champions/all`);
            }
            return Promise.reject("No races found for current season");
        })
        .then(response => response.json())
        .then(champions => {
            displayStandings(champions);
        })
        .catch(error => {
            console.error('Error loading standings:', error);
            document.getElementById('standings').innerHTML = 
                '<p class="error-message">Failed to load standings data.</p>';
        });
}

/**
 * Display standings on dashboard
 */
function displayStandings(champions) {
    // Sort by year (descending)
    const sortedChampions = [...champions].sort((a, b) => b.Year - a.Year);
    const recentChampions = sortedChampions.slice(0, 5);
    
    let html = '<table class="dashboard-table">';
    html += '<thead><tr><th>Year</th><th>Champion Team</th></tr></thead><tbody>';
    
    recentChampions.forEach(champion => {
        html += `<tr>
            <td>${champion.Year}</td>
            <td>${champion.Champion_Team}</td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    document.getElementById('standings').innerHTML = html;
}

/**
 * Set up the confirmation modal
 */
function setupConfirmModal() {
    // Close modal when clicking "No"
    confirmNoButton.addEventListener('click', () => {
        confirmModal.style.display = 'none';
        currentConfirmCallback = null;
    });
    
    // Execute callback when clicking "Yes"
    confirmYesButton.addEventListener('click', () => {
        if (currentConfirmCallback) {
            currentConfirmCallback();
        }
        confirmModal.style.display = 'none';
        currentConfirmCallback = null;
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            confirmModal.style.display = 'none';
            currentConfirmCallback = null;
        }
    });
}

/**
 * Show confirmation modal with custom message
 * @param {string} title - Modal title
 * @param {string} message - Confirmation message
 * @param {Function} callback - Function to execute if confirmed
 */
function showConfirmModal(title, message, callback) {
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    currentConfirmCallback = callback;
    confirmModal.style.display = 'block';
}

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, warning)
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'success', duration = 3000) {
    toast.textContent = message;
    toast.className = 'toast';
    
    if (type !== 'success') {
        toast.classList.add(type);
    }
    
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, duration);
}

/**
 * Format date to YYYY-MM-DD for inputs
 * @param {Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatDateForInput(date) {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}

/**
 * Create a loading indicator
 * @returns {HTMLElement} Loading element
 */
function createLoader() {
    const loadingContainer = document.createElement('div');
    loadingContainer.className = 'loading-container';
    
    const loader = document.createElement('div');
    loader.className = 'loader';
    
    const loadingText = document.createElement('p');
    loadingText.textContent = 'Loading...';
    
    loadingContainer.appendChild(loader);
    loadingContainer.appendChild(loadingText);
    
    return loadingContainer;
}