import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const DriverForm = ({ driverId = null, onSuccess }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!driverId;
  
  // Initial form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    nationality: '',
    team_id: '',
    number_of_wins: 0,
    salary: '',
    contract_start_date: '',
    contract_end_date: '',
    pole_positions: 0,
    fastest_laps: 0
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [saveError, setSaveError] = useState(null);
  
  // Fetch teams for dropdown
  const { data: teamsData, isLoading: teamsLoading } = useQuery(
    'teams',
    () => apiService.getTeams(),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
  
  // If editing, fetch driver details
  const { data: driverData, isLoading: driverLoading } = useQuery(
    ['driver', driverId],
    () => apiService.getDriver(driverId),
    {
      enabled: isEditMode,
      onSuccess: (data) => {
        const driver = data.data;
        // Format dates for form inputs
        const formattedStartDate = driver.contract_start_date ? 
          new Date(driver.contract_start_date).toISOString().split('T')[0] : '';
        const formattedEndDate = driver.contract_end_date ? 
          new Date(driver.contract_end_date).toISOString().split('T')[0] : '';
          
        setFormData({
          name: driver.name || '',
          age: driver.age || '',
          nationality: driver.nationality || '',
          team_id: driver.team_id || '',
          number_of_wins: driver.number_of_wins || 0,
          salary: driver.salary || '',
          contract_start_date: formattedStartDate,
          contract_end_date: formattedEndDate,
          pole_positions: driver.pole_positions || 0,
          fastest_laps: driver.fastest_laps || 0
        });
      }
    }
  );
  
  // Create mutation for adding a driver
  const createDriverMutation = useMutation(
    (driverData) => apiService.createDriver(driverData),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('drivers');
        if (onSuccess) {
          onSuccess(data.data);
        } else {
          navigate(`/drivers/${data.data.driver_id}`);
        }
      },
      onError: (error) => {
        setSaveError(error.response?.data?.message || 'Failed to create driver');
        console.error('Error creating driver:', error);
      }
    }
  );
  
  // Update mutation for editing a driver
  const updateDriverMutation = useMutation(
    (driverData) => apiService.updateDriver(driverId, driverData),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['driver', driverId]);
        queryClient.invalidateQueries('drivers');
        if (onSuccess) {
          onSuccess(data.data);
        } else {
          navigate(`/drivers/${driverId}`);
        }
      },
      onError: (error) => {
        setSaveError(error.response?.data?.message || 'Failed to update driver');
        console.error('Error updating driver:', error);
      }
    }
  );
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user changes it
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.age) errors.age = 'Age is required';
    else if (formData.age < 16 || formData.age > 65) errors.age = 'Age must be between 16 and 65';
    if (!formData.nationality) errors.nationality = 'Nationality is required';
    if (!formData.team_id) errors.team_id = 'Team is required';
    
    // Contract end date must be after start date
    if (formData.contract_start_date && formData.contract_end_date) {
      const startDate = new Date(formData.contract_start_date);
      const endDate = new Date(formData.contract_end_date);
      if (endDate <= startDate) {
        errors.contract_end_date = 'Contract end date must be after start date';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveError(null);
    
    if (!validateForm()) return;
    
    // Convert string values to appropriate types
    const processedData = {
      ...formData,
      age: parseInt(formData.age, 10),
      team_id: parseInt(formData.team_id, 10),
      number_of_wins: parseInt(formData.number_of_wins, 10),
      pole_positions: parseInt(formData.pole_positions, 10),
      fastest_laps: parseInt(formData.fastest_laps, 10),
      salary: formData.salary ? parseFloat(formData.salary) : null
    };
    
    if (isEditMode) {
      updateDriverMutation.mutate(processedData);
    } else {
      createDriverMutation.mutate(processedData);
    }
  };
  
  if (isEditMode && driverLoading) {
    return <Loading message="Loading driver data..." />;
  }
  
  if (teamsLoading) {
    return <Loading message="Loading teams..." />;
  }
  
  const teams = teamsData?.data.results || [];
  const isSubmitting = createDriverMutation.isLoading || updateDriverMutation.isLoading;

  return (
    <div className="driver-form-container">
      <h2 className="form-title">{isEditMode ? 'Edit Driver' : 'Add New Driver'}</h2>
      
      {saveError && (
        <div className="form-error-message">
          <p>{saveError}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="driver-form">
        <div className="form-section">
          <h3 className="section-title">Basic Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Driver Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={formErrors.name ? 'input-error' : ''}
                disabled={isSubmitting}
              />
              {formErrors.name && <div className="error-text">{formErrors.name}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="age">Age*</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="16"
                max="65"
                className={formErrors.age ? 'input-error' : ''}
                disabled={isSubmitting}
              />
              {formErrors.age && <div className="error-text">{formErrors.age}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nationality">Nationality*</label>
              <input
                type="text"
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className={formErrors.nationality ? 'input-error' : ''}
                disabled={isSubmitting}
              />
              {formErrors.nationality && <div className="error-text">{formErrors.nationality}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="team_id">Team*</label>
              <select
                id="team_id"
                name="team_id"
                value={formData.team_id}
                onChange={handleChange}
                className={formErrors.team_id ? 'input-error' : ''}
                disabled={isSubmitting}
              >
                <option value="">Select a team</option>
                {teams.map(team => (
                  <option key={team.team_id} value={team.team_id}>
                    {team.team_name}
                  </option>
                ))}
              </select>
              {formErrors.team_id && <div className="error-text">{formErrors.team_id}</div>}
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3 className="section-title">Contract Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="salary">Salary (USD)</label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                step="100000"
                min="0"
                placeholder="e.g., 5000000"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contract_start_date">Contract Start Date</label>
              <input
                type="date"
                id="contract_start_date"
                name="contract_start_date"
                value={formData.contract_start_date}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contract_end_date">Contract End Date</label>
              <input
                type="date"
                id="contract_end_date"
                name="contract_end_date"
                value={formData.contract_end_date}
                onChange={handleChange}
                className={formErrors.contract_end_date ? 'input-error' : ''}
                disabled={isSubmitting}
              />
              {formErrors.contract_end_date && (
                <div className="error-text">{formErrors.contract_end_date}</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3 className="section-title">Statistics</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="number_of_wins">Race Wins</label>
              <input
                type="number"
                id="number_of_wins"
                name="number_of_wins"
                value={formData.number_of_wins}
                onChange={handleChange}
                min="0"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="pole_positions">Pole Positions</label>
              <input
                type="number"
                id="pole_positions"
                name="pole_positions"
                value={formData.pole_positions}
                onChange={handleChange}
                min="0"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fastest_laps">Fastest Laps</label>
              <input
                type="number"
                id="fastest_laps"
                name="fastest_laps"
                value={formData.fastest_laps}
                onChange={handleChange}
                min="0"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Driver' : 'Add Driver'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .driver-form-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .form-title {
          margin-top: 0;
          margin-bottom: 20px;
          color: var(--secondary-color);
          font-size: 1.5rem;
        }
        
        .form-error-message {
          padding: 12px 15px;
          background-color: #fff0f0;
          border: 1px solid var(--danger-color);
          border-radius: 4px;
          margin-bottom: 20px;
          color: var(--danger-color);
        }
        
        .form-error-message p {
          margin: 0;
        }
        
        .form-section {
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .section-title {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 1.1rem;
          color: var(--secondary-color);
        }
        
        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .form-group label {
          margin-bottom: 5px;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .form-group input,
        .form-group select {
          padding: 10px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .form-group input:focus,
        .form-group select:focus {
          border-color: var(--accent-color);
          outline: none;
          box-shadow: 0 0 0 2px rgba(0, 144, 208, 0.2);
        }
        
        .input-error {
          border-color: var(--danger-color) !important;
        }
        
        .error-text {
          color: var(--danger-color);
          font-size: 0.8rem;
          margin-top: 5px;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
        
        .cancel-button,
        .submit-button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .cancel-button {
          background-color: #f0f0f0;
          color: #666;
        }
        
        .cancel-button:hover {
          background-color: #e0e0e0;
        }
        
        .submit-button {
          background-color: var(--primary-color);
          color: white;
        }
        
        .submit-button:hover {
          background-color: #c00500;
        }
        
        .cancel-button:disabled,
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column-reverse;
          }
          
          .cancel-button,
          .submit-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default DriverForm;
