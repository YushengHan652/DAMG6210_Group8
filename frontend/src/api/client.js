import axios from 'axios'

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - could be used to add auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // You could add authorization headers here
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle common error responses
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // Handle errors based on status code
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data)
      
      switch (error.response.status) {
        case 401:
          // Handle unauthorized errors - could redirect to login
          console.warn('Unauthorized access')
          break
        case 404:
          // Handle not found errors
          console.warn('Resource not found')
          break
        case 500:
          // Handle server errors
          console.error('Server error')
          break
        default:
          // Handle other errors
          break
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
