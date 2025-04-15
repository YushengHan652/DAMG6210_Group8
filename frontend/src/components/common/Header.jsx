import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Navbar from './Navbar';

const Header = () => {
  const { currentSeason } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
          <div className="management-links">
            <div className="dropdown">
              <button className="dropdown-toggle" onClick={toggleMenu}>
                Management
                <span className="dropdown-arrow">▼</span>
              </button>
              <div className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}>
                <Link to="/drivers/manage" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                  Driver Management
                </Link>
                {/* Add more management links here as they become available */}
                <Link to="/teams" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                  Team Management
                </Link>
                <Link to="/races" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                  Race Management
                </Link>
              </div>
            </div>
          </div>
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
        
        .management-links {
          position: relative;
        }
        
        .dropdown {
          position: relative;
        }
        
        .dropdown-toggle {
          background-color: var(--primary-color);
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .dropdown-arrow {
          font-size: 0.7rem;
          transition: transform 0.2s ease;
        }
        
        .dropdown-toggle:hover .dropdown-arrow,
        .dropdown.open .dropdown-arrow {
          transform: rotate(180deg);
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          min-width: 180px;
          z-index: 100;
          display: none;
          margin-top: 5px;
        }
        
        .dropdown-menu.open {
          display: block;
        }
        
        .dropdown-item {
          display: block;
          padding: 10px 15px;
          color: var(--text-color);
          text-decoration: none;
          border-bottom: 1px solid var(--border-color);
          transition: background-color 0.2s ease;
        }
        
        .dropdown-item:last-child {
          border-bottom: none;
        }
        
        .dropdown-item:hover {
          background-color: #f5f5f5;
          color: var(--primary-color);
        }
        
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
          }
          
          .header-logo {
            margin-bottom: 10px;
          }
          
          .management-links {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;