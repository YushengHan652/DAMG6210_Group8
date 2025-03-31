/**
 * Drivers management JavaScript for F1 Management System
 */

// DOM Elements
const driversTable = document.getElementById('drivers-table');
const driverModal = document.getElementById('driver-modal');
const driverForm = document.getElementById('driver-form');
const driverFormTitle = document.getElementById('driver-form-title');
const addDriverButton = document.getElementById('add-driver-button');
const driverSearch = document.getElementById('driver-search');
const driverTeamFilter = document.getElementById('driver-team-filter');
const driverNationalityFilter = document.getElementById('driver-nationality-filter');

// Driver form fields
const driverIdField = document.getElementById('driver-id');
const driverNameField = document.getElementById('driver-name');
const driverAgeField = document.getElementById('driver-age');
const driverNationalityField = document.getElementById('driver-nationality');
const driverTeamField = document.getElementById('driver-team');
const driverWinsField = document.getElementById('driver-wins');
const driverSalaryField = document.getElementById('driver-salary');
const driverContractStartField = document.getElementById('driver-contract-start');
const driverContractEndField = document.getElementById('driver-contract-end');
const driverPolesField = document.getElementById('driver-poles');
const driverFastestLapsField = document.getElementById('driver-fastest-laps');

// Initialize drivers
document.addEventListener('DOMContentLoaded', () => {
    // Load teams for dropdown
    loadTeamsForDropdown();
    
    // Load drivers data
    loadDrivers();
    
    // Set up event listeners
    setupDriverEvents();
    
    // Listen for filterByTeam event
    document.addEventListener('filterByTeam', (e) => {
        const teamId = e.detail.teamId;
        // Find the option with the matching team ID
        const option = Array.from(driverTeamFilter.options).find(option => option.value === teamId.toString());
        if (option) {
            driverTeamFilter.value = option.value;
            filterDrivers();
        }
    });
});

/**
 * Load teams for the team dropdown
 */
function loadTeamsForDropdown() {
    fetch(`${API_BASE_URL}/teams`)
        .then(response => response.json())
        .then(teams => {
            // Sort teams by name
            const sortedTeams = [...teams].sort((a, b) => a.Team_Name.localeCompare(b.Team_Name));
            
            // Clear existing options (except the first one)
            while (driverTeamFilter.options.length > 1) {
                driverTeamFilter.remove(1);
            }
            
            while (driverTeamField.options.length > 1) {
                driverTeamField.remove(1);
            }
            
            // Add team options to filters
            sortedTeams.forEach(team => {
                // Add to filter dropdown
                const filterOption = document.createElement('option');
                filterOption.value = team.Team_ID;
                filterOption.textContent = team.Team_Name;
                driverTeamFilter.appendChild(filterOption);
                
                // Add to form dropdown
                const formOption = document.createElement('option');
                formOption.value = team.Team_ID;
                formOption.textContent = team.Team_Name;
                driverTeamField.appendChild(formOption);
            });
        })
        .catch(error => {
            console.error('Error loading teams:', error);
        });
}

/**
 * Load drivers data from API
 */
function loadDrivers() {
    // Show loader
    const tbody = driversTable.querySelector('tbody');
    tbody.innerHTML = '';
    tbody.appendChild(createLoader());
    
    fetch(`${API_BASE_URL}/drivers`)
        .then(response => response.json())
        .then(drivers => {
            displayDrivers(drivers);
            populateNationalityFilter(drivers);
        })
        .catch(error => {
            console.error('Error loading drivers:', error);
            tbody.innerHTML = '<tr><td colspan="9" class="error-message">Failed to load drivers data.</td></tr>';
        });
}

/**
 * Display drivers in the table
 */
