// frontend/src/components/teams/TeamForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';

const TeamForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    team_name: '',
    team_country: '',
    team_principal: '',
    budget: '',
    tires_supplier: 'Pirelli',
    championships_won: 0,
    founded_year: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.createTeam(formData);
      navigate('/teams');
    } catch (err) {
      setError('Failed to create team. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="team-form-container">
      <h2>Add New Team</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="team_name">Team Name</label>
          <input
            type="text"
            id="team_name"
            name="team_name"
            value={formData.team_name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="team_country">Country</label>
          <input
            type="text"
            id="team_country"
            name="team_country"
            value={formData.team_country}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="team_principal">Team Principal</label>
          <input
            type="text"
            id="team_principal"
            name="team_principal"
            value={formData.team_principal}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="budget">Budget (USD)</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="championships_won">Championships Won</label>
          <input
            type="number"
            id="championships_won"
            name="championships_won"
            value={formData.championships_won}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="founded_year">Founded Year</label>
          <input
            type="number"
            id="founded_year"
            name="founded_year"
            value={formData.founded_year}
            onChange={handleChange}
          />
        </div>
        
        <button type="submit" className="submit-btn">Create Team</button>
      </form>
    </div>
  );
};

export default TeamForm;