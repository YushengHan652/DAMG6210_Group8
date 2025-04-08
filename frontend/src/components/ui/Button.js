import React from 'react'
import { Link } from 'react-router-dom'

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  as = 'button',
  to = '',
  href = '',
  onClick = null,
  disabled = false,
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    primary: 'bg-f1-red hover:bg-red-700 text-white',
    secondary: 'bg-f1-gray hover:bg-gray-600 text-white',
    outline: 'bg-transparent border border-f1-red text-f1-red hover:bg-f1-red hover:text-white',
    ghost: 'bg-transparent hover:bg-f1-gray text-white',
  }
  
  // Size styles
  const sizeStyles = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg',
  }
  
  // Disabled styles
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  // Base button styles
  const buttonStyles = `font-medium rounded-md transition-colors duration-200 ${
    variantStyles[variant]
  } ${sizeStyles[size]} ${disabledStyles} ${className}`
  
  // Render based on "as" prop
  if (as === 'link' && to) {
    return (
      <Link to={to} className={buttonStyles} {...props}>
        {children}
      </Link>
    )
  } else if (as === 'a' && href) {
    return (
      <a href={href} className={buttonStyles} {...props}>
        {children}
      </a>
    )
  } else {
    return (
      <button
        type="button"
        className={buttonStyles}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
}

export default Button
