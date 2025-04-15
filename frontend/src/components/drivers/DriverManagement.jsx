import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const DriverManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [teamFilter, setTeamFilter] = useState('');
  const [page, setPage] = useState(1);

  // Fetch drivers with pagination
  const { data, isLoading, error, refetch } = useQuery(
    ['drivers', { page, sort: sortBy, team: teamFilter }],
    () => apiService.getDrivers({ 
      page,
      ordering: sortBy,
      team: teamFilter || undefined 
    }),
    {
      keepPreviousData: true,
    }
  );

  // Fetch teams for filter dropdown
  const { data: teamsData } = useQuery(
    'teams',
    () => apiService.getTeams(),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Delete driver mutation
  const deleteDriverMutation = useMutation(
    (driverId) => apiService.deleteDriver(driverId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('drivers');
        setShowDeleteModal(false);
        setSelectedDriver(null);
      },
      onError: (error) => {
        console.error('Error deleting driver:', error);
      }
    }
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1); // Reset to first page on sort change
  };

  const handleTeamFilterChange = (e) => {
    setTeamFilter(e.target.value);
    setPage(1); // Reset to first page on filter change
  };

  const handleDeleteClick = (driver) => {
    setSelectedDriver(driver);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedDriver) {
      deleteDriverMutation.mutate(selectedDriver.driver_id);
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedDriver(null);
  };

  // Filter drivers based on search term
  const filteredDrivers = data?.data.results
    ? data.data.results.filter(driver => 
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.team_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const teams = teamsData?.data.results || [];
  const totalPages = data?.data.count ? Math.ceil(data.data.count / 20) : 0; // Assuming 20 items per page

  return (
    <div className="driver-management-container">
      <div className="page-header">
        <h1 className="page-title">Driver Management</h1>
        <div className="page-actions">
          <Link to="/drivers/new" className="add-driver-btn">
            Add New Driver
          </Link>
        </div>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search drivers..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="filter-options">
          <div className="filter-option">
            <label htmlFor="team-select">Team:</label>
            <select
              id="team-select"
              value={teamFilter}
              onChange={handleTeamFilterChange}
              className="filter-select"
            >
              <option value="">All Teams</option>
              {teams.map(team => (
                <option key={team.team_id} value={team.team_id}>
                  {team.team_name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-option">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={handleSortChange}
              className="filter-select"
            >
              <option value="name">Name</option>
              <option value="-number_of_wins">Wins</option>
              <option value="-pole_positions">Pole Positions</option>
              <option value="-fastest_laps">Fastest Laps</option>
              <option value="nationality">Nationality</option>
              <option value="age">Age</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Loading message="Loading drivers..." />
      ) : error ? (
        <ErrorMessage 
          message="Failed to load drivers. Please try again." 
          onRetry={refetch}
        />
      ) : (
        <>
          <div className="drivers-table-container">
            <table className="drivers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Team</th>
                  <th>Nationality</th>
                  <th>Age</th>
                  <th>Wins</th>
                  <th>Contract Until</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.length > 0 ? (
                  filteredDrivers.map(driver => (
                    <tr key={driver.driver_id}>
                      <td>
                        <Link to={`/drivers/${driver.driver_id}`} className="driver-name-link">
                          {driver.name}
                        </Link>
                      </td>
                      <td>
                        <Link to={`/teams/${driver.team_id}`}>
                          {driver.team_name}
                        </Link>
                      </td>
                      <td>{driver.nationality}</td>
                      <td>{driver.age}</td>
                      <td>{driver.number_of_wins}</td>
                      <td>
                        {driver.contract_end_date 
                          ? new Date(driver.contract_end_date).toLocaleDateString() 
                          : 'N/A'}
                      </td>
                      <td className="actions-cell">
                        <Link 
                          to={`/drivers/${driver.driver_id}/edit`} 
                          className="edit-button"
                          title="Edit driver"
                        >
                          Edit
                        </Link>
                        <button 
                          className="delete-button"
                          onClick={() => handleDeleteClick(driver)}
                          title="Delete driver"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-results">
                      No drivers match your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-button"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <button 
                className="pagination-button"
                onClick={() => setPage(p => p < totalPages ? p + 1 : p)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Confirm Deletion</h3>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete the driver: 
                <strong> {selectedDriver?.name}</strong>?
              </p>
              <p className="warning-text">
                This action cannot be undone. All associated race entries and results will also be deleted.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-button"
                onClick={closeDeleteModal}
                disabled={deleteDriverMutation.isLoading}
              >
                Cancel
              </button>
              <button 
                className="delete-button"
                onClick={confirmDelete}
                disabled={deleteDriverMutation.isLoading}
              >
                {deleteDriverMutation.isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .driver-management-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .page-title {
          color: var(--secondary-color);
          margin: 0;
        }
        
        .add-driver-btn {
          display: inline-block;
          padding: 10px 15px;
          background-color: var(--primary-color);
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }
        
        .add-driver-btn:hover {
          background-color: #c00500;
          color: white;
        }
        
        .filters {
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 8px;
        }
        
        .search-box {
          margin-bottom: 15px;
        }
        
        .search-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 14px;
        }
        
        .filter-options {
          display: flex;
          gap: 15px;
        }
        
        .filter-option {
          display: flex;
          align-items: center;
        }
        
        .filter-option label {
          margin-right: 10px;
          font-size: 14px;
        }
        
        .filter-select {
          padding: 8px 12px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 14px;
          background-color: white;
          min-width: 150px;
        }
        
        .drivers-table-container {
          overflow-x: auto;
          margin-bottom: 20px;
        }
        
        .drivers-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .drivers-table th,
        .drivers-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }
        
        .drivers-table th {
          background-color: var(--secondary-color);
          color: white;
          font-weight: 500;
        }
        
        .drivers-table tbody tr:hover {
          background-color: rgba(0, 0, 0, 0.02);
        }
        
        .driver-name-link {
          color: var(--text-color);
          font-weight: 500;
          text-decoration: none;
        }
        
        .driver-name-link:hover {
          color: var(--primary-color);
          text-decoration: underline;
        }
        
        .actions-cell {
          white-space: nowrap;
        }
        
        .edit-button,
        .delete-button {
          display: inline-block;
          padding: 6px 12px;
          margin-right: 5px;
          border-radius: 4px;
          font-size: 0.9rem;
          text-decoration: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .edit-button {
          background-color: var(--accent-color);
          color: white;
          border: none;
        }
        
        .edit-button:hover {
          background-color: #007bb3;
          color: white;
        }
        
        .delete-button {
          background-color: var(--danger-color);
          color: white;
          border: none;
        }
        
        .delete-button:hover {
          background-color: #c0392b;
        }
        
        .no-results {
          text-align: center;
          padding: 20px;
          color: #666;
          font-style: italic;
        }
        
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
        }
        
        .pagination-button {
          padding: 8px 15px;
          border: 1px solid var(--border-color);
          background-color: white;
          cursor: pointer;
          border-radius: 4px;
          font-size: 0.9rem;
          transition: background-color 0.2s ease;
        }
        
        .pagination-button:hover:not(:disabled) {
          background-color: #f0f0f0;
        }
        
        .pagination-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        
        .page-info {
          margin: 0 15px;
          font-size: 0.9rem;
        }
        
        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal-container {
          background-color: white;
          border-radius: 8px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .modal-header {
          padding: 15px 20px;
          background-color: var(--secondary-color);
          color: white;
        }
        
        .modal-header h3 {
          margin: 0;
          font-size: 1.2rem;
        }
        
        .modal-body {
          padding: 20px;
        }
        
        .warning-text {
          color: var(--danger-color);
          font-size: 0.9rem;
        }
        
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          padding: 15px 20px;
          background-color: #f5f5f5;
          border-top: 1px solid var(--border-color);
        }
        
        .modal-footer .cancel-button,
        .modal-footer .delete-button {
          padding: 8px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          margin-left: 10px;
        }
        
        .modal-footer .cancel-button {
          background-color: #e0e0e0;
          color: #333;
        }
        
        .modal-footer .cancel-button:hover {
          background-color: #d0d0d0;
        }
        
        .modal-footer .delete-button:disabled,
        .modal-footer .cancel-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .filter-options {
            flex-direction: column;
            gap: 10px;
          }
          
          .filter-option {
            width: 100%;
          }
          
          .filter-select {
            flex: 1;
          }
          
          .edit-button,
          .delete-button {
            padding: 4px 8px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DriverManagement;
