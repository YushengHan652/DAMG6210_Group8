import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { useAppContext } from '../../context/AppContext'

const Layout = ({ children }) => {
  const { loading, error } = useAppContext()
  
  return (
    <div className="min-h-screen flex flex-col bg-f1-black text-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Show error message if there is one */}
        {error && (
          <div className="bg-red-900 text-white p-4 rounded-md mb-6">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        {/* Show loading spinner if loading */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-f1-red"></div>
          </div>
        ) : (
          children
        )}
      </main>
      
      <Footer />
    </div>
  )
}

export default Layout
