import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import apiService from '../../services/api';

const DriverForm = ({ onSuccess }) => {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!driverId;
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    nationality: '',
    team: '',
    number_of_wins: 0,
    pole_positions: 0,
    fastest_laps: 0,
    salary: '',
    contract_start_date: '',
    contract_end_date: ''
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
          team: driver.team || '',
          number_of_wins: driver.number_of_wins || 0,
          pole_positions: driver.pole_positions || 0,
          fastest_laps: driver.fastest_laps || 0,
          salary: driver.salary || '',
          contract_start_date: formattedStartDate,
          contract_end_date: formattedEndDate
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
        
        // Extract validation errors if available
        if (error.response?.data) {
          setFormErrors(error.response.data);
        }
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
        
        // Extract validation errors if available
        if (error.response?.data) {
          setFormErrors(error.response.data);
        }
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
    if (!formData.nationality) errors.nationality = 'Nationality is required';
    if (!formData.team) errors.team = 'Team is required';
    
    // Validate age range
    if (formData.age && (formData.age < 16 || formData.age > 65)) {
      errors.age = 'Age must be between 16 and 65';
    }
    
    // Validate contract dates
    if (formData.contract_start_date && formData.contract_end_date) {
      if (new Date(formData.contract_end_date) <= new Date(formData.contract_start_date)) {
        errors.contract_end_date = 'End date must be after start date';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveError(null);
    
    if (!validateForm()) return;
    
    // Convert numeric fields from strings to numbers
    const formattedData = {
      ...formData,
      age: Number(formData.age),
      number_of_wins: Number(formData.number_of_wins),
      pole_positions: Number(formData.pole_positions),
      fastest_laps: Number(formData.fastest_laps)
    };
    
    // Only include salary if it's not empty
    if (formData.salary) {
      formattedData.salary = Number(formData.salary);
    }
    
    // Send the data to the API
    if (isEditMode) {
      updateDriverMutation.mutate(formattedData);
    } else {
      createDriverMutation.mutate(formattedData);
    }
  };
  
  const isLoading = teamsLoading || (isEditMode && driverLoading);
  const isSaving = createDriverMutation.isLoading || updateDriverMutation.isLoading;
  
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  
  return (
    <div className="driver-form-container">
      <h2>{isEditMode ? 'Edit Driver' : 'Add New Driver'}</h2>
      
      {saveError && (
        <div className="error-message">
          {saveError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="driver-form">
        <div className="form-group">
          <label htmlFor="name">Driver Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={formErrors.name ? 'error' : ''}
          />
          {formErrors.name && <div className="field-error">{formErrors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="16"
            max="65"
            className={formErrors.age ? 'error' : ''}
          />
          {formErrors.age && <div className="field-error">{formErrors.age}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="nationality">Nationality</label>
          <input
            type="text"
            id="nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            className={formErrors.nationality ? 'error' : ''}
          />
          {formErrors.nationality && <div className="field-error">{formErrors.nationality}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="team">Team</label>
          <select
            id="team"
            name="team"
            value={formData.team}
            onChange={handleChange}
            className={formErrors.team ? 'error' : ''}
          >
            <option value="">Select a team</option>
            {teamsData?.data?.map(team => (
              <option key={team.team_id} value={team.team_id}>
                {team.team_name}
              </option>
            ))}
          </select>
          {formErrors.team && <div className="field-error">{formErrors.team}</div>}
        </div>
        
        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="contract_start_date">Contract Start Date</label>
            <input
              type="date"
              id="contract_start_date"
              name="contract_start_date"
              value={formData.contract_start_date}
              onChange={handleChange}
              className={formErrors.contract_start_date ? 'error' : ''}
            />
            {formErrors.contract_start_date && 
              <div className="field-error">{formErrors.contract_start_date}</div>}
          </div>
          
          <div className="form-group half">
            <label htmlFor="contract_end_date">Contract End Date</label>
            <input
              type="date"
              id="contract_end_date"
              name="contract_end_date"
              value={formData.contract_end_date}
              onChange={handleChange}
              className={formErrors.contract_end_date ? 'error' : ''}
            />
            {formErrors.contract_end_date && 
              <div className="field-error">{formErrors.contract_end_date}</div>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="salary">Salary (USD)</label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            min="0"
            step="1000"
            className={formErrors.salary ? 'error' : ''}
          />
          {formErrors.salary && <div className="field-error">{formErrors.salary}</div>}
        </div>
        
        <h3>Career Statistics</h3>
        
        <div className="form-row">
          <div className="form-group third">
            <label htmlFor="number_of_wins">Race Wins</label>
            <input
              type="number"
              id="number_of_wins"
              name="number_of_wins"
              value={formData.number_of_wins}
              onChange={handleChange}
              min="0"
              className={formErrors.number_of_wins ? 'error' : ''}
            />
            {formErrors.number_of_wins && 
              <div className="field-error">{formErrors.number_of_wins}</div>}
          </div>
          
          <div className="form-group third">
            <label htmlFor="pole_positions">Pole Positions</label>
            <input
              type="number"
              id="pole_positions"
              name="pole_positions"
              value={formData.pole_positions}
              onChange={handleChange}
              min="0"
              className={formErrors.pole_positions ? 'error' : ''}
            />
            {formErrors.pole_positions && 
              <div className="field-error">{formErrors.pole_positions}</div>}
          </div>
          
          <div className="form-group third">
            <label htmlFor="fastest_laps">Fastest Laps</label>
            <input
              type="number"
              id="fastest_laps"
              name="fastest_laps"
              value={formData.fastest_laps}
              onChange={handleChange}
              min="0"
              className={formErrors.fastest_laps ? 'error' : ''}
            />
            {formErrors.fastest_laps && 
              <div className="field-error">{formErrors.fastest_laps}</div>}
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => navigate('/drivers')}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : (isEditMode ? 'Update Driver' : 'Add Driver')}
          </button>
        </div>
      </form>
      
      <style jsx>{`
        .driver-form-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 25px;
          margin-bottom: 30px;
        }
        
        .driver-form-container h2 {
          margin-top: 0;
          margin-bottom: 20px;
          color: var(--primary-color);
        }
        
        .driver-form-container h3 {
          margin-top: 25px;
          margin-bottom: 15px;
          font-size: 1.2rem;
          color: var(--text-color);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 8px;
        }
        
        .driver-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .form-row {
          display: flex;
          gap: 15px;
        }
        
        .half {
          width: 50%;
        }
        
        .third {
          width: 33.333%;
        }
        
        label {
          margin-bottom: 5px;
          font-weight: 500;
          color: var(--text-color);
          font-size: 0.9rem;
        }
        
        input, select {
          padding: 10px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 1rem;
        }
        
        input.error, select.error {
          border-color: #e74c3c;
        }
        
        .field-error {
          color: #e74c3c;
          font-size: 0.8rem;
          margin-top: 5px;
        }
        
        .error-message {
          background-color: #fdeaea;
          border: 1px solid #e74c3c;
          color: #e74c3c;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
        
        button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        
        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .btn-primary {
          background-color: var(--primary-color);
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background-color: var(--primary-color-dark);
        }
        
        .btn-secondary {
          background-color: #f1f1f1;
          color: var(--text-color);
        }
        
        .btn-secondary:hover:not(:disabled) {
          background-color: #e1e1e1;
        }
        
        .loading {
          text-align: center;
          padding: 40px;
          font-style: italic;
          color: #888;
        }
      `}</style>
    </div>
  );
};

export default DriverForm;
