/**
 * Teams management JavaScript for F1 Management System
 */

// DOM Elements
const teamsTable = document.getElementById('teams-table');
const teamModal = document.getElementById('team-modal');
const teamForm = document.getElementById('team-form');
const teamFormTitle = document.getElementById('team-form-title');
const addTeamButton = document.getElementById('add-team-button');
const teamSearch = document.getElementById('team-search');
const teamCountryFilter = document.getElementById('team-country-filter');

// Team form fields
const teamIdField = document.getElementById('team-id');
const teamNameField = document.getElementById('team-name');
const teamCountryField = document.getElementById('team-country');
const teamPrincipalField = document.getElementById('team-principal');
const teamBudgetField = document.getElementById('team-budget');
const teamTiresField = document.getElementById('team-tires');
const teamChampionshipsField = document.getElementById('team-championships');
const teamFoundedField = document.getElementById('team-founded');

// Initialize teams
document.addEventListener('DOMContentLoaded', () => {
    // Load teams data
    loadTeams();
    
    // Set up event listeners
    setupTeamEvents();
});

/**
 * Load teams data from API
 */
function loadTeams() {
    // Show loader
    const tbody = teamsTable.querySelector('tbody');
    tbody.innerHTML = '';
    tbody.appendChild(createLoader());
    
    fetch(`${API_BASE_URL}/teams`)
        .then(response => response.json())
        .then(teams => {
            displayTeams(teams);
            populateCountryFilter(teams);
        })
        .catch(error => {
            console.error('Error loading teams:', error);
            tbody.innerHTML = '<tr><td colspan="8" class="error-message">Failed to load teams data.</td></tr>';
        });
}

/**
 * Display teams in the table
 */
