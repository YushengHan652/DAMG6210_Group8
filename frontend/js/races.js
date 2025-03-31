/**
 * Races management JavaScript for F1 Management System
 */

// DOM Elements
const racesTable = document.getElementById('races-table');
const raceModal = document.getElementById('race-modal');
const raceForm = document.getElementById('race-form');
const raceFormTitle = document.getElementById('race-form-title');
const addRaceButton = document.getElementById('add-race-button');
const raceSearch = document.getElementById('race-search');
const raceSeasonFilter = document.getElementById('race-season-filter');
const raceCircuitFilter = document.getElementById('race-circuit-filter');

// Race Results Elements
const raceResultsModal = document.getElementById('race-results-modal');
const resultsTable = document.getElementById('results-table');
const raceResultsTitle = document.getElementById('race-results-title');
const raceInfoContainer = document.getElementById('race-info-container');
const addResultButton = document.getElementById('add-result-button');
const resultFormContainer = document.getElementById('result-form-container');
const resultForm = document.getElementById('result-form');
const resultFormTitle = document.getElementById('result-form-title');

// Race form fields
const raceIdField = document.getElementById('race-id');
const raceLocationField = document.getElementById('race-location');
const raceDateField = document.getElementById('race-date');
const raceSeasonField = document.getElementById('race-season');
const raceCircuitField = document.getElementById('race-circuit');
const raceWeatherField = document.getElementById('race-weather');
const raceLapsField = document.getElementById('race-laps');
const raceCircuitLengthField = document.getElementById('race-circuit-length');
const raceDistanceField = document.getElementById('race-distance');

// Result form fields
const resultIdField = document.getElementById('result-id');
const resultDriverField = document.getElementById('result-driver');
const resultPositionField = document.getElementById('result-position');
const resultPointsField = document.getElementById('result-points');
const resultPitstopsField = document.getElementById('result-pitstops');
const resultFastestLapField = document.getElementById('result-fastest-lap');
const resultOvertakesField = document.getElementById('result-overtakes');
const resultLapsField = document.getElementById('result-laps');
const resultStatusField = document.getElementById('result-status');

// Current race ID for results
let currentRaceId = null;

// Initialize races
document.addEventListener('DOMContentLoaded', () => {
    // Load seasons and circuits for dropdowns
    loadSeasonsForDropdown();
    loadCircuitsForDropdown();
    
    // Load races data
    loadRaces();
    
    // Set up event listeners
    setupRaceEvents();
    setupResultEvents();
});

/**
 * Load seasons for the season dropdowns
 */
function loadSeasonsForDropdown() {
    fetch(`${API_BASE_URL}/races/champions/all`)
        .then(response => response.json())
        .then(champions => {
            // Get unique seasons from champions data
            const seasons = [...new Set(champions.map(champion => champion.Year))].sort((a, b) => b - a);
            
            // Clear existing options (except the first one)
            while (raceSeasonFilter.options.length > 1) {
                raceSeasonFilter.remove(1);
            }
            
            while (raceSeasonField.options.length > 1) {
                raceSeasonField.remove(1);
            }
            
            // Add season options to filters
            seasons.forEach(year => {
                // Add to filter dropdown
                const filterOption = document.createElement('option');
                filterOption.value = year;
                filterOption.textContent = year;
                raceSeasonFilter.appendChild(filterOption);
                
                // Add to form dropdown with season ID
                const formOption = document.createElement('option');
                formOption.value = seasons.length - seasons.indexOf(year); // Simple mapping for demo
                formOption.textContent = year;
                raceSeasonField.appendChild(formOption);
            });
        })
        .catch(error => {
            console.error('Error loading seasons:', error);
        });
}

/**
 * Load circuits for the circuit dropdowns
 */
