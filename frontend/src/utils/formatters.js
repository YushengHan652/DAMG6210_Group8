/**
 * Format a number as currency
 * @param {number} value - The value to format
 * @param {string} currency - The currency code
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD') => {
  if (value === null || value === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);
};

/**
 * Format a number with commas
 * @param {number} value - The value to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Format a date
 * @param {string|Date} date - The date to format
 * @param {string} format - The format to use ('short', 'medium', 'long')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'medium') => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options = {
    short: { month: 'numeric', day: 'numeric', year: '2-digit' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
  };
  
  return new Intl.DateTimeFormat('en-US', options[format]).format(dateObj);
};

/**
 * Format a time
 * @param {number} timeInSeconds - The time in seconds
 * @returns {string} - Formatted time string (mm:ss.SSS)
 */
export const formatRaceTime = (timeInSeconds) => {
  if (timeInSeconds === null || timeInSeconds === undefined) return 'N/A';
  
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const milliseconds = Math.round((timeInSeconds % 1) * 1000);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
};

/**
 * Format a lap time (usually stored as decimal seconds in the database)
 * @param {number} lapTime - The lap time in seconds
 * @returns {string} - Formatted lap time string (m:ss.SSS)
 */
export const formatLapTime = (lapTime) => {
  if (!lapTime) return 'N/A';
  
  const minutes = Math.floor(lapTime / 60);
  const seconds = Math.floor(lapTime % 60);
  const milliseconds = Math.round((lapTime % 1) * 1000);
  
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  } else {
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}`;
  }
};

/**
 * Format a percentage
 * @param {number} value - The value to format
 * @param {number} precision - The number of decimal places
 * @returns {string} - Formatted percentage string
 */
export const formatPercentage = (value, precision = 1) => {
  if (value === null || value === undefined) return 'N/A';
  
  return `${value.toFixed(precision)}%`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} length - The maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  
  return `${text.substring(0, length)}...`;
};

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 * @param {number} n - The number
 * @returns {string} - Number with ordinal suffix
 */
export const getOrdinal = (n) => {
  if (!n) return 'N/A';
  
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
