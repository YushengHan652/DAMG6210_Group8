import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDrivers } from '../api/drivers'
import { getTeams } from '../api/teams'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Loading from '../components/ui/Loading'
import { formatCurrency } from '../utils/formatters'

const Drivers = () => {
  const [drivers, setDrivers] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filter and sort state
  const [searchQuery, setSearchQuery] = useState('')
  const [teamFilter, setTeamFilter] = useState('')
  const [sortBy, setSortBy] = useState('wins_desc')
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch drivers and teams in parallel
        const [driversData, teamsData] = await Promise.all([
          getDrivers(),
          getTeams()
        ])
        
        setDrivers(driversData)
        setTeams(teamsData)
      } catch (err) {
        console.error('Error fetching drivers data:', err)
        setError('Failed to load drivers. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Filter drivers based on search query and team filter
  const filteredDrivers = drivers
    ? drivers.filter(
        (driver) =>
          (searchQuery === '' ||
            driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            driver.nationality.toLowerCase().includes(searchQuery.toLowerCase())) &&
          (teamFilter === '' || driver.team_id === parseInt(teamFilter))
      )
    : []
  
  // Sort drivers based on selected sort option
  const sortedDrivers = [...filteredDrivers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'team':
        return a.team_name.localeCompare(b.team_name)
      case 'nationality':
        return a.nationality.localeCompare(b.nationality)
      case 'age':
        return a.age - b.age
      case 'age_desc':
        return b.age - a.age
      case 'wins_desc':
        return (b.number_of_wins || 0) - (a.number_of_wins || 0)
      case 'poles_desc':
        return (b.pole_positions || 0) - (a.pole_positions || 0)
      default:
        return 0
    }
  })
  
  // Helper function to get team color class
  const getTeamColorClass = (teamName) => {
    const teamColors = {
      'Red Bull Racing': 'team-red-bull',
      'Mercedes-AMG Petronas': 'team-mercedes',
      'Scuderia Ferrari': 'team-ferrari',
      'McLaren Racing': 'team-mclaren',
      'Aston Martin': 'team-aston-martin',
      'Alpine F1 Team': 'team-alpine',
      'Williams Racing': 'team-williams',
      'Visa Cash App RB': 'team-visa-rb',
      'Stake F1 Team Kick Sauber': 'team-stake',
      'MoneyGram Haas F1 Team': 'team-haas',
    }
    
    // Look for a partial match if exact match not found
    if (!teamColors[teamName]) {
      for (const [key, value] of Object.entries(teamColors)) {
        if (teamName && (teamName.includes(key) || key.includes(teamName))) {
          return value
        }
      }
    }
    
    return teamColors[teamName] || 'bg-gray-700'
  }
  
  // Driver card component
  const DriverCard = ({ driver }) => {
    const teamColor = getTeamColorClass(driver.team_name)
    
    return (
      <Link to={`/drivers/${driver.driver_id}`}>
        <Card className="h-full transition-transform hover:scale-102 hover:shadow-xl">
          <div className={`h-2 bg-${teamColor} bg-opacity-80 -mt-4 mb-4 mx-4 rounded-t-lg`}></div>
          
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-bold text-white mb-1">{driver.name}</h3>
            
            <div className="flex items-center mb-4">
              <span className="text-gray-300">{driver.nationality}</span>
              <span className="mx-2 text-gray-500">•</span>
              <span className="text-gray-300">{driver.age} years</span>
            </div>
            
            <p className="text-sm text-gray-400 mb-4">
              <Link to={`/teams/${driver.team_id}`} className="hover:text-f1-red">
                {driver.team_name}
              </Link>
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-xs text-gray-400">Wins</p>
                <p className="text-lg font-bold text-white">{driver.number_of_wins || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Poles</p>
                <p className="text-lg font-bold text-white">{driver.pole_positions || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">F/Laps</p>
                <p className="text-lg font-bold text-white">{driver.fastest_laps || 0}</p>
              </div>
            </div>
            
            <div className="mt-auto flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400">Salary</p>
                <p className="text-sm font-semibold text-white">
                  {driver.salary ? formatCurrency(driver.salary) : 'N/A'}
                </p>
              </div>
              
              <Button size="small" variant="outline">
                View Profile
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    )
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Formula 1 Drivers</h1>
      </div>
      
      {/* Filters section */}
      <div className="bg-f1-gray rounded-lg p-4 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Search input */}
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search drivers..."
              className="w-full bg-f1-black text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-f1-red"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            {/* Team filter */}
            <div className="flex items-center space-x-2">
              <label className="text-gray-300 whitespace-nowrap">Team:</label>
              <select
                className="bg-f1-black text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-f1-red"
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
              >
                <option value="">All Teams</option>
                {teams.map((team) => (
                  <option key={team.team_id} value={team.team_id}>
                    {team.team_name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort options */}
            <div className="flex items-center space-x-2">
              <label className="text-gray-300 whitespace-nowrap">Sort by:</label>
              <select
                className="bg-f1-black text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-f1-red"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="wins_desc">Wins</option>
                <option value="poles_desc">Pole Positions</option>
                <option value="name">Name</option>
                <option value="team">Team</option>
                <option value="nationality">Nationality</option>
                <option value="age">Age (Asc)</option>
                <option value="age_desc">Age (Desc)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Drivers grid */}
      {loading ? (
        <Loading message="Loading drivers data..." />
      ) : error ? (
        <div className="text-red-500 p-4 bg-f1-gray rounded-lg">
          <p>Error loading drivers: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-2">
            Try Again
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedDrivers.length > 0 ? (
            sortedDrivers.map((driver) => (
              <DriverCard key={driver.driver_id} driver={driver} />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-400">
              <p>No drivers found matching your search criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Drivers
