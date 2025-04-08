import React from 'react'

const Card = ({
  title,
  children,
  className = '',
  titleClassName = '',
  accent = false,
  onClick = null
}) => {
  const cardClasses = `bg-f1-gray rounded-lg shadow-card overflow-hidden ${
    accent ? 'border-l-4 border-f1-red' : ''
  } ${onClick ? 'cursor-pointer hover:bg-gray-700 transition-colors' : ''} ${className}`
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {title && (
        <div className={`px-4 py-3 bg-gray-800 font-bold text-lg ${titleClassName}`}>
          {title}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  )
}

export default Card
