import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <button className="menu-toggle" onClick={toggleMenu}>
        <span className="hamburger"></span>
      </button>
      
      <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
        <li>
          <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/teams" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>
            Teams
          </NavLink>
        </li>
        <li>
          <NavLink to="/drivers" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>
            Drivers
          </NavLink>
        </li>
        <li>
          <NavLink to="/races" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>
            Races
          </NavLink>
        </li>
        <li>
          <NavLink to="/seasons" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>
            Seasons
          </NavLink>
        </li>
        <li>
          <NavLink to="/circuits" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>
            Circuits
          </NavLink>
        </li>
      </ul>

      <style jsx>{`
        .navbar {
          position: relative;
        }
        
        .navbar-menu {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .navbar-menu li {
          margin-left: 20px;
        }
        
        .navbar-menu a {
          color: var(--light-text-color);
          text-decoration: none;
          font-weight: 500;
          padding: 5px 0;
          position: relative;
        }
        
        .navbar-menu a:after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          background-color: var(--primary-color);
          bottom: 0;
          left: 0;
          transition: width 0.3s ease;
        }
        
        .navbar-menu a:hover:after,
        .navbar-menu a.active:after {
          width: 100%;
        }
        
        .menu-toggle {
          display: none;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 10px;
        }
        
        .hamburger {
          display: block;
          position: relative;
          width: 24px;
          height: 2px;
          background-color: var(--light-text-color);
          transition: background-color 0.3s ease;
        }
        
        .hamburger:before,
        .hamburger:after {
          content: '';
          position: absolute;
          width: 24px;
          height: 2px;
          background-color: var(--light-text-color);
          transition: transform 0.3s ease;
        }
        
        .hamburger:before {
          top: -6px;
        }
        
        .hamburger:after {
          bottom: -6px;
        }
        
        @media (max-width: 768px) {
          .menu-toggle {
            display: block;
            position: absolute;
            top: -45px;
            right: 0;
            z-index: 1000;
          }
          
          .navbar-menu {
            display: none;
            flex-direction: column;
            position: absolute;
            top: -15px;
            right: 0;
            background-color: var(--secondary-color);
            width: 200px;
            padding: 20px;
            border-radius: 4px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 999;
          }
          
          .navbar-menu.active {
            display: flex;
          }
          
          .navbar-menu li {
            margin: 10px 0;
          }
          
          .menu-toggle.active .hamburger {
            background-color: transparent;
          }
          
          .menu-toggle.active .hamburger:before {
            transform: rotate(45deg) translate(4px, 6px);
          }
          
          .menu-toggle.active .hamburger:after {
            transform: rotate(-45deg) translate(4px, -6px);
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
