import React from 'react';
import { useParams, Link } from 'react-router-dom';
import DriverForm from './DriverForm';

const AddEditDriverPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;

  return (
    <div className="add-edit-driver-page">
      <div className="page-header">
        <h1>{isEditMode ? 'Edit Driver' : 'Add New Driver'}</h1>
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
      </div>
      
      <div className="form-container">
        <DriverForm driverId={id} />
      </div>

      <style jsx>{`
        .add-edit-driver-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .page-header {
          margin-bottom: 20px;
        }
        
        .page-header h1 {
          margin-top: 0;
          margin-bottom: 10px;
          color: var(--secondary-color);
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
        
        .form-container {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 1px;
        }
      `}</style>
    </div>
  );
};

export default AddEditDriverPage;
