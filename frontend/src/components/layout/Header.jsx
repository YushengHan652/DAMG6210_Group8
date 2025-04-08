import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { currentSeason, seasons, changeSeason } = useAppContext()
  const location = useLocation()
  
  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Teams', href: '/teams' },
    { name: 'Drivers', href: '/drivers' },
    { name: 'Races', href: '/races' },
    { name: 'Circuits', href: '/circuits' },
  ]
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }
  
  const handleSeasonChange = (e) => {
    changeSeason(e.target.value)
  }
  
  return (
    <header className="bg-f1-black border-b border-f1-gray">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between border-b border-f1-gray lg:border-none">
          <div className="flex items-center">
            <Link to="/">
              <span className="sr-only">F1 Management</span>
              <img
                className="h-10 w-auto"
                src="/f1-logo.svg"
                alt="F1 Management Logo"
              />
            </Link>
            <div className="hidden ml-10 space-x-8 lg:block">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-base font-medium ${
                    isActive(link.href)
                      ? 'text-f1-red'
                      : 'text-white hover:text-f1-red'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
            {currentSeason && seasons.length > 0 && (
              <div className="flex items-center">
                <label htmlFor="season-select" className="mr-2 text-white">
                  Season:
                </label>
                <select
                  id="season-select"
                  value={currentSeason.season_id}
                  onChange={handleSeasonChange}
                  className="bg-f1-gray text-white border border-f1-red rounded-md py-1 px-2"
                >
                  {seasons.map((season) => (
                    <option key={season.season_id} value={season.season_id}>
                      {season.year}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="lg:hidden">
            <button
              type="button"
              className="bg-f1-black p-2 rounded-md text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div
          className={`${
            mobileMenuOpen ? 'block' : 'hidden'
          } lg:hidden py-4 space-y-1`}
        >
          {navigation.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.href)
                  ? 'bg-f1-red text-white'
                  : 'text-white hover:bg-f1-gray hover:text-white'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {currentSeason && seasons.length > 0 && (
            <div className="px-3 py-2">
              <label htmlFor="mobile-season-select" className="block text-white mb-1">
                Season:
              </label>
              <select
                id="mobile-season-select"
                value={currentSeason.season_id}
                onChange={handleSeasonChange}
                className="w-full bg-f1-gray text-white border border-f1-red rounded-md py-1 px-2"
              >
                {seasons.map((season) => (
                  <option key={season.season_id} value={season.season_id}>
                    {season.year}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
