import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import Card from '../ui/Card'

const RaceSchedule = ({ races = [], title = 'Race Schedule', loading = false, className = '' }) => {
  // Get the current date
  const today = new Date()
  
  // Separate upcoming and past races
  const upcomingRaces = races.filter(race => new Date(race.date) >= today)
  const pastRaces = races.filter(race => new Date(race.date) < today)
  
  // Function to render a race card
  const renderRaceCard = (race, isPast = false) => {
    const raceDate = new Date(race.date)
    
    return (
      <Link to={`/races/${race.race_id}`} key={race.race_id}>
        <div className={`p-4 mb-3 rounded-lg transition-colors hover:bg-f1-black ${isPast ? 'bg-gray-800' : 'bg-f1-gray'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white">{race.location} Grand Prix</h3>
              <p className="text-sm text-gray-400">{race.circuit_name}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-white">
                {format(raceDate, 'dd MMM')}
              </p>
              <p className="text-sm text-gray-400">{format(raceDate, 'yyyy')}</p>
            </div>
          </div>
          
          {race.weather_condition && (
            <div className="mt-2 text-sm text-gray-400">
              Weather: {race.weather_condition}
            </div>
          )}
          
          {isPast && race.winner_name && (
            <div className="mt-2 text-sm">
              Winner: <span className="text-f1-red">{race.winner_name}</span>
            </div>
          )}
        </div>
      </Link>
    )
  }
  
  return (
    <Card title={title} className={className}>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-f1-red"></div>
        </div>
      ) : races.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No races scheduled</p>
      ) : (
        <div>
          {/* Upcoming races section */}
          {upcomingRaces.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-f1-red mb-2">Upcoming Races</h3>
              {upcomingRaces.slice(0, 5).map(race => renderRaceCard(race))}
              
              {upcomingRaces.length > 5 && (
                <div className="text-center mt-2">
                  <Link to="/races" className="text-gray-400 hover:text-f1-red text-sm">
                    View all {upcomingRaces.length} upcoming races
                  </Link>
                </div>
              )}
            </div>
          )}
          
          {/* Past races section */}
          {pastRaces.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-400 mb-2">Recent Races</h3>
              {pastRaces.slice(0, 3).map(race => renderRaceCard(race, true))}
              
              {pastRaces.length > 3 && (
                <div className="text-center mt-2">
                  <Link to="/races" className="text-gray-400 hover:text-f1-red text-sm">
                    View all {pastRaces.length} completed races
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

export default RaceSchedule