function loadCircuitsForDropdown() {
    // In a real application, you would have a circuits endpoint
    // For this demo, we'll use a simplified approach by extracting from races
    fetch(`${API_BASE_URL}/races`)
        .then(response => response.json())
        .then(races => {
            // Get unique circuits
            const circuits = [];
            const circuitIds = new Set();
            
            races.forEach(race => {
                if (!circuitIds.has(race.Circuit_ID)) {
                    circuitIds.add(race.Circuit_ID);
                    circuits.push({
                        id: race.Circuit_ID,
                        name: race.CircuitName
                    });
                }
            });
            
            // Sort circuits by name
            circuits.sort((a, b) => a.name.localeCompare(b.name));
            
            // Clear existing options (except the first one)
            while (raceCircuitFilter.options.length > 1) {
                raceCircuitFilter.remove(1);
            }
            
            while (raceCircuitField.options.length > 1) {
                raceCircuitField.remove(1);
            }
            
            // Add circuit options
            circuits.forEach(circuit => {
                // Add to filter dropdown
                const filterOption = document.createElement('option');
                filterOption.value = circuit.id;
                filterOption.textContent = circuit.name;
                raceCircuitFilter.appendChild(filterOption);
                
                // Add to form dropdown
                const formOption = document.createElement('option');
                formOption.value = circuit.id;
                formOption.textContent = circuit.name;
                raceCircuitField.appendChild(formOption);
            });
        })
        .catch(error => {
            console.error('Error loading circuits:', error);
        });
}

/**
 * Load races data from API
 */
function loadRaces() {
    // Show loader
    const tbody = racesTable.querySelector('tbody');
    tbody.innerHTML = '';
    tbody.appendChild(createLoader());
    
    fetch(`${API_BASE_URL}/races`)
        .then(response => response.json())
        .then(races => {
            displayRaces(races);
        })
        .catch(error => {
            console.error('Error loading races:', error);
            tbody.innerHTML = '<tr><td colspan="8" class="error-message">Failed to load races data.</td></tr>';
        });
}

/**
 * Display races in the table
 */
