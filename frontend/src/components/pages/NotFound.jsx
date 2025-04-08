import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-f1-red text-6xl font-bold mb-4">404</div>
      <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
      <p className="text-gray-400 text-center max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Button as="link" to="/" variant="primary">
          Back to Dashboard
        </Button>
        <Button as="link" to="/races" variant="outline">
          View Races
        </Button>
      </div>
      
      <div className="mt-12 text-gray-500 text-sm">
        <p>
          Looking for something specific? Try checking the{' '}
          <Link to="/teams" className="text-f1-red hover:underline">
            Teams
          </Link>{' '}
          or{' '}
          <Link to="/drivers" className="text-f1-red hover:underline">
            Drivers
          </Link>{' '}
          pages.
        </p>
      </div>
    </div>
  )
}

export default NotFound
