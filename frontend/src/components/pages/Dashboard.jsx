import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import StandingsTable from '../components/dashboard/StandingsTable'
import RaceSchedule from '../components/dashboard/RaceSchedule'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { getSeasonRaces } from '../api/races'
import useFetch from '../hooks/useFetch'

const Dashboard = () => {
  const { currentSeason, driverStandings, teamStandings, loading: globalLoading } = useAppContext()
  const [races, setRaces] = useState([])
  const [loadingRaces, setLoadingRaces] = useState(false)
  
  // Fetch races for the current season
  useEffect(() => {
    const fetchRaces = async () => {
      if (currentSeason) {
        setLoadingRaces(true)
        try {
          const racesData = await getSeasonRaces(currentSeason.season_id)
          setRaces(racesData)
        } catch (error) {
          console.error('Failed to fetch races:', error)
        } finally {
          setLoadingRaces(false)
        }
      }
    }
    
    fetchRaces()
  }, [currentSeason])
  
  return (
    <div>
      {/* Season header */}
      <div className="bg-f1-gray rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">
              F1 {currentSeason ? currentSeason.year : ''} Season
            </h1>
            {currentSeason && (
              <p className="text-gray-300 mt-2">
                {currentSeason.number_of_races} races • 
                {currentSeason.champion_driver_name ? (
                  <span> Champion: <Link to={`/drivers/${currentSeason.champion_driver_id}`} className="text-f1-red hover:underline">
                    {currentSeason.champion_driver_name}
                  </Link></span>
                ) : (
                  ' Championship ongoing'
                )}
              </p>
            )}
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button as="link" to="/races" variant="outline">
              Race Calendar
            </Button>
            <Button as="link" to="/drivers" variant="primary">
              View Drivers
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Driver standings */}
        <div>
          <StandingsTable
            type="driver"
            standings={driverStandings}
            title="Driver Standings"
            loading={globalLoading}
          />
        </div>
        
        {/* Middle column - Team standings */}
        <div>
          <StandingsTable
            type="team"
            standings={teamStandings}
            title="Constructor Standings"
            loading={globalLoading}
          />
        </div>
        
        {/* Right column - Race schedule */}
        <div>
          <RaceSchedule
            races={races}
            title="Race Schedule"
            loading={loadingRaces}
          />
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Card>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Drivers</p>
            <p className="text-3xl font-bold text-white mt-1">20</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Teams</p>
            <p className="text-3xl font-bold text-white mt-1">10</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Circuits</p>
            <p className="text-3xl font-bold text-white mt-1">23</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Race Weekends</p>
            <p className="text-3xl font-bold text-white mt-1">24</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