function displayRaces(races) {
    const tbody = racesTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    if (races.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8">No races found.</td></tr>';
        return;
    }
    
    // Sort races by date (most recent first)
    const sortedRaces = [...races].sort((a, b) => new Date(b.Date) - new Date(a.Date));
    
    sortedRaces.forEach(race => {
        const row = document.createElement('tr');
        
        // Format date
        const raceDate = new Date(race.Date).toLocaleDateString();
        
        row.innerHTML = `
            <td>${race.Location}</td>
            <td>${race.CircuitName}</td>
            <td>${raceDate}</td>
            <td>${race.SeasonYear}</td>
            <td>${race.Weather_Condition || '-'}</td>
            <td>${race.Number_of_Laps}</td>
            <td>${race.Race_Distance.toFixed(3)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-button edit" data-id="${race.Race_ID}" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-button delete" data-id="${race.Race_ID}" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <button class="action-button view" data-id="${race.Race_ID}" title="View Results">
                        <i class="fas fa-trophy"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addRaceActionListeners();
}

/**
 * Add event listeners to race action buttons
 */
function addRaceActionListeners() {
    // Edit buttons
    document.querySelectorAll('.races-table .action-button.edit').forEach(button => {
        button.addEventListener('click', () => {
            const raceId = button.getAttribute('data-id');
            editRace(raceId);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.races-table .action-button.delete').forEach(button => {
        button.addEventListener('click', () => {
            const raceId = button.getAttribute('data-id');
            deleteRace(raceId);
        });
    });
    
    // View results buttons
    document.querySelectorAll('.races-table .action-button.view').forEach(button => {
        button.addEventListener('click', () => {
            const raceId = button.getAttribute('data-id');
            viewRaceResults(raceId);
        });
    });
}

/**
 * Set up race-related event listeners
 */
function setupRaceEvents() {
    // Add race button
    addRaceButton.addEventListener('click', () => {
        openRaceModal();
    });
    
    // Close modal buttons
    document.querySelectorAll('#race-modal .close, #race-modal .cancel-button').forEach(button => {
        button.addEventListener('click', () => {
            raceModal.style.display = 'none';
        });
    });
    
    // Submit race form
    raceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitRaceForm();
    });
    
    // Search input
    raceSearch.addEventListener('input', filterRaces);
    
    // Season filter
    raceSeasonFilter.addEventListener('change', filterRaces);
    
    // Circuit filter
    raceCircuitFilter.addEventListener('change', filterRaces);
    
    // Auto-calculate race distance when laps or circuit length changes
    raceLapsField.addEventListener('input', calculateRaceDistance);
    raceCircuitLengthField.addEventListener('input', calculateRaceDistance);
}

/**
 * Set up result-related event listeners
 */
function setupResultEvents() {
    // Close results modal
    document.querySelectorAll('#race-results-modal .close').forEach(button => {
        button.addEventListener('click', () => {
            raceResultsModal.style.display = 'none';
            currentRaceId = null;
        });
    });
    
    // Add result button
    addResultButton.addEventListener('click', () => {
        openResultForm();
    });
    
    // Cancel result form
    document.querySelector('.cancel-result-button').addEventListener('click', () => {
        resultFormContainer.style.display = 'none';
    });
    
    // Submit result form
    resultForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitResultForm();
    });
}

/**
 * Open the race modal for adding a new race
 */
function openRaceModal() {
    // Reset form
    raceForm.reset();
    raceIdField.value = '';
    
    // Set default date to today
    raceDateField.value = formatDateForInput(new Date());
    
    // Set modal title
    raceFormTitle.textContent = 'Add New Race';
    
    // Show modal
    raceModal.style.display = 'block';
}

/**
 * Edit a race
 * @param {number} raceId - ID of the race to edit
 */
function editRace(raceId) {
    // Show loader in modal
    raceFormTitle.textContent = 'Edit Race';
    raceForm.innerHTML = '';
    raceForm.appendChild(createLoader());
    raceModal.style.display = 'block';
    
    // Fetch race data
    fetch(`${API_BASE_URL}/races/${raceId}`)
        .then(response => response.json())
        .then(race => {
            // Restore form
            raceForm.innerHTML = `
                <input type="hidden" id="race-id">
                <div class="form-row">
                    <div class="form-group">
                        <label for="race-location">Location *</label>
                        <input type="text" id="race-location" required>
                    </div>
                    <div class="form-group">
                        <label for="race-date">Date *</label>
                        <input type="date" id="race-date" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="race-season">Season *</label>
                        <select id="race-season" required>
                            <option value="">Select Season</option>
                            <!-- Seasons will be loaded here -->
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="race-circuit">Circuit *</label>
                        <select id="race-circuit" required>
                            <option value="">Select Circuit</option>
                            <!-- Circuits will be loaded here -->
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="race-weather">Weather Condition</label>
                        <select id="race-weather">
                            <option value="">Select Weather</option>
                            <option value="Sunny">Sunny</option>
                            <option value="Cloudy">Cloudy</option>
                            <option value="Rainy">Rainy</option>
                            <option value="Clear">Clear</option>
                            <option value="Wet">Wet</option>
                            <option value="Dry">Dry</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="race-laps">Number of Laps *</label>
                        <input type="number" id="race-laps" min="1" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="race-circuit-length">Circuit Length (km) *</label>
                        <input type="number" id="race-circuit-length" min="0.1" step="0.001" required>
                    </div>
                    <div class="form-group">
                        <label for="race-distance">Race Distance (km) *</label>
                        <input type="number" id="race-distance" min="0.1" step="0.001" required>
                    </div>
                </div>
                <div class="form-buttons">
                    <button type="submit" class="save-button">Save</button>
                    <button type="button" class="cancel-button">Cancel</button>
                </div>
            `;
            
            // Get references to form elements again
            const raceIdField = document.getElementById('race-id');
            const raceLocationField = document.getElementById('race-location');
            const raceDateField = document.getElementById('race-date');
            const raceSeasonField = document.getElementById('race-season');
            const raceCircuitField = document.getElementById('race-circuit');
            const raceWeatherField = document.getElementById('race-weather');
            const raceLapsField = document.getElementById('race-laps');
            const raceCircuitLengthField = document.getElementById('race-circuit-length');
            const raceDistanceField = document.getElementById('race-distance');
            
            // Load dropdowns
            loadSeasonsForDropdown();
            loadCircuitsForDropdown();
            
            // Add event listener to cancel button
            document.querySelector('#race-modal .cancel-button').addEventListener('click', () => {
                raceModal.style.display = 'none';
            });
            
            // Add event listeners for race distance calculation
            raceLapsField.addEventListener('input', calculateRaceDistance);
            raceCircuitLengthField.addEventListener('input', calculateRaceDistance);
            
            // Fill form with race data
            raceIdField.value = race.Race_ID;
            raceLocationField.value = race.Location;
            raceDateField.value = formatDateForInput(race.Date);
            
            // Need to wait for dropdowns to be populated
            setTimeout(() => {
                raceSeasonField.value = race.Season_ID;
                raceCircuitField.value = race.Circuit_ID;
                raceWeatherField.value = race.Weather_Condition || '';
                raceLapsField.value = race.Number_of_Laps;
                raceCircuitLengthField.value = race.Circuit_Length;
                raceDistanceField.value = race.Race_Distance;
            }, 500);
        })
        .catch(error => {
            console.error('Error fetching race:', error);
            raceModal.style.display = 'none';
            showToast('Failed to load race data.', 'error');
        });
}

/**
 * Delete a race
 * @param {number} raceId - ID of the race to delete
 */
function deleteRace(raceId) {
    // Show confirmation modal
    showConfirmModal(
        'Delete Race',
        'Are you sure you want to delete this race? This action cannot be undone.',
        () => {
            // Send delete request
            fetch(`${API_BASE_URL}/races/${raceId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => Promise.reject(data));
                }
                return response.json();
            })
            .then(data => {
                showToast(data.message || 'Race deleted successfully.');
                loadRaces();
            })
            .catch(error => {
                console.error('Error deleting race:', error);
                showToast(error.message || 'Failed to delete race.', 'error');
            });
        }
    );
}