function displayDrivers(drivers) {
    const tbody = driversTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    if (drivers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9">No drivers found.</td></tr>';
        return;
    }
    
    drivers.forEach(driver => {
        const row = document.createElement('tr');
        
        // Format contract end date
        let contractEndFormatted = '-';
        if (driver.Contract_End_Date) {
            const contractEnd = new Date(driver.Contract_End_Date);
            contractEndFormatted = contractEnd.toLocaleDateString();
        }
        
        row.innerHTML = `
            <td>${driver.Name}</td>
            <td>${driver.Age}</td>
            <td>${driver.Nationality}</td>
            <td>${driver.Team_Name}</td>
            <td>${driver.Number_of_Wins || 0}</td>
            <td>${driver.Pole_Positions || 0}</td>
            <td>${driver.Fastest_Laps || 0}</td>
            <td>${contractEndFormatted}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-button edit" data-id="${driver.Driver_ID}" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-button delete" data-id="${driver.Driver_ID}" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <button class="action-button view" data-id="${driver.Driver_ID}" title="View Performance">
                        <i class="fas fa-chart-line"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addDriverActionListeners();
}

/**
 * Add event listeners to driver action buttons
 */
function addDriverActionListeners() {
    // Edit buttons
    document.querySelectorAll('.drivers-table .action-button.edit').forEach(button => {
        button.addEventListener('click', () => {
            const driverId = button.getAttribute('data-id');
            editDriver(driverId);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.drivers-table .action-button.delete').forEach(button => {
        button.addEventListener('click', () => {
            const driverId = button.getAttribute('data-id');
            deleteDriver(driverId);
        });
    });
    
    // View performance buttons
    document.querySelectorAll('.drivers-table .action-button.view').forEach(button => {
        button.addEventListener('click', () => {
            const driverId = button.getAttribute('data-id');
            viewDriverPerformance(driverId);
        });
    });
}

/**
 * Set up driver-related event listeners
 */
function setupDriverEvents() {
    // Add driver button
    addDriverButton.addEventListener('click', () => {
        openDriverModal();
    });
    
    // Close modal buttons
    document.querySelectorAll('#driver-modal .close, #driver-modal .cancel-button').forEach(button => {
        button.addEventListener('click', () => {
            driverModal.style.display = 'none';
        });
    });
    
    // Submit driver form
    driverForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitDriverForm();
    });
    
    // Search input
    driverSearch.addEventListener('input', filterDrivers);
    
    // Team filter
    driverTeamFilter.addEventListener('change', filterDrivers);
    
    // Nationality filter
    driverNationalityFilter.addEventListener('change', filterDrivers);
}

/**
 * Open the driver modal for adding a new driver
 */
function openDriverModal() {
    // Reset form
    driverForm.reset();
    driverIdField.value = '';
    
    // Set default dates
    const today = new Date();
    driverContractStartField.value = formatDateForInput(today);
    driverContractEndField.value = formatDateForInput(new Date(today.getFullYear() + 2, today.getMonth(), today.getDate()));
    
    // Set modal title
    driverFormTitle.textContent = 'Add New Driver';
    
    // Show modal
    driverModal.style.display = 'block';
}

/**
 * Edit a driver
 * @param {number} driverId - ID of the driver to edit
 */
function editDriver(driverId) {
    // Show loader in the modal
    driverFormTitle.textContent = 'Edit Driver';
    driverForm.innerHTML = '';
    driverForm.appendChild(createLoader());
    driverModal.style.display = 'block';
    
    // Fetch driver data
    fetch(`${API_BASE_URL}/drivers/${driverId}`)
        .then(response => response.json())
        .then(driver => {
            // Restore form
            driverForm.innerHTML = `
                <input type="hidden" id="driver-id">
                <div class="form-row">
                    <div class="form-group">
                        <label for="driver-name">Name *</label>
                        <input type="text" id="driver-name" required>
                    </div>
                    <div class="form-group">
                        <label for="driver-age">Age *</label>
                        <input type="number" id="driver-age" min="16" max="65" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="driver-nationality">Nationality *</label>
                        <input type="text" id="driver-nationality" required>
                    </div>
                    <div class="form-group">
                        <label for="driver-team">Team *</label>
                        <select id="driver-team" required>
                            <option value="">Select Team</option>
                            <!-- Teams will be loaded here -->
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="driver-wins">Wins</label>
                        <input type="number" id="driver-wins" min="0" value="0">
                    </div>
                    <div class="form-group">
                        <label for="driver-salary">Salary (USD)</label>
                        <input type="number" id="driver-salary" min="0" step="100000">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="driver-contract-start">Contract Start</label>
                        <input type="date" id="driver-contract-start">
                    </div>
                    <div class="form-group">
                        <label for="driver-contract-end">Contract End</label>
                        <input type="date" id="driver-contract-end">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="driver-poles">Pole Positions</label>
                        <input type="number" id="driver-poles" min="0" value="0">
                    </div>
                    <div class="form-group">
                        <label for="driver-fastest-laps">Fastest Laps</label>
                        <input type="number" id="driver-fastest-laps" min="0" value="0">
                    </div>
                </div>
                <div class="form-buttons">
                    <button type="submit" class="save-button">Save</button>
                    <button type="button" class="cancel-button">Cancel</button>
                </div>
            `;
            
            // Get references to form elements again
            const driverIdField = document.getElementById('driver-id');
            const driverNameField = document.getElementById('driver-name');
            const driverAgeField = document.getElementById('driver-age');
            const driverNationalityField = document.getElementById('driver-nationality');
            const driverTeamField = document.getElementById('driver-team');
            const driverWinsField = document.getElementById('driver-wins');
            const driverSalaryField = document.getElementById('driver-salary');
            const driverContractStartField = document.getElementById('driver-contract-start');
            const driverContractEndField = document.getElementById('driver-contract-end');
            const driverPolesField = document.getElementById('driver-poles');
            const driverFastestLapsField = document.getElementById('driver-fastest-laps');
            
            // Reload teams for the dropdown
            loadTeamsForDropdown().then(() => {
                // Fill form with driver data
                driverIdField.value = driver.Driver_ID;
                driverNameField.value = driver.Name;
                driverAgeField.value = driver.Age;
                driverNationalityField.value = driver.Nationality;
                driverTeamField.value = driver.Team_ID;
                driverWinsField.value = driver.Number_of_Wins || 0;
                driverSalaryField.value = driver.Salary || '';
                
                if (driver.Contract_Start_Date) {
                    driverContractStartField.value = formatDateForInput(driver.Contract_Start_Date);
                }
                
                if (driver.Contract_End_Date) {
                    driverContractEndField.value = formatDateForInput(driver.Contract_End_Date);
                }
                
                driverPolesField.value = driver.Pole_Positions || 0;
                driverFastestLapsField.value = driver.Fastest_Laps || 0;
            });
            
            // Add event listener to cancel button
            document.querySelector('#driver-modal .cancel-button').addEventListener('click', () => {
                driverModal.style.display = 'none';
            });
        })
        .catch(error => {
            console.error('Error fetching driver:', error);
            driverModal.style.display = 'none';
            showToast('Failed to load driver data.', 'error');
        });
}

/**
 * Delete a driver
 * @param {number} driverId - ID of the driver to delete
 */
function deleteDriver(driverId) {
    // Show confirmation modal
    showConfirmModal(
        'Delete Driver',
        'Are you sure you want to delete this driver? This action cannot be undone.',
        () => {
            // Send delete request
            fetch(`${API_BASE_URL}/drivers/${driverId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => Promise.reject(data));
                }
                return response.json();
            })
            .then(data => {
                showToast(data.message || 'Driver deleted successfully.');
                loadDrivers();
            })
            .catch(error => {
                console.error('Error deleting driver:', error);
                showToast(error.message || 'Failed to delete driver.', 'error');
            });
        }
    );
}

