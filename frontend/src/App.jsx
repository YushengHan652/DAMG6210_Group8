import React, { useEffect, Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAppContext } from './context/AppContext'
import Layout from './components/layout/Layout'
import Loading from './components/ui/Loading'

// Lazy-loaded pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Teams = lazy(() => import('./pages/Teams'))
const TeamDetail = lazy(() => import('./pages/TeamDetail'))
const Drivers = lazy(() => import('./pages/Drivers'))
const DriverDetail = lazy(() => import('./pages/DriverDetail'))
const Races = lazy(() => import('./pages/Races'))
const RaceDetail = lazy(() => import('./pages/RaceDetail'))
const Circuits = lazy(() => import('./pages/Circuits'))
const CircuitDetail = lazy(() => import('./pages/CircuitDetail'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  const { loadInitialData } = useAppContext()

  useEffect(() => {
    // Load any global data needed across the app
    loadInitialData()
  }, [])

  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:id" element={<TeamDetail />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/drivers/:id" element={<DriverDetail />} />
          <Route path="/races" element={<Races />} />
          <Route path="/races/:id" element={<RaceDetail />} />
          <Route path="/circuits" element={<Circuits />} />
          <Route path="/circuits/:id" element={<CircuitDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default App