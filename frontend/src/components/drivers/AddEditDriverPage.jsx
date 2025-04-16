import React from 'react';
import { useParams, Link } from 'react-router-dom';
import DriverForm from './DriverForm';

const AddEditDriverPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;

  return (
    <div className="page-container">
      <h1 className="page-title">{isEditMode ? 'Edit Driver' : 'Add New Driver'}</h1>
      <div className="page-links">
        <Link to="/drivers" className="back-link">
          &larr; Back to Drivers
        </Link>
        {isEditMode && (
          <Link to={`/drivers/${id}`} className="view-link">
            View Driver Profile
          </Link>
        )}
      </div>
      <div className="page-content">
        <DriverForm driverId={id} />
      </div>
      
      <style jsx>{`
        .page-container {
          padding: 20px;
        }
        
        .page-title {
          margin-bottom: 20px;
          color: var(--primary-color);
        }
        
        .page-links {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .back-link,
        .view-link {
          color: var(--accent-color);
          text-decoration: none;
        }
        
        .back-link:hover,
        .view-link:hover {
          color: var(--primary-color);
          text-decoration: underline;
        }
        
        .page-content {
          max-width: 800px;
        }
      `}</style>
    </div>
  );
};

export default AddEditDriverPage;
