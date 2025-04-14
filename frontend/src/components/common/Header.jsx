import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Navbar from './Navbar';

const Header = () => {
  const { currentSeason } = useAppContext();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-logo">
            <Link to="/">
              <h1>F1 Management</h1>
              {currentSeason && (
                <span className="season-badge">{currentSeason.year} Season</span>
              )}
            </Link>
          </div>
          <Navbar />
        </div>
      </div>

      <style jsx>{`
        .header {
          background-color: var(--secondary-color);
          color: var(--light-text-color);
          padding: 15px 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .header-logo a {
          display: flex;
          align-items: center;
          color: var(--light-text-color);
          text-decoration: none;
        }
        
        .header-logo h1 {
          font-size: 1.5rem;
          margin: 0;
          font-weight: 700;
        }
        
        .season-badge {
          background-color: var(--primary-color);
          color: white;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          margin-left: 10px;
        }
        
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
          }
          
          .header-logo {
            margin-bottom: 10px;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