/**
 * View driver performance
 * @param {number} driverId - ID of the driver
 */
function viewDriverPerformance(driverId) {
    // Redirect to reports tab
    document.querySelector('.nav-link[data-section="reports"]').click();
    
    // Show driver performance report
    const driverPerformanceButton = document.querySelector('.view-report-button[data-report="driver-performance"]');
    if (driverPerformanceButton) {
        driverPerformanceButton.click();
        
        // Dispatch custom event to load this specific driver's performance
        const event = new CustomEvent('loadDriverPerformance', { detail: { driverId } });
        document.dispatchEvent(event);
    }
}

/**
 * Submit the driver form
 */
function submitDriverForm() {
    const driverId = driverIdField.value;
    const driverData = {
        name: driverNameField.value,
        age: parseInt(driverAgeField.value),
        nationality: driverNationalityField.value,
        teamId: parseInt(driverTeamField.value),
        wins: driverWinsField.value ? parseInt(driverWinsField.value) : 0,
        salary: driverSalaryField.value ? parseFloat(driverSalaryField.value) : null,
        contractStartDate: driverContractStartField.value,
        contractEndDate: driverContractEndField.value,
        polePositions: driverPolesField.value ? parseInt(driverPolesField.value) : 0,
        fastestLaps: driverFastestLapsField.value ? parseInt(driverFastestLapsField.value) : 0
    };
    
    // Validate required fields
    if (!driverData.name || !driverData.age || !driverData.nationality || !driverData.teamId) {
        showToast('Name, age, nationality, and team are required.', 'error');
        return;
    }
    
    // Validate contract dates
    if (driverData.contractStartDate && driverData.contractEndDate) {
        const startDate = new Date(driverData.contractStartDate);
        const endDate = new Date(driverData.contractEndDate);
        
        if (endDate <= startDate) {
            showToast('Contract end date must be after contract start date.', 'error');
            return;
        }
    }
    
    // Determine if this is an update or create
    const isUpdate = !!driverId;
    const url = isUpdate ? `${API_BASE_URL}/drivers/${driverId}` : `${API_BASE_URL}/drivers`;
    const method = isUpdate ? 'PUT' : 'POST';
    
    // Send request
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(driverData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => Promise.reject(data));
        }
        return response.json();
    })
    .then(data => {
        showToast(data.message || (isUpdate ? 'Driver updated successfully.' : 'Driver created successfully.'));
        driverModal.style.display = 'none';
        loadDrivers();
    })
    .catch(error => {
        console.error('Error saving driver:', error);
        showToast(error.message || 'Failed to save driver.', 'error');
    });
}