/**
 * View race results
 * @param {number} raceId - ID of the race
 */
function viewRaceResults(raceId) {
    currentRaceId = raceId;
    
    // Show loader in modal
    raceInfoContainer.innerHTML = '';
    raceInfoContainer.appendChild(createLoader());
    resultsTable.querySelector('tbody').innerHTML = '';
    resultFormContainer.style.display = 'none';
    raceResultsModal.style.display = 'block';
    
    // Fetch race data
    fetch(`${API_BASE_URL}/races/${raceId}`)
        .then(response => response.json())
        .then(race => {
            // Set modal title
            raceResultsTitle.textContent = `Results: ${race.Location} (${new Date(race.Date).toLocaleDateString()})`;
            
            // Display race info
            displayRaceInfo(race);
            
            // Load race results
            loadRaceResults(raceId);
            
            // Load drivers for result form
            loadDriversForResultForm();
        })
        .catch(error => {
            console.error('Error fetching race:', error);
            raceResultsModal.style.display = 'none';
            showToast('Failed to load race data.', 'error');
        });
}

/**
 * Display race information
 * @param {Object} race - Race data
 */
function displayRaceInfo(race) {
    raceInfoContainer.innerHTML = `
        <div class="race-info-item">
            <h4>Location</h4>
            <p>${race.Location}</p>
        </div>
        <div class="race-info-item">
            <h4>Circuit</h4>
            <p>${race.CircuitName}</p>
        </div>
        <div class="race-info-item">
            <h4>Date</h4>
            <p>${new Date(race.Date).toLocaleDateString()}</p>
        </div>
        <div class="race-info-item">
            <h4>Season</h4>
            <p>${race.SeasonYear}</p>
        </div>
        <div class="race-info-item">
            <h4>Weather</h4>
            <p>${race.Weather_Condition || '-'}</p>
        </div>
        <div class="race-info-item">
            <h4>Laps</h4>
            <p>${race.Number_of_Laps}</p>
        </div>
        <div class="race-info-item">
            <h4>Circuit Length</h4>
            <p>${race.Circuit_Length.toFixed(3)} km</p>
        </div>
        <div class="race-info-item">
            <h4>Race Distance</h4>
            <p>${race.Race_Distance.toFixed(3)} km</p>
        </div>
    `;
}

