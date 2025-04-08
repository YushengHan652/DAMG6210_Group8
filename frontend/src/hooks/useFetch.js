import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for data fetching with loading and error handling
 * 
 * @param {Function} fetchFunction - The API fetch function to call
 * @param {Array} dependencies - Dependencies to trigger re-fetch, defaults to empty array
 * @param {boolean} immediate - Whether to fetch immediately, defaults to true
 * @param {Array|Object} initialData - Initial data to use before fetch completes
 * @returns {Object} - { data, loading, error, refetch }
 */
const useFetch = (fetchFunction, dependencies = [], immediate = true, initialData = null) => {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)
  
  const refetch = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await fetchFunction(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data')
      return null
    } finally {
      setLoading(false)
    }
  }, [fetchFunction])
  
  useEffect(() => {
    if (immediate) {
      refetch()
    }
  }, [...dependencies, immediate])
  
  return { data, loading, error, refetch }
}

export default useFetch
