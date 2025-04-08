import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDriver, getDriverResults, getDriverPenalties, getDriverFailures } from '../api/drivers'
import { useAppContext } from '../context/AppContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Loading from '../components/ui/Loading'
import { format } from 'date-fns'
import { formatCurrency } from '../utils/formatters'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const DriverDetail = () => {
  const { id } = useParams()
  const { currentSeason } = useAppContext()
  
  const [driver, setDriver] = useState(null)
  const [results, setResults] = useState([])
  const [penalties, setPenalties] = useState([])
  const [failures, setFailures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statsCalculated, setStatsCalculated] = useState(null)
  
  useEffect(() => {
    const fetchDriverData = async () => {
      setLoading(true)
      try {
        // Fetch driver details
        const driverData = await getDriver(id)
        setDriver(driverData)
        
        // Fetch associated data in parallel
        const [resultsData, penaltiesData, failuresData] = await Promise.all([
          getDriverResults(id, currentSeason?.season_id),
          getDriverPenalties(id),
          getDriverFailures(id)
        ])
        
        setResults(resultsData)
        setPenalties(penaltiesData)
        setFailures(failuresData)
        
        // Calculate statistics
        calculateStats(resultsData)
      } catch (err) {
        console.error('Error fetching driver data:', err)
        setError('Failed to load driver data. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchDriverData()
  }, [id, currentSeason])
  
  // Calculate driver statistics from results
  const calculateStats = (resultsData) => {
    if (!resultsData || resultsData.length === 0) {
      setStatsCalculated(null)
      return
    }
    
    const completedRaces = resultsData.filter(
      r => r.dnf_status === 'Completed' || (r.laps_completed && r.laps_completed > 0)
    )
    
    const stats = {
      totalRaces: resultsData.length,
      completedRaces: completedRaces.length,
      wins: resultsData.filter(r => r.final_position === 1).length,
      podiums: resultsData.filter(r => r.final_position && r.final_position <= 3).length,
      pointsFinishes: resultsData.filter(r => r.points_scored && r.points_scored > 0).length,
      totalPoints: resultsData.reduce((sum, race) => sum + (race.points_scored || 0), 0),
      dnfs: resultsData.filter(r => r.dnf_status && r.dnf_status !== 'Completed').length,
      bestResult: Math.min(...resultsData.filter(r => r.final_position).map(r => r.final_position)),
      avgFinish: completedRaces.length > 0 
        ? completedRaces.reduce((sum, race) => sum + (race.final_position || 0), 0) / completedRaces.length 
        : 0,
      totalOvertakes: resultsData.reduce((sum, race) => sum + (race.overtakes_made || 0), 0)
    }
    
    // Create positional data for chart
    const positionCounts = {}
    resultsData.forEach(race => {
      if (race.final_position) {
        positionCounts[race.final_position] = (positionCounts[race.final_position] || 0) + 1
      }
    })
    
    const chartData = Object.entries(positionCounts).map(([position, count]) => ({
      position: parseInt(position),
      count
    })).sort((a, b) => a.position - b.position)
    
    stats.positionDistribution = chartData
    
    setStatsCalculated(stats)
  }
  
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
  
  if (loading) return <Loading message="Loading driver details..." />
  
  if (error) {
    return (
      <div className="bg-red-900 text-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
        <Button as="link" to="/drivers" className="mt-4">
          Back to Drivers
        </Button>
      </div>
    )
  }
  
  if (!driver) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Driver Not Found</h2>
        <p className="mb-6">The driver you're looking for doesn't exist or has been removed.</p>
        <Button as="link" to="/drivers">
          Back to Drivers
        </Button>
      </div>
    )
  }
  
  const teamColor = getTeamColorClass(driver.team_name)
  
  return (
    <div>
      {/* Driver header */}
      <div className={`bg-f1-gray rounded-lg overflow-hidden mb-8`}>
        <div className={`h-2 bg-${teamColor}`}></div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">{driver.name}</h1>
              <p className="text-gray-300 mt-1">
                {driver.nationality} • {driver.age} years old
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-400">Wins</p>
                <p className="text-2xl font-bold text-f1-red">{driver.number_of_wins || 0}</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-400">Poles</p>
                <p className="text-lg font-semibold text-white">{driver.pole_positions || 0}</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-400">Fastest Laps</p>
                <p className="text-lg font-semibold text-white">{driver.fastest_laps || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Driver content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column - Driver info and team */}
        <div className="space-y-8">
          {/* Driver information */}
          <Card title="Driver Information">
            <div className="space-y-2">
              <div>
                <p className="text-gray-400 text-sm">Team</p>
                <Link to={`/teams/${driver.team_id}`} className="text-white hover:text-f1-red">
                  {driver.team_name}
                </Link>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Nationality</p>
                <p className="text-white">{driver.nationality}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Age</p>
                <p className="text-white">{driver.age} years</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Salary</p>
                <p className="text-white">{driver.salary ? formatCurrency(driver.salary) : 'N/A'}</p>
              </div>
              
              {driver.contract_start_date && driver.contract_end_date && (
                <div>
                  <p className="text-gray-400 text-sm">Contract</p>
                  <p className="text-white">
                    {format(new Date(driver.contract_start_date), 'yyyy')} - {format(new Date(driver.contract_end_date), 'yyyy')}
                  </p>
                </div>
              )}
            </div>
          </Card>
          
          {/* Career stats */}
          <Card title="Career Statistics">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Race Wins</p>
                <p className="text-2xl font-bold text-f1-red">{driver.number_of_wins || 0}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Pole Positions</p>
                <p className="text-xl font-semibold text-white">{driver.pole_positions || 0}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Podiums</p>
                <p className="text-xl font-semibold text-white">{statsCalculated?.podiums || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Points Finishes</p>
                <p className="text-xl font-semibold text-white">{statsCalculated?.pointsFinishes || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Best Position</p>
                <p className="text-xl font-semibold text-white">
                  {statsCalculated?.bestResult || 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">DNF Rate</p>
                <p className="text-xl font-semibold text-white">
                  {statsCalculated?.totalRaces > 0
                    ? `${((statsCalculated.dnfs / statsCalculated.totalRaces) * 100).toFixed(1)}%`
                    : 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Avg. Finish</p>
                <p className="text-xl font-semibold text-white">
                  {statsCalculated?.avgFinish > 0
                    ? statsCalculated.avgFinish.toFixed(1)
                    : 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Points</p>
                <p className="text-xl font-semibold text-white">
                  {statsCalculated?.totalPoints || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Middle column - Results */}
        <div>
          <Card title={`${currentSeason?.year || ''} Race Results`}>
            {results.length > 0 ? (
              <div>
                <Table
                  columns={[
                    { 
                      key: 'race_name', 
                      header: 'Race',
                      cell: (row) => (
                        <Link to={`/races/${row.race_id}`} className="text-white hover:text-f1-red">
                          {row.race_name}
                        </Link>
                      ),
                      sortable: true
                    },
                    { 
                      key: 'final_position', 
                      header: 'Pos',
                      cell: (row) => row.final_position || 'DNF',
                      sortable: true,
                      cellClassName: 'text-center'
                    },
                    { 
                      key: 'points_scored', 
                      header: 'Pts',
                      cell: (row) => row.points_scored || 0,
                      sortable: true,
                      cellClassName: 'text-center' 
                    },
                    { 
                      key: 'details', 
                      header: 'Details',
                      cell: (row) => {
                        if (row.dnf_status && row.dnf_status !== 'Completed') {
                          return <span className="text-red-500">{row.dnf_status}</span>;
                        }
                        if (row.final_position === 1) {
                          return <span className="text-f1-red font-bold">Winner</span>;
                        }
                        if (row.final_position && row.final_position <= 3) {
                          return <span className="text-yellow-500">Podium</span>;
                        }
                        return null;
                      }
                    }
                  ]}
                  data={results}
                  initialSortColumn="race_id"
                  initialSortDirection="desc"
                  compact={true}
                  rowKeyField="result_id"
                />
              </div>
            ) : (
              <p className="text-gray-400">No results available</p>
            )}
          </Card>
        </div>
        
        {/* Right column - Position chart and Incidents */}
        <div className="space-y-8">
          {/* Position distribution chart */}
          <Card title="Finishing Positions">
            {statsCalculated && statsCalculated.positionDistribution && statsCalculated.positionDistribution.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsCalculated.positionDistribution}>
                    <XAxis dataKey="position" />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#38383F', border: 'none', borderRadius: '0.25rem' }}
                      labelStyle={{ color: '#FFFFFF' }}
                    />
                    <Bar dataKey="count" fill="#FF1E00" name="Races" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-400">No position data available</p>
            )}
          </Card>
          
          {/* Incidents */}
          <Card title="Incidents">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-white mb-2">Penalties</h3>
                {penalties.length > 0 ? (
                  <ul className="space-y-2">
                    {penalties.slice(0, 5).map((penalty) => (
                      <li key={penalty.penalty_id} className="bg-f1-black p-2 rounded">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">{penalty.race_name}</span>
                          <span className={`${
                            penalty.penalty_status === 'Applied' ? 'text-red-500' : 
                            penalty.penalty_status === 'Appealed' ? 'text-yellow-500' : 'text-gray-400'
                          }`}>
                            {penalty.penalty_type} - {penalty.penalty_status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{penalty.penalty_reason}</p>
                      </li>
                    ))}
                    
                    {penalties.length > 5 && (
                      <li className="text-center text-sm text-gray-400">
                        +{penalties.length - 5} more penalties
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">No penalties recorded</p>
                )}
              </div>
              
              <div>
                <h3 className="font-bold text-white mb-2">Failures</h3>
                {failures.length > 0 ? (
                  <ul className="space-y-2">
                    {failures.slice(0, 5).map((failure) => (
                      <li key={failure.failure_id} className="bg-f1-black p-2 rounded">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">{failure.race_name}</span>
                          <span className={`${failure.dnf ? 'text-red-500' : 'text-yellow-500'}`}>
                            {failure.failure_type}
                            {failure.failure_lap ? ` (Lap ${failure.failure_lap})` : ''}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{failure.failure_description}</p>
                      </li>
                    ))}
                    
                    {failures.length > 5 && (
                      <li className="text-center text-sm text-gray-400">
                        +{failures.length - 5} more failures
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">No failures recorded</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DriverDetail
