/**
 * Reports and analytics JavaScript for F1 Management System
 */

// DOM Elements
const reportButtons = document.querySelectorAll('.view-report-button');
const reportContainer = document.getElementById('report-container');
const reportTitle = document.getElementById('report-title');
const reportFilters = document.getElementById('report-filters');
const reportContent = document.getElementById('report-content');

// Current report type
let currentReportType = null;

// Initialize reports
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners
    setupReportEvents();
    
    // Listen for loadDriverPerformance event
    document.addEventListener('loadDriverPerformance', (e) => {
        const driverId = e.detail.driverId;
        loadDriverPerformanceReport(driverId);
    });
});

/**
 * Set up report-related event listeners
 */
function setupReportEvents() {
    // Report buttons
    reportButtons.forEach(button => {
        button.addEventListener('click', () => {
            const reportType = button.getAttribute('data-report');
            loadReport(reportType);
        });
    });
}

/**
 * Load a report
 * @param {string} reportType - Type of report to load
 */
function loadReport(reportType) {
    currentReportType = reportType;
    
    // Show report container
    reportContainer.style.display = 'block';
    
    // Clear and show loader
    reportContent.innerHTML = '';
    reportContent.appendChild(createLoader());
    reportFilters.innerHTML = '';
    
    // Set report title and load data
    switch (reportType) {
        case 'driver-performance':
            reportTitle.textContent = 'Driver Performance Report';
            loadDriverPerformanceReport();
            break;
        case 'team-drivers':
            reportTitle.textContent = 'Team Drivers Report';
            loadTeamDriversReport();
            break;
        case 'season-champions':
            reportTitle.textContent = 'Season Champions Report';
            loadSeasonChampionsReport();
            break;
        case 'team-budgets':
            reportTitle.textContent = 'Team Budgets Report';
            loadTeamBudgetsReport();
            break;
        default:
            reportContent.innerHTML = '<p class="error-message">Unknown report type.</p>';
            return;
    }
}

/**
 * Load driver performance report
 * @param {number} [selectedDriverId] - Optional driver ID to pre-select
 */
function loadDriverPerformanceReport(selectedDriverId) {
    // Create filter
    reportFilters.innerHTML = `
        <label for="driver-filter">Select Driver:</label>
        <select id="driver-filter">
            <option value="">All Drivers</option>
        </select>
    `;
    
    // Get the driver filter
    const driverFilter = document.getElementById('driver-filter');
    
    // Load drivers
    fetch(`${API_BASE_URL}/drivers`)
        .then(response => response.json())
        .then(drivers => {
            // Sort drivers by name
            const sortedDrivers = [...drivers].sort((a, b) => a.Name.localeCompare(b.Name));
            
            // Add driver options
            sortedDrivers.forEach(driver => {
                const option = document.createElement('option');
                option.value = driver.Driver_ID;
                option.textContent = `${driver.Name} (${driver.Team_Name})`;
                driverFilter.appendChild(option);
            });
            
            // Set selected driver if provided
            if (selectedDriverId) {
                driverFilter.value = selectedDriverId;
            }
            
            // Add event listener
            driverFilter.addEventListener('change', () => {
                loadDriverPerformanceData(driverFilter.value);
            });
            
            // Load data
            loadDriverPerformanceData(driverFilter.value);
        })
        .catch(error => {
            console.error('Error loading drivers:', error);
            reportContent.innerHTML = '<p class="error-message">Failed to load drivers data.</p>';
        });
}

/**
 * Load driver performance data
 * @param {number} driverId - ID of the driver to load performance for
 */
function loadDriverPerformanceData(driverId) {
    // Show loader
    reportContent.innerHTML = '';
    reportContent.appendChild(createLoader());
    
    const url = driverId ? 
        `${API_BASE_URL}/drivers/${driverId}/performance` : 
        `${API_BASE_URL}/teams/1/performance`; // Default to first team's drivers
    
    fetch(url)
        .then(response => response.json())
        .then(performanceData => {
            displayDriverPerformance(performanceData);
        })
        .catch(error => {
            console.error('Error loading driver performance:', error);
            reportContent.innerHTML = '<p class="error-message">Failed to load performance data.</p>';
        });
}

/**
 * Display driver performance data
 * @param {Array} performanceData - Driver performance data
 */
