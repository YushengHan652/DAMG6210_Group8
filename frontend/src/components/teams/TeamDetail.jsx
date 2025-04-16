import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import apiService from '../../services/api';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import DriverCard from '../drivers/DriverCard';

const TeamDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch team details
  const { data: teamData, isLoading: teamLoading, error: teamError } = useQuery(
    ['team', id],
    () => apiService.getTeam(id)
  );

  // Fetch team drivers
  const { data: driversData, isLoading: driversLoading, error: driversError } = useQuery(
    ['teamDrivers', id],
    () => apiService.getTeamDrivers(id),
    {
      enabled: !!id,
    }
  );

  // Fetch team cars
  const { data: carsData, isLoading: carsLoading } = useQuery(
    ['teamCars', id],
    () => apiService.getTeamCars(id),
    {
      enabled: !!id && activeTab === 'cars'
    }
  );

  // Fetch team sponsorships
  const { data: sponsorshipsData, isLoading: sponsorshipsLoading } = useQuery(
    ['teamSponsorships', id],
    () => apiService.getTeamSponsorships(id),
    {
      enabled: !!id && activeTab === 'sponsors'
    }
  );

  // Fetch team staff
  const { data: staffData, isLoading: staffLoading } = useQuery(
    ['teamStaff', id],
    () => apiService.getTeamStaff(id),
    {
      enabled: !!id && activeTab === 'staff'
    }
  );

  if (teamLoading) {
    return <Loading message="Loading team details..." />;
  }

  if (teamError) {
    return <ErrorMessage message="Failed to load team details." />;
  }

  const team = teamData?.data;
  const drivers = Array.isArray(driversData?.data) ? driversData.data : [];
  const cars = carsData?.data?.results || [];
  const sponsorships = sponsorshipsData?.data?.results || [];
  const staff = staffData?.data?.results || [];

  console.log('Team:', team);
  console.log('Drivers:', drivers);
  console.log('First Driver:', drivers[0]);

  // Format budget to a readable string with currency symbol
  const formatBudget = (budget) => {
    if (!budget) return 'Not disclosed';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(budget);
  };

  // Determine team color based on team name
  const getTeamColor = (teamName) => {
    const teamColors = {
      'Red Bull Racing': '#0600EF',
      'Mercedes-AMG Petronas': '#00D2BE',
      'Scuderia Ferrari': '#DC0000',
      'McLaren Racing': '#FF8700',
      'Aston Martin': '#006F62',
      'Alpine F1 Team': '#0090FF',
      'Williams Racing': '#005AFF',
      'Visa Cash App RB': '#1E41FF',
      'Stake F1 Team Kick Sauber': '#900000',
      'MoneyGram Haas F1 Team': '#FFFFFF',
    };
    
    return teamColors[teamName] || '#333333';
  };

  return (
    <div className="team-detail-container">
      <div className="team-header" style={{ borderColor: getTeamColor(team.team_name) }}>
        <div className="team-header-content">
          <h1 className="team-name">{team.team_name}</h1>
          <div className="team-stats">
            <div className="team-stat">
              <span className="stat-value">{team.championships_won}</span>
              <span className="stat-label">Championships</span>
            </div>
            <div className="team-stat">
              <span className="stat-value">{team.founded_year || 'N/A'}</span>
              <span className="stat-label">Founded</span>
            </div>
            <div className="team-stat">
              <span className="stat-value">{team.team_country}</span>
              <span className="stat-label">Country</span>
            </div>
          </div>
        </div>
      </div>

      <div className="team-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'drivers' ? 'active' : ''}`}
          onClick={() => setActiveTab('drivers')}
        >
          Drivers
        </button>
        <button 
          className={`tab-button ${activeTab === 'cars' ? 'active' : ''}`}
          onClick={() => setActiveTab('cars')}
        >
          Cars
        </button>
        <button 
          className={`tab-button ${activeTab === 'staff' ? 'active' : ''}`}
          onClick={() => setActiveTab('staff')}
        >
          Staff
        </button>
        <button 
          className={`tab-button ${activeTab === 'sponsors' ? 'active' : ''}`}
          onClick={() => setActiveTab('sponsors')}
        >
          Sponsors
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="team-info-card">
              <h2>Team Information</h2>
              <div className="team-info-grid">
                <div className="info-item">
                  <span className="info-label">Team Principal</span>
                  <span className="info-value">{team.team_principal || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Founded</span>
                  <span className="info-value">{team.founded_year || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Country</span>
                  <span className="info-value">{team.team_country}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Budget</span>
                  <span className="info-value">{formatBudget(team.budget)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Championships</span>
                  <span className="info-value">{team.championships_won}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tire Supplier</span>
                  <span className="info-value">{team.tires_supplier || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="drivers-preview">
              <h2>Current Drivers</h2>
              {driversLoading ? (
                <Loading message="Loading drivers..." />
              ) : driversError ? (
                <ErrorMessage message="Failed to load drivers." />
              ) : drivers.length > 0 ? (
                <div className="drivers-grid">
                  {drivers.map(driver => (
                    <DriverCard key={driver.driver_id} driver={driver} />
                  ))}
                </div>
              ) : (
                <p className="no-data">No drivers found for this team</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'drivers' && (
          <div className="drivers-tab">
            <h2>Team Drivers</h2>
            {driversLoading ? (
              <Loading message="Loading drivers..." />
            ) : driversError ? (
              <ErrorMessage message="Failed to load drivers." />
            ) : drivers.length > 0 ? (
              <div className="drivers-grid">
                {drivers.map(driver => (
                  <DriverCard key={driver.driver_id} driver={driver} />
                ))}
              </div>
            ) : (
              <p className="no-data">No drivers found for this team</p>
            )}
          </div>
        )}

        {activeTab === 'cars' && (
          <div className="cars-tab">
            <h2>Team Cars</h2>
            {carsLoading ? (
              <Loading message="Loading cars..." />
            ) : cars.length > 0 ? (
              <div className="cars-table-container">
                <table className="cars-table">
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>Chassis</th>
                      <th>Engine</th>
                      <th>Weight (kg)</th>
                      <th>Horsepower</th>
                      <th>Aerodynamics</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars.map(car => (
                      <tr key={car.car_id}>
                        <td>{car.model}</td>
                        <td>{car.chassis}</td>
                        <td>{car.engine_manufacturer}</td>
                        <td>{car.weight}</td>
                        <td>{car.horsepower || 'N/A'}</td>
                        <td>{car.aerodynamics_package || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No cars found for this team</p>
            )}
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="staff-tab">
            <h2>Team Staff</h2>
            {staffLoading ? (
              <Loading message="Loading staff..." />
            ) : staff.length > 0 ? (
              <div className="staff-table-container">
                <table className="staff-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Nationality</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map(member => (
                      <tr key={member.staff_id}>
                        <td>{member.name}</td>
                        <td>{member.staff_type || 'Staff'}</td>
                        <td>{member.nationality || 'N/A'}</td>
                        <td>{member.employment_status || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No staff information available</p>
            )}
          </div>
        )}

        {activeTab === 'sponsors' && (
          <div className="sponsors-tab">
            <h2>Team Sponsors</h2>
            {sponsorshipsLoading ? (
              <Loading message="Loading sponsors..." />
            ) : sponsorships.length > 0 ? (
              <div className="sponsors-table-container">
                <table className="sponsors-table">
                  <thead>
                    <tr>
                      <th>Sponsor</th>
                      <th>Contract Value</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sponsorships.map(sponsorship => (
                      <tr key={sponsorship.contract_id}>
                        <td>{sponsorship.sponsor_name}</td>
                        <td>{formatBudget(sponsorship.contract_value)}</td>
                        <td>{new Date(sponsorship.contract_start).toLocaleDateString()}</td>
                        <td>{new Date(sponsorship.contract_end).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No sponsorship information available</p>
            )}
          </div>
        )}
      </div>

      <div className="back-link">
        <Link to="/teams">&larr; Back to Teams</Link>
      </div>

      <style jsx>{`
        .team-detail-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .team-header {
          margin-bottom: 30px;
          border-left: 8px solid;
          background-color: #f8f8f8;
          border-radius: 0 8px 8px 0;
          overflow: hidden;
        }
        
        .team-header-content {
          padding: 25px;
        }
        
        .team-name {
          margin-top: 0;
          margin-bottom: 20px;
          color: var(--secondary-color);
        }
        
        .team-stats {
          display: flex;
          gap: 30px;
        }
        
        .team-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: #666;
        }
        
        .team-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 20px;
        }
        
        .tab-button {
          padding: 12px 20px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-color);
          transition: color 0.2s ease, border-color 0.2s ease;
        }
        
        .tab-button:hover {
          color: var(--primary-color);
        }
        
        .tab-button.active {
          color: var(--primary-color);
          border-bottom-color: var(--primary-color);
        }
        
        .tab-content {
          margin-bottom: 30px;
        }
        
        .overview-tab {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .team-info-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }
        
        .team-info-card h2 {
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 1.2rem;
          color: var(--secondary-color);
        }
        
        .team-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
        }
        
        .info-label {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 5px;
        }
        
        .info-value {
          font-weight: 500;
        }
        
        .drivers-preview h2,
        .drivers-tab h2,
        .cars-tab h2,
        .staff-tab h2,
        .sponsors-tab h2 {
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 1.2rem;
          color: var(--secondary-color);
        }
        
        .drivers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        
        .cars-table-container,
        .staff-table-container,
        .sponsors-table-container {
          overflow-x: auto;
        }
        
        .cars-table,
        .staff-table,
        .sponsors-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .cars-table th,
        .cars-table td,
        .staff-table th,
        .staff-table td,
        .sponsors-table th,
        .sponsors-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }
        
        .cars-table th,
        .staff-table th,
        .sponsors-table th {
          background-color: var(--secondary-color);
          color: white;
          font-weight: 500;
        }
        
        .cars-table tr:hover,
        .staff-table tr:hover,
        .sponsors-table tr:hover {
          background-color: rgba(0, 0, 0, 0.02);
        }
        
        .no-data {
          padding: 20px;
          text-align: center;
          color: #666;
          font-style: italic;
          background-color: #f9f9f9;
          border-radius: 8px;
        }
        
        .back-link {
          margin-top: 30px;
        }
        
        .back-link a {
          color: var(--accent-color);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        
        .back-link a:hover {
          color: var(--primary-color);
          text-decoration: underline;
        }
        
        @media (max-width: 992px) {
          .overview-tab {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .team-tabs {
            flex-wrap: wrap;
          }
          
          .tab-button {
            flex: 1;
            min-width: 120px;
            padding: 10px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default TeamDetail;