/**
 * Load race results
 * @param {number} raceId - ID of the race
 */
function loadRaceResults(raceId) {
    const tbody = resultsTable.querySelector('tbody');
    tbody.innerHTML = '';
    tbody.appendChild(createLoader());
    
    fetch(`${API_BASE_URL}/races/${raceId}/results`)
        .then(response => response.json())
        .then(results => {
            displayRaceResults(results);
        })
        .catch(error => {
            console.error('Error loading race results:', error);
            tbody.innerHTML = '<tr><td colspan="9" class="error-message">Failed to load race results.</td></tr>';
        });
}

/**
 * Display race results in the table
 * @param {Array} results - Race results
 */
function displayRaceResults(results) {
    const tbody = resultsTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    if (results.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9">No results found for this race.</td></tr>';
        return;
    }
    
    // Sort by position (finishers first, then DNFs)
    const sortedResults = [...results].sort((a, b) => {
        if (a.Final_Position === null && b.Final_Position === null) return 0;
        if (a.Final_Position === null) return 1;
        if (b.Final_Position === null) return -1;
        return a.Final_Position - b.Final_Position;
    });
    
    sortedResults.forEach(result => {
        const row = document.createElement('tr');
        
        // Format fastest lap
        let fastestLap = '-';
        if (result.Fastest_Lap_Time) {
            const minutes = Math.floor(result.Fastest_Lap_Time / 60);
            const seconds = (result.Fastest_Lap_Time % 60).toFixed(3);
            fastestLap = `${minutes}:${seconds.padStart(6, '0')}`;
        }
        
        row.innerHTML = `
            <td>${result.Final_Position || '-'}</td>
            <td>${result.DriverName}</td>
            <td>${result.Team_Name}</td>
            <td>${result.Points_Scored.toFixed(1)}</td>
            <td>${result.Pit_Stops || '-'}</td>
            <td>${fastestLap}</td>
            <td>${result.Laps_Completed || '-'} / ${raceLapsField.value}</td>
            <td>${result.DNF_Status}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-button edit" data-id="${result.Result_ID}" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-button delete" data-id="${result.Result_ID}" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addResultActionListeners();
}

/**
 * Add event listeners to result action buttons
 */
function addResultActionListeners() {
    // Edit buttons
    document.querySelectorAll('#results-table .action-button.edit').forEach(button => {
        button.addEventListener('click', () => {
            const resultId = button.getAttribute('data-id');
            editResult(resultId);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('#results-table .action-button.delete').forEach(button => {
        button.addEventListener('click', () => {
            const resultId = button.getAttribute('data-id');
            deleteResult(resultId);
        });
    });
}

/**
 * Load drivers for the result form dropdown
 */
function loadDriversForResultForm() {
    fetch(`${API_BASE_URL}/drivers`)
        .then(response => response.json())
        .then(drivers => {
            // Sort drivers by name
            const sortedDrivers = [...drivers].sort((a, b) => a.Name.localeCompare(b.Name));
            
            // Clear existing options (except the first one)
            while (resultDriverField.options.length > 1) {
                resultDriverField.remove(1);
            }
            
            // Add driver options
            sortedDrivers.forEach(driver => {
                const option = document.createElement('option');
                option.value = driver.Driver_ID;
                option.textContent = `${driver.Name} (${driver.Team_Name})`;
                resultDriverField.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading drivers:', error);
        });
}

/**
 * Open the result form for adding a new result
 */
function openResultForm() {
    // Reset form
    resultForm.reset();
    resultIdField.value = '';
    
    // Set default values
    resultPointsField.value = '0';
    resultStatusField.value = 'Completed';
    
    // Set form title
    resultFormTitle.textContent = 'Add Race Result';
    
    // Show form
    resultFormContainer.style.display = 'block';
}

/**
 * Edit a race result
 * @param {number} resultId - ID of the result to edit
 */
function editResult(resultId) {
    // Reset form
    resultForm.reset();
    resultIdField.value = resultId;
    
    // Set form title
    resultFormTitle.textContent = 'Edit Race Result';
    
    // Find result in table
    const row = Array.from(resultsTable.querySelectorAll('tbody tr')).find(row => {
        const editButton = row.querySelector('.action-button.edit');
        return editButton && editButton.getAttribute('data-id') === resultId;
    });
    
    if (row) {
        // Extract data from row
        const position = row.cells[0].textContent;
        const driverName = row.cells[1].textContent;
        const points = row.cells[3].textContent;
        const pitStops = row.cells[4].textContent;
        const fastestLap = row.cells[5].textContent;
        const lapsCompleted = row.cells[6].textContent.split(' / ')[0];
        const status = row.cells[7].textContent;
        
        // Find driver in dropdown
        for (let i = 0; i < resultDriverField.options.length; i++) {
            if (resultDriverField.options[i].textContent.includes(driverName)) {
                resultDriverField.selectedIndex = i;
                break;
            }
        }
        
        // Fill form fields
        resultPositionField.value = position !== '-' ? position : '';
        resultPointsField.value = points;
        resultPitstopsField.value = pitStops !== '-' ? pitStops : '';
        
        // Parse fastest lap (format: m:ss.sss)
        if (fastestLap !== '-') {
            const parts = fastestLap.split(':');
            const minutes = parseInt(parts[0]);
            const seconds = parseFloat(parts[1]);
            resultFastestLapField.value = (minutes * 60 + seconds).toFixed(3);
        } else {
            resultFastestLapField.value = '';
        }
        
        resultOvertakesField.value = ''; // Not displayed in table
        resultLapsField.value = lapsCompleted !== '-' ? lapsCompleted : '';
        resultStatusField.value = status;
    }
    
    // Show form
    resultFormContainer.style.display = 'block';
}

/**
 * Delete a race result
 * @param {number} resultId - ID of the result to delete
 */
function deleteResult(resultId) {
    // Show confirmation modal
    showConfirmModal(
        'Delete Result',
        'Are you sure you want to delete this race result? This action cannot be undone.',
        () => {
            // Send delete request
            fetch(`${API_BASE_URL}/races/results/${resultId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => Promise.reject(data));
                }
                return response.json();
            })
            .then(data => {
                showToast(data.message || 'Result deleted successfully.');
                loadRaceResults(currentRaceId);
            })
            .catch(error => {
                console.error('Error deleting result:', error);
                showToast(error.message || 'Failed to delete result.', 'error');
            });
        }
    );
}