function displayDriverPerformance(performanceData) {
    if (performanceData.length === 0) {
        reportContent.innerHTML = '<p>No performance data available for the selected driver.</p>';
        return;
    }
    
    // Group by driver if multiple drivers
    const groupedByDriver = {};
    
    performanceData.forEach(item => {
        if (!groupedByDriver[item.Driver_Name]) {
            groupedByDriver[item.Driver_Name] = [];
        }
        groupedByDriver[item.Driver_Name].push(item);
    });
    
    reportContent.innerHTML = '';
    
    // For each driver, create a performance table
    for (const driverName in groupedByDriver) {
        const driverData = groupedByDriver[driverName];
        
        // Create section heading
        const driverHeading = document.createElement('h3');
        driverHeading.textContent = driverName;
        reportContent.appendChild(driverHeading);
        
        // Create table
        const table = document.createElement('table');
        table.className = 'data-table';
        
        // Create headers
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Race ID</th>
                <th>Final Position</th>
                <th>Points Scored</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // Create body
        const tbody = document.createElement('tbody');
        
        // Sort by race ID (assuming higher ID = more recent)
        driverData.sort((a, b) => b.Race_ID - a.Race_ID);
        
        driverData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.Race_ID}</td>
                <td>${item.Final_Position || '-'}</td>
                <td>${item.Points_Scored.toFixed(1)}</td>
            `;
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        reportContent.appendChild(table);
        
        // Add summary
        const summary = document.createElement('div');
        summary.className = 'report-summary';
        
        // Calculate statistics
        const totalPoints = driverData.reduce((sum, item) => sum + item.Points_Scored, 0);
        const averagePoints = totalPoints / driverData.length;
        const bestPosition = Math.min(...driverData.filter(item => item.Final_Position).map(item => item.Final_Position));
        
        summary.innerHTML = `
            <p><strong>Total Races:</strong> ${driverData.length}</p>
            <p><strong>Total Points:</strong> ${totalPoints.toFixed(1)}</p>
            <p><strong>Average Points per Race:</strong> ${averagePoints.toFixed(2)}</p>
            <p><strong>Best Position:</strong> ${isFinite(bestPosition) ? bestPosition : '-'}</p>
        `;
        
        reportContent.appendChild(summary);
        
        // Add margin between drivers
        if (Object.keys(groupedByDriver).length > 1) {
            const divider = document.createElement('hr');
            reportContent.appendChild(divider);
        }
    }
}

/**
 * Load team drivers report
 */
function loadTeamDriversReport() {
    // Create filter
    reportFilters.innerHTML = `
        <label for="team-filter">Select Team:</label>
        <select id="team-filter">
            <option value="">All Teams</option>
        </select>
    `;
    
    // Get the team filter
    const teamFilter = document.getElementById('team-filter');
    
    // Load teams
    fetch(`${API_BASE_URL}/teams`)
        .then(response => response.json())
        .then(teams => {
            // Sort teams by name
            const sortedTeams = [...teams].sort((a, b) => a.Team_Name.localeCompare(b.Team_Name));
            
            // Add team options
            sortedTeams.forEach(team => {
                const option = document.createElement('option');
                option.value = team.Team_ID;
                option.textContent = team.Team_Name;
                teamFilter.appendChild(option);
            });
            
            // Add event listener
            teamFilter.addEventListener('change', () => {
                loadTeamDriversData(teamFilter.value);
            });
            
            // Load data for all teams initially
            loadTeamDriversData('');
        })
        .catch(error => {
            console.error('Error loading teams:', error);
            reportContent.innerHTML = '<p class="error-message">Failed to load teams data.</p>';
        });
}

/**
 * Load team drivers data
 * @param {number} teamId - ID of the team to load drivers for
 */
function loadTeamDriversData(teamId) {
    // Show loader
    reportContent.innerHTML = '';
    reportContent.appendChild(createLoader());
    
    const url = teamId ? 
        `${API_BASE_URL}/teams/${teamId}/drivers` : 
        `${API_BASE_URL}/drivers`; // All drivers
    
    fetch(url)
        .then(response => response.json())
        .then(driversData => {
            displayTeamDrivers(driversData);
        })
        .catch(error => {
            console.error('Error loading team drivers:', error);
            reportContent.innerHTML = '<p class="error-message">Failed to load drivers data.</p>';
        });
}

/**
 * Display team drivers data
 * @param {Array} driversData - Team drivers data
 */
function displayTeamDrivers(driversData) {
    if (driversData.length === 0) {
        reportContent.innerHTML = '<p>No drivers data available for the selected team.</p>';
        return;
    }
    
    // Group by team if multiple teams
    const groupedByTeam = {};
    
    driversData.forEach(driver => {
        const teamName = driver.Team_Name;
        if (!groupedByTeam[teamName]) {
            groupedByTeam[teamName] = [];
        }
        groupedByTeam[teamName].push(driver);
    });
    
    reportContent.innerHTML = '';
    
    // For each team, create a drivers table
    for (const teamName in groupedByTeam) {
        const teamDrivers = groupedByTeam[teamName];
        
        // Create section heading
        const teamHeading = document.createElement('h3');
        teamHeading.textContent = teamName;
        reportContent.appendChild(teamHeading);
        
        // Create table
        const table = document.createElement('table');
        table.className = 'data-table';
        
        // Create headers
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Driver</th>
                <th>Nationality</th>
                <th>Salary ($)</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // Create body
        const tbody = document.createElement('tbody');
        
        // Sort alphabetically
        teamDrivers.sort((a, b) => a.Driver_Name.localeCompare(b.Driver_Name));
        
        teamDrivers.forEach(driver => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${driver.Driver_Name}</td>
                <td>${driver.Nationality}</td>
                <td>${driver.Salary ? formatCurrency(driver.Salary) : '-'}</td>
            `;
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        reportContent.appendChild(table);
        
        // Add summary
        const summary = document.createElement('div');
        summary.className = 'report-summary';
        
        // Calculate statistics
        const totalDrivers = teamDrivers.length;
        const totalSalary = teamDrivers.reduce((sum, driver) => sum + (driver.Salary || 0), 0);
        const averageSalary = totalSalary / totalDrivers;
        
        summary.innerHTML = `
            <p><strong>Total Drivers:</strong> ${totalDrivers}</p>
            <p><strong>Total Salary:</strong> ${formatCurrency(totalSalary)}</p>
            <p><strong>Average Salary:</strong> ${formatCurrency(averageSalary)}</p>
        `;
        
        reportContent.appendChild(summary);
        
        // Add margin between teams
        if (Object.keys(groupedByTeam).length > 1) {
            const divider = document.createElement('hr');
            reportContent.appendChild(divider);
        }
    }
}