/**
 * Filter drivers based on search, team, and nationality filters
 */
function filterDrivers() {
    const searchTerm = driverSearch.value.toLowerCase();
    const teamFilter = driverTeamFilter.value;
    const nationalityFilter = driverNationalityFilter.value.toLowerCase();
    
    // Get all rows
    const rows = driversTable.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const driverName = row.cells[0].textContent.toLowerCase();
        const driverNationality = row.cells[2].textContent.toLowerCase();
        const driverTeam = row.cells[3].textContent;
        
        // Find team ID from team name
        let teamId = '';
        for (let i = 0; i < driverTeamFilter.options.length; i++) {
            if (driverTeamFilter.options[i].textContent === driverTeam) {
                teamId = driverTeamFilter.options[i].value;
                break;
            }
        }
        
        // Check if row matches filters
        const matchesSearch = driverName.includes(searchTerm) || 
                             driverNationality.includes(searchTerm) ||
                             driverTeam.toLowerCase().includes(searchTerm);
                             
        const matchesTeam = !teamFilter || teamId === teamFilter;
        const matchesNationality = !nationalityFilter || driverNationality === nationalityFilter;
        
        // Show/hide row
        row.style.display = (matchesSearch && matchesTeam && matchesNationality) ? '' : 'none';
    });
}

/**
 * Populate nationality filter dropdown
 */
function populateNationalityFilter(drivers) {
    // Get unique nationalities
    const nationalities = [...new Set(drivers.map(driver => driver.Nationality))].sort();
    
    // Clear existing options (except the first one)
    while (driverNationalityFilter.options.length > 1) {
        driverNationalityFilter.remove(1);
    }
    
    // Add nationality options
    nationalities.forEach(nationality => {
        const option = document.createElement('option');
        option.value = nationality;
        option.textContent = nationality;
        driverNationalityFilter.appendChild(option);
    });
}
    