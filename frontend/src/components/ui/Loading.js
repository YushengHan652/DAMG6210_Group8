import React from 'react'

const Loading = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-f1-red ${sizeClasses[size]}`}></div>
      {message && <p className="mt-4 text-f1-white text-lg">{message}</p>}
    </div>
  )
}

export default Loading