/**
 * Submit the race form
 */
function submitRaceForm() {
    const raceId = raceIdField.value;
    const raceData = {
        seasonId: parseInt(raceSeasonField.value),
        location: raceLocationField.value,
        date: raceDateField.value,
        weatherCondition: raceWeatherField.value,
        circuitId: parseInt(raceCircuitField.value),
        circuitLength: parseFloat(raceCircuitLengthField.value),
        numberOfLaps: parseInt(raceLapsField.value),
        raceDistance: parseFloat(raceDistanceField.value)
    };
    
    // Validate required fields
    if (!raceData.location || !raceData.date || !raceData.seasonId || !raceData.circuitId ||
        !raceData.circuitLength || !raceData.numberOfLaps || !raceData.raceDistance) {
        showToast('Please fill in all required fields.', 'error');
        return;
    }
    
    // Determine if this is an update or create
    const isUpdate = !!raceId;
    const url = isUpdate ? `${API_BASE_URL}/races/${raceId}` : `${API_BASE_URL}/races`;
    const method = isUpdate ? 'PUT' : 'POST';
    
    // Send request
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(raceData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => Promise.reject(data));
        }
        return response.json();
    })
    .then(data => {
        showToast(data.message || (isUpdate ? 'Race updated successfully.' : 'Race created successfully.'));
        raceModal.style.display = 'none';
        loadRaces();
    })
    .catch(error => {
        console.error('Error saving race:', error);
        showToast(error.message || 'Failed to save race.', 'error');
    });
}

