import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import { getTeams } from '../api/teams'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Loading from '../components/ui/Loading'

const Teams = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('championships_desc') // Default sort by championships
  
  // Fetch teams data
  const { data: teams, loading, error, refetch } = useFetch(getTeams, [])
  
  // Filter teams based on search query
  const filteredTeams = teams
    ? teams.filter(
        (team) =>
          team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.team_country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (team.team_principal &&
            team.team_principal.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : []
  
  // Sort teams based on selected sort option
  const sortedTeams = [...filteredTeams].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.team_name.localeCompare(b.team_name)
      case 'country':
        return a.team_country.localeCompare(b.team_country)
      case 'founded':
        return (a.founded_year || 0) - (b.founded_year || 0)
      case 'championships_desc':
        return (b.championships_won || 0) - (a.championships_won || 0)
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
        if (teamName.includes(key) || key.includes(teamName)) {
          return value
        }
      }
    }
    
    return teamColors[teamName] || 'bg-gray-700'
  }
  
  // Team card component
  const TeamCard = ({ team }) => {
    const teamColorClass = getTeamColorClass(team.team_name)
    
    return (
      <Link to={`/teams/${team.team_id}`}>
        <Card className="h-full transition-transform hover:scale-102 hover:shadow-xl">
          <div className={`h-2 ${teamColorClass} bg-opacity-80 -mt-4 mb-4 mx-4 rounded-t-lg`}></div>
          
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-bold text-white mb-2">{team.team_name}</h3>
            
            <div className="text-gray-300 text-sm mb-4">
              <p>
                <span className="text-gray-400">Country:</span> {team.team_country}
              </p>
              {team.team_principal && (
                <p>
                  <span className="text-gray-400">Principal:</span> {team.team_principal}
                </p>
              )}
              {team.founded_year && (
                <p>
                  <span className="text-gray-400">Founded:</span> {team.founded_year}
                </p>
              )}
            </div>
            
            <div className="mt-auto">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-gray-400 text-xs">Championships</p>
                  <p className="text-2xl font-bold text-f1-red">
                    {team.championships_won || 0}
                  </p>
                </div>
                
                <Button size="small" variant="outline">
                  View Team
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Formula 1 Teams</h1>
      </div>
      
      {/* Filters section */}
      <div className="bg-f1-gray rounded-lg p-4 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Search input */}
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search teams..."
              className="w-full bg-f1-black text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-f1-red"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Sort options */}
          <div className="flex space-x-4 items-center">
            <label className="text-gray-300 whitespace-nowrap">Sort by:</label>
            <select
              className="bg-f1-black text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-f1-red"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="championships_desc">Championships</option>
              <option value="name">Team Name</option>
              <option value="country">Country</option>
              <option value="founded">Year Founded</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Teams grid */}
      {loading ? (
        <Loading message="Loading teams data..." />
      ) : error ? (
        <div className="text-red-500 p-4 bg-f1-gray rounded-lg">
          <p>Error loading teams: {error}</p>
          <Button onClick={() => refetch()} className="mt-2">
            Try Again
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTeams.length > 0 ? (
            sortedTeams.map((team) => (
              <TeamCard key={team.team_id} team={team} />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-400">
              <p>No teams found matching your search criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Teams