/**
 * Load season champions report
 */
function loadSeasonChampionsReport() {
    // Show loader
    reportContent.innerHTML = '';
    reportContent.appendChild(createLoader());
    
    fetch(`${API_BASE_URL}/races/champions/all`)
        .then(response => response.json())
        .then(championsData => {
            displaySeasonChampions(championsData);
        })
        .catch(error => {
            console.error('Error loading season champions:', error);
            reportContent.innerHTML = '<p class="error-message">Failed to load champions data.</p>';
        });
}

/**
 * Display season champions data
 * @param {Array} championsData - Season champions data
 */
function displaySeasonChampions(championsData) {
    if (championsData.length === 0) {
        reportContent.innerHTML = '<p>No champions data available.</p>';
        return;
    }
    
    // Sort by year (descending)
    const sortedChampions = [...championsData].sort((a, b) => b.Year - a.Year);
    
    // Create table
    const table = document.createElement('table');
    table.className = 'data-table';
    
    // Create headers
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Year</th>
            <th>Champion Team</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Create body
    const tbody = document.createElement('tbody');
    
    sortedChampions.forEach(champion => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${champion.Year}</td>
            <td>${champion.Champion_Team}</td>
        `;
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    
    // Create a table container
    const tableContainer = document.createElement('div');
    tableContainer.className = 'table-container';
    tableContainer.appendChild(table);
    
    // Create a summary
    const summary = document.createElement('div');
    summary.className = 'report-summary';
    
    // Count championships by team
    const teamChampionships = {};
    sortedChampions.forEach(champion => {
        const team = champion.Champion_Team;
        teamChampionships[team] = (teamChampionships[team] || 0) + 1;
    });
    
    // Sort teams by number of championships
    const sortedTeams = Object.entries(teamChampionships)
        .sort((a, b) => b[1] - a[1])
        .map(([team, count]) => `${team}: ${count}`);
    
    summary.innerHTML = `
        <h4>Championships by Team</h4>
        <ul>
            ${sortedTeams.map(team => `<li>${team}</li>`).join('')}
        </ul>
    `;
    
    // Clear and append content
    reportContent.innerHTML = '';
    reportContent.appendChild(tableContainer);
    reportContent.appendChild(summary);
}

/**
 * Load team budgets report
 */
function loadTeamBudgetsReport() {
    // Show loader
    reportContent.innerHTML = '';
    reportContent.appendChild(createLoader());
    
    // Load teams data
    fetch(`${API_BASE_URL}/teams`)
        .then(response => response.json())
        .then(teamsData => {
            displayTeamBudgets(teamsData);
        })
        .catch(error => {
            console.error('Error loading team budgets:', error);
            reportContent.innerHTML = '<p class="error-message">Failed to load teams data.</p>';
        });
}

/**
 * Display team budgets data
 * @param {Array} teamsData - Teams data
 */
function displayTeamBudgets(teamsData) {
    if (teamsData.length === 0) {
        reportContent.innerHTML = '<p>No teams data available.</p>';
        return;
    }
    
    // Sort by budget (descending)
    const sortedTeams = [...teamsData]
        .filter(team => team.Budget) // Filter out teams without budget
        .sort((a, b) => b.Budget - a.Budget);
    
    // Create table
    const table = document.createElement('table');
    table.className = 'data-table';
    
    // Create headers
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Team</th>
            <th>Budget ($)</th>
            <th>Championships</th>
            <th>Budget per Championship ($)</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Create body
    const tbody = document.createElement('tbody');
    
    sortedTeams.forEach(team => {
        const budgetPerChampionship = team.Championships_Won > 0 ? 
            team.Budget / team.Championships_Won : 
            'N/A';
        
        const formattedBudgetPerChampionship = 
            budgetPerChampionship === 'N/A' ? 'N/A' : formatCurrency(budgetPerChampionship);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${team.Team_Name}</td>
            <td>${formatCurrency(team.Budget)}</td>
            <td>${team.Championships_Won}</td>
            <td>${formattedBudgetPerChampionship}</td>
        `;
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    
    // Create a table container
    const tableContainer = document.createElement('div');
    tableContainer.className = 'table-container';
    tableContainer.appendChild(table);
    
    // Create a summary
    const summary = document.createElement('div');
    summary.className = 'report-summary';
    
    // Calculate statistics
    const totalBudget = sortedTeams.reduce((sum, team) => sum + team.Budget, 0);
    const averageBudget = totalBudget / sortedTeams.length;
    const maxBudget = sortedTeams[0].Budget;
    const minBudget = sortedTeams[sortedTeams.length - 1].Budget;
    
    summary.innerHTML = `
        <h4>Budget Statistics</h4>
        <p><strong>Total Budget (All Teams):</strong> ${formatCurrency(totalBudget)}</p>
        <p><strong>Average Budget:</strong> ${formatCurrency(averageBudget)}</p>
        <p><strong>Highest Budget:</strong> ${formatCurrency(maxBudget)} (${sortedTeams[0].Team_Name})</p>
        <p><strong>Lowest Budget:</strong> ${formatCurrency(minBudget)} (${sortedTeams[sortedTeams.length - 1].Team_Name})</p>
        <p><strong>Budget Range:</strong> ${formatCurrency(maxBudget - minBudget)}</p>
    `;
    
    // Get average budget for teams founded before 2000
    fetch(`${API_BASE_URL}/teams?foundedBeforeYear=2000`)
        .then(response => response.json())
        .then(data => {
            // The API endpoint might not exist, so this is just a demonstration
            if (data && data.averageBudget) {
                const avgBudgetElement = document.createElement('p');
                avgBudgetElement.innerHTML = `<strong>Average Budget (Teams Founded Before 2000):</strong> ${formatCurrency(data.averageBudget)}`;
                summary.appendChild(avgBudgetElement);
            }
        })
        .catch(error => {
            console.error('Error loading average budget:', error);
        });
    
    // Clear and append content
    reportContent.innerHTML = '';
    reportContent.appendChild(tableContainer);
    reportContent.appendChild(summary);
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