import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const year = new Date().getFullYear()
  
  return (
    <footer className="bg-f1-black border-t border-f1-gray py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center">
              <img src="/f1-logo.svg" alt="F1 Management" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold text-white">F1 Management</span>
            </Link>
            <p className="mt-2 text-sm text-gray-400">
              A comprehensive Formula 1 data management system.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-f1-red">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/teams" className="text-gray-400 hover:text-f1-red">
                  Teams
                </Link>
              </li>
              <li>
                <Link to="/drivers" className="text-gray-400 hover:text-f1-red">
                  Drivers
                </Link>
              </li>
              <li>
                <Link to="/races" className="text-gray-400 hover:text-f1-red">
                  Races
                </Link>
              </li>
              <li>
                <Link to="/circuits" className="text-gray-400 hover:text-f1-red">
                  Circuits
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="https://www.formula1.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-f1-red"
                >
                  Official F1 Website
                </a>
              </li>
              <li>
                <a
                  href="https://ergast.com/mrd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-f1-red"
                >
                  Ergast API
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-f1-red"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-f1-gray pt-8 md:flex md:items-center md:justify-between">
          <p className="text-base text-gray-400">
            &copy; {year} F1 Management. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-400 text-sm">
              This is a demo application and is not affiliated with Formula 1.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