/**
 * Submit the result form
 */
function submitResultForm() {
    const resultId = resultIdField.value;
    const resultData = {
        driverId: parseInt(resultDriverField.value),
        finalPosition: resultPositionField.value ? parseInt(resultPositionField.value) : null,
        pointsScored: resultPointsField.value ? parseFloat(resultPointsField.value) : 0,
        pitStops: resultPitstopsField.value ? parseInt(resultPitstopsField.value) : null,
        fastestLapTime: resultFastestLapField.value ? parseFloat(resultFastestLapField.value) : null,
        overtakesMade: resultOvertakesField.value ? parseInt(resultOvertakesField.value) : null,
        lapsCompleted: resultLapsField.value ? parseInt(resultLapsField.value) : null,
        dnfStatus: resultStatusField.value
    };
    
    // Validate required fields
    if (!resultData.driverId) {
        showToast('Please select a driver.', 'error');
        return;
    }
    
    // Determine if this is an update or create
    const isUpdate = !!resultId;
    const url = isUpdate ? 
        `${API_BASE_URL}/races/results/${resultId}` : 
        `${API_BASE_URL}/races/${currentRaceId}/results`;
    const method = isUpdate ? 'PUT' : 'POST';
    
    // Send request
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resultData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => Promise.reject(data));
        }
        return response.json();
    })
    .then(data => {
        showToast(data.message || (isUpdate ? 'Result updated successfully.' : 'Result added successfully.'));
        resultFormContainer.style.display = 'none';
        loadRaceResults(currentRaceId);
    })
    .catch(error => {
        console.error('Error saving result:', error);
        showToast(error.message || 'Failed to save result.', 'error');
    });
}

/**
 * Filter races based on search, season, and circuit filters
 */
function filterRaces() {
    const searchTerm = raceSearch.value.toLowerCase();
    const seasonFilter = raceSeasonFilter.value;
    const circuitFilter = raceCircuitFilter.value;
    
    // Get all rows
    const rows = racesTable.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const location = row.cells[0].textContent.toLowerCase();
        const circuit = row.cells[1].textContent;
        const date = row.cells[2].textContent;
        const season = row.cells[3].textContent;
        
        // Check if row matches filters
        const matchesSearch = location.includes(searchTerm) || 
                             circuit.toLowerCase().includes(searchTerm) ||
                             date.toLowerCase().includes(searchTerm) ||
                             season.toLowerCase().includes(searchTerm);
                             
        const matchesSeason = !seasonFilter || season === seasonFilter;
        
        let matchesCircuit = true;
        if (circuitFilter) {
            // Find circuit ID from circuit name
            for (let i = 0; i < raceCircuitFilter.options.length; i++) {
                if (raceCircuitFilter.options[i].textContent === circuit) {
                    matchesCircuit = raceCircuitFilter.options[i].value === circuitFilter;
                    break;
                }
            }
        }
        
        // Show/hide row
        row.style.display = (matchesSearch && matchesSeason && matchesCircuit) ? '' : 'none';
    });
}

/**
 * Calculate race distance based on laps and circuit length
 */
function calculateRaceDistance() {
    const laps = raceLapsField.value;
    const circuitLength = raceCircuitLengthField.value;
    
    if (laps && circuitLength) {
        const distance = parseFloat(laps) * parseFloat(circuitLength);
        raceDistanceField.value = distance.toFixed(3);
    }
}