function displayTeams(teams) {
    const tbody = teamsTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    if (teams.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8">No teams found.</td></tr>';
        return;
    }
    
    teams.forEach(team => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${team.Team_Name}</td>
            <td>${team.Team_Country}</td>
            <td>${team.Team_Principal || '-'}</td>
            <td>${team.Budget ? formatCurrency(team.Budget) : '-'}</td>
            <td>${team.Tires_Supplier || '-'}</td>
            <td>${team.Championships_Won || 0}</td>
            <td>${team.Founded_Year || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-button edit" data-id="${team.Team_ID}" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-button delete" data-id="${team.Team_ID}" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <button class="action-button view" data-id="${team.Team_ID}" title="View Drivers">
                        <i class="fas fa-users"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addTeamActionListeners();
}

/**
 * Add event listeners to team action buttons
 */
function addTeamActionListeners() {
    // Edit buttons
    document.querySelectorAll('.action-button.edit').forEach(button => {
        button.addEventListener('click', () => {
            const teamId = button.getAttribute('data-id');
            editTeam(teamId);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.action-button.delete').forEach(button => {
        button.addEventListener('click', () => {
            const teamId = button.getAttribute('data-id');
            deleteTeam(teamId);
        });
    });
    
    // View drivers buttons
    document.querySelectorAll('.action-button.view').forEach(button => {
        button.addEventListener('click', () => {
            const teamId = button.getAttribute('data-id');
            viewTeamDrivers(teamId);
        });
    });
}

/**
 * Set up team-related event listeners
 */
function setupTeamEvents() {
    // Add team button
    addTeamButton.addEventListener('click', () => {
        openTeamModal();
    });
    
    // Close modal buttons
    document.querySelectorAll('#team-modal .close, #team-modal .cancel-button').forEach(button => {
        button.addEventListener('click', () => {
            teamModal.style.display = 'none';
        });
    });
    
    // Submit team form
    teamForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitTeamForm();
    });
    
    // Search input
    teamSearch.addEventListener('input', filterTeams);
    
    // Country filter
    teamCountryFilter.addEventListener('change', filterTeams);
}

/**
 * Open the team modal for adding a new team
 */
function openTeamModal() {
    // Reset form
    teamForm.reset();
    teamIdField.value = '';
    
    // Set modal title
    teamFormTitle.textContent = 'Add New Team';
    
    // Show modal
    teamModal.style.display = 'block';
}

/**
 * Edit a team
 * @param {number} teamId - ID of the team to edit
 */
function editTeam(teamId) {
    // Show loader
    teamForm.innerHTML = '';
    teamForm.appendChild(createLoader());
    
    // Set modal title
    teamFormTitle.textContent = 'Edit Team';
    
    // Show modal
    teamModal.style.display = 'block';
    
    // Fetch team data
    fetch(`${API_BASE_URL}/teams/${teamId}`)
        .then(response => response.json())
        .then(team => {
            // Restore form
            teamForm.innerHTML = `
                <input type="hidden" id="team-id">
                <div class="form-group">
                    <label for="team-name">Team Name *</label>
                    <input type="text" id="team-name" required>
                </div>
                <div class="form-group">
                    <label for="team-country">Country *</label>
                    <input type="text" id="team-country" required>
                </div>
                <div class="form-group">
                    <label for="team-principal">Team Principal</label>
                    <input type="text" id="team-principal">
                </div>
                <div class="form-group">
                    <label for="team-budget">Budget (USD)</label>
                    <input type="number" id="team-budget" min="0" step="1000000">
                </div>
                <div class="form-group">
                    <label for="team-tires">Tires Supplier</label>
                    <input type="text" id="team-tires">
                </div>
                <div class="form-group">
                    <label for="team-championships">Championships Won</label>
                    <input type="number" id="team-championships" min="0" value="0">
                </div>
                <div class="form-group">
                    <label for="team-founded">Founded Year</label>
                    <input type="number" id="team-founded" min="1900" max="2025">
                </div>
                <div class="form-buttons">
                    <button type="submit" class="save-button">Save</button>
                    <button type="button" class="cancel-button">Cancel</button>
                </div>
            `;
            
            // Re-get form elements
            const teamIdField = document.getElementById('team-id');
            const teamNameField = document.getElementById('team-name');
            const teamCountryField = document.getElementById('team-country');
            const teamPrincipalField = document.getElementById('team-principal');
            const teamBudgetField = document.getElementById('team-budget');
            const teamTiresField = document.getElementById('team-tires');
            const teamChampionshipsField = document.getElementById('team-championships');
            const teamFoundedField = document.getElementById('team-founded');
            
            // Add event listener to cancel button
            document.querySelector('#team-modal .cancel-button').addEventListener('click', () => {
                teamModal.style.display = 'none';
            });
            
            // Fill form with team data
            teamIdField.value = team.Team_ID;
            teamNameField.value = team.Team_Name;
            teamCountryField.value = team.Team_Country;
            teamPrincipalField.value = team.Team_Principal || '';
            teamBudgetField.value = team.Budget || '';
            teamTiresField.value = team.Tires_Supplier || '';
            teamChampionshipsField.value = team.Championships_Won || 0;
            teamFoundedField.value = team.Founded_Year || '';
        })
        .catch(error => {
            console.error('Error fetching team:', error);
            teamModal.style.display = 'none';
            showToast('Failed to load team data.', 'error');
        });
}

/**
 * Delete a team
 * @param {number} teamId - ID of the team to delete
 */
function deleteTeam(teamId) {
    // Show confirmation modal
    showConfirmModal(
        'Delete Team',
        'Are you sure you want to delete this team? This action cannot be undone.',
        () => {
            // Send delete request
            fetch(`${API_BASE_URL}/teams/${teamId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => Promise.reject(data));
                }
                return response.json();
            })
            .then(data => {
                showToast(data.message || 'Team deleted successfully.');
                loadTeams();
            })
            .catch(error => {
                console.error('Error deleting team:', error);
                showToast(error.message || 'Failed to delete team.', 'error');
            });
        }
    );
}

/**
 * View team drivers
 * @param {number} teamId - ID of the team
 */
function viewTeamDrivers(teamId) {
    // Redirect to drivers tab with team filter
    document.querySelector('.nav-link[data-section="drivers"]').click();
    
    // Select the team in the filter dropdown
    // This will be implemented in drivers.js
    // Here we just dispatch a custom event
    const event = new CustomEvent('filterByTeam', { detail: { teamId } });
    document.dispatchEvent(event);
}

/**
 * Submit the team form
 */
function submitTeamForm() {
    const teamId = teamIdField.value;
    const teamData = {
        teamName: teamNameField.value,
        teamCountry: teamCountryField.value,
        teamPrincipal: teamPrincipalField.value,
        budget: teamBudgetField.value ? parseFloat(teamBudgetField.value) : null,
        tiresSupplier: teamTiresField.value,
        championships: teamChampionshipsField.value ? parseInt(teamChampionshipsField.value) : 0,
        foundedYear: teamFoundedField.value ? parseInt(teamFoundedField.value) : null
    };
    
    // Validate required fields
    if (!teamData.teamName || !teamData.teamCountry) {
        showToast('Team name and country are required.', 'error');
        return;
    }
    
    // Determine if this is an update or create
    const isUpdate = !!teamId;
    const url = isUpdate ? `${API_BASE_URL}/teams/${teamId}` : `${API_BASE_URL}/teams`;
    const method = isUpdate ? 'PUT' : 'POST';
    
    // Send request
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(teamData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => Promise.reject(data));
        }
        return response.json();
    })
    .then(data => {
        showToast(data.message || (isUpdate ? 'Team updated successfully.' : 'Team created successfully.'));
        teamModal.style.display = 'none';
        loadTeams();
    })
    .catch(error => {
        console.error('Error saving team:', error);
        showToast(error.message || 'Failed to save team.', 'error');
    });
}

/**
 * Filter teams based on search and country filter
 */
function filterTeams() {
    const searchTerm = teamSearch.value.toLowerCase();
    const countryFilter = teamCountryFilter.value.toLowerCase();
    
    // Get all rows
    const rows = teamsTable.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const teamName = row.cells[0].textContent.toLowerCase();
        const teamCountry = row.cells[1].textContent.toLowerCase();
        
        // Check if row matches filters
        const matchesSearch = teamName.includes(searchTerm) || 
                             teamCountry.includes(searchTerm) ||
                             (row.cells[2].textContent.toLowerCase().includes(searchTerm));
                             
        const matchesCountry = !countryFilter || teamCountry === countryFilter;
        
        // Show/hide row
        row.style.display = (matchesSearch && matchesCountry) ? '' : 'none';
    });
}

/**
 * Populate country filter dropdown
 */
function populateCountryFilter(teams) {
    // Get unique countries
    const countries = [...new Set(teams.map(team => team.Team_Country))].sort();
    
    // Clear existing options (except the first one)
    while (teamCountryFilter.options.length > 1) {
        teamCountryFilter.remove(1);
    }
    
    // Add country options
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        teamCountryFilter.appendChild(option);
    });
}

/**
 * Format currency
 * @param {number} value - Value to format
 * @returns {string} Formatted currency
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(value);
}