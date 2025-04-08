import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTeam, getTeamDrivers, getTeamCars, getTeamStaff, getTeamSponsorships } from '../api/teams'
import { getTeamSeasonStandings } from '../api/teams'
import { useAppContext } from '../context/AppContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Loading from '../components/ui/Loading'
import { formatCurrency } from '../utils/formatters'

const TeamDetail = () => {
  const { id } = useParams()
  const { currentSeason } = useAppContext()
  
  const [team, setTeam] = useState(null)
  const [drivers, setDrivers] = useState([])
  const [cars, setCars] = useState([])
  const [staff, setStaff] = useState([])
  const [sponsorships, setSponsorships] = useState([])
  const [standings, setStandings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true)
      try {
        // Fetch team details
        const teamData = await getTeam(id)
        setTeam(teamData)
        
        // Fetch associated data in parallel
        const [driversData, carsData, staffData, sponsorshipsData, standingsData] = await Promise.all([
          getTeamDrivers(id),
          getTeamCars(id),
          getTeamStaff(id),
          getTeamSponsorships(id),
          currentSeason ? getTeamSeasonStandings(id, currentSeason.season_id) : []
        ])
        
        setDrivers(driversData)
        setCars(carsData)
        setStaff(staffData)
        setSponsorships(sponsorshipsData)
        setStandings(standingsData)
      } catch (err) {
        console.error('Error fetching team data:', err)
        setError('Failed to load team data. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchTeamData()
  }, [id, currentSeason])

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
    
    return teamColors[teamName] || 'team-red-bull'
  }
  
  if (loading) return <Loading message="Loading team details..." />
  
  if (error) {
    return (
      <div className="bg-red-900 text-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
        <Button as="link" to="/teams" className="mt-4">
          Back to Teams
        </Button>
      </div>
    )
  }
  
  if (!team) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Team Not Found</h2>
        <p className="mb-6">The team you're looking for doesn't exist or has been removed.</p>
        <Button as="link" to="/teams">
          Back to Teams
        </Button>
      </div>
    )
  }
  
  const teamColor = getTeamColorClass(team.team_name)
  
  return (
    <div>
      {/* Team header */}
      <div className={`bg-f1-gray rounded-lg overflow-hidden mb-8`}>
        <div className={`h-2 bg-${teamColor}`}></div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">{team.team_name}</h1>
              <p className="text-gray-300 mt-1">
                {team.team_country} • Founded {team.founded_year || 'N/A'}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-400">Championships</p>
                <p className="text-2xl font-bold text-f1-red">{team.championships_won || 0}</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-400">Budget</p>
                <p className="text-lg font-semibold text-white">
                  {team.budget ? formatCurrency(team.budget) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Team content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column - Team info and drivers */}
        <div className="space-y-8">
          {/* Team information */}
          <Card title="Team Information">
            <div className="space-y-2">
              <div>
                <p className="text-gray-400 text-sm">Team Principal</p>
                <p className="text-white">{team.team_principal || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Tires Supplier</p>
                <p className="text-white">{team.tires_supplier || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Team Country</p>
                <p className="text-white">{team.team_country}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Founded</p>
                <p className="text-white">{team.founded_year || 'N/A'}</p>
              </div>
            </div>
          </Card>
          
          {/* Driver lineup */}
          <Card title="Drivers">
            {drivers.length > 0 ? (
              <div className="space-y-4">
                {drivers.map((driver) => (
                  <Link 
                    to={`/drivers/${driver.driver_id}`} 
                    key={driver.driver_id}
                    className="block bg-f1-black p-4 rounded-lg hover:bg-gray-800"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">{driver.name}</p>
                        <p className="text-sm text-gray-400">{driver.nationality}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Wins</p>
                        <p className="text-lg font-semibold text-f1-red">
                          {driver.number_of_wins || 0}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No driver data available</p>
            )}
          </Card>
        </div>
        
        {/* Middle column - Cars and staff */}
        <div className="space-y-8">
          {/* Cars */}
          <Card title="Team Cars">
            {cars.length > 0 ? (
              <div className="space-y-4">
                {cars.map((car) => (
                  <div key={car.car_id} className="bg-f1-black p-4 rounded-lg">
                    <h3 className="font-bold text-white">{car.model}</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div>
                        <p className="text-gray-400">Engine</p>
                        <p className="text-white">{car.engine_manufacturer}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Chassis</p>
                        <p className="text-white">{car.chassis}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Weight</p>
                        <p className="text-white">{car.weight} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Power</p>
                        <p className="text-white">{car.horsepower || 'N/A'} HP</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No car data available</p>
            )}
          </Card>
          
          {/* Staff */}
          <Card title="Team Staff">
            {staff.length > 0 ? (
              <div>
                <Table
                  columns={[
                    { key: 'name', header: 'Name', sortable: true },
                    { 
                      key: 'role', 
                      header: 'Role', 
                      sortable: true,
                      cell: (row) => {
                        // Determine staff role
                        if (row.engineer) return 'Engineer';
                        if (row.mechanic) return 'Mechanic';
                        if (row.manager) return 'Manager';
                        if (row.analyst) return 'Analyst';
                        return 'Staff';
                      } 
                    },
                    { 
                      key: 'nationality', 
                      header: 'Nationality', 
                      sortable: true 
                    }
                  ]}
                  data={staff}
                  initialSortColumn="name"
                  compact={true}
                  rowKeyField="staff_id"
                />
              </div>
            ) : (
              <p className="text-gray-400">No staff data available</p>
            )}
          </Card>
        </div>
        
        {/* Right column - Sponsorships and standings */}
        <div className="space-y-8">
          {/* Sponsorships */}
          <Card title="Sponsors">
            {sponsorships.length > 0 ? (
              <div className="space-y-4">
                {sponsorships.map((sponsorship) => (
                  <div key={sponsorship.contract_id} className="bg-f1-black p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-white">{sponsorship.sponsor_name}</h3>
                      <span className="bg-f1-red text-white text-xs px-2 py-1 rounded">
                        {sponsorship.sponsor_type || 'Sponsor'}
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      <p className="text-gray-400">
                        Contract: {formatCurrency(sponsorship.contract_value)}
                      </p>
                      <p className="text-gray-400">
                        {new Date(sponsorship.contract_start).getFullYear()} - {new Date(sponsorship.contract_end).getFullYear()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No sponsorship data available</p>
            )}
          </Card>
          
          {/* Season standings */}
          <Card title={`${currentSeason?.year || ''} Season Standings`}>
            {currentSeason && standings.length > 0 ? (
              <div>
                <div className="flex space-x-6 mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Position</p>
                    <p className="text-2xl font-bold text-white">
                      {standings[0]?.rank || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Points</p>
                    <p className="text-2xl font-bold text-f1-red">
                      {standings[0]?.points || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Wins</p>
                    <p className="text-2xl font-bold text-white">
                      {standings[0]?.wins || 0}
                    </p>
                  </div>
                </div>
                
                <Button as="link" to="/standings" size="small" variant="outline" className="w-full">
                  View Full Standings
                </Button>
              </div>
            ) : (
              <p className="text-gray-400">No standings data available</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TeamDetail
