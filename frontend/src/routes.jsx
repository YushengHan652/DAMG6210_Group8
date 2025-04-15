import React from 'react';
import { Navigate } from 'react-router-dom';

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard'));

// Teams
const TeamList = React.lazy(() => import('./components/teams/TeamList'));
const TeamDetail = React.lazy(() => import('./components/teams/TeamDetail'));

// Drivers
const DriverList = React.lazy(() => import('./components/drivers/DriverList'));
const DriverDetail = React.lazy(() => import('./components/drivers/DriverDetail'));
const DriverManagement = React.lazy(() => import('./components/drivers/DriverManagement'));
const AddEditDriverPage = React.lazy(() => import('./components/drivers/AddEditDriverPage'));

// Races
const RaceList = React.lazy(() => import('./components/races/RaceList'));
const RaceDetail = React.lazy(() => import('./components/races/RaceDetail'));

// Seasons
const SeasonList = React.lazy(() => import('./components/seasons/SeasonList'));
const SeasonDetail = React.lazy(() => import('./components/seasons/SeasonDetail'));

// Circuits
const CircuitList = React.lazy(() => import('./components/circuits/CircuitList'));
const CircuitDetail = React.lazy(() => import('./components/circuits/CircuitDetail'));

// Loading component for suspense fallback
const Loading = () => <div className="loading-container">
  <div className="loading-spinner"></div>
  <p>Loading...</p>
</div>;

const routes = [
  {
    path: '/',
    element: (
      <React.Suspense fallback={<Loading />}>
        <Dashboard />
      </React.Suspense>
    ),
  },
  {
    path: 'teams',
    children: [
      {
        path: '',
        element: (
          <React.Suspense fallback={<Loading />}>
            <TeamList />
          </React.Suspense>
        ),
      },
      {
        path: ':id',
        element: (
          <React.Suspense fallback={<Loading />}>
            <TeamDetail />
          </React.Suspense>
        ),
      },
    ],
  },
  {
    path: 'drivers',
    children: [
      {
        path: '',
        element: (
          <React.Suspense fallback={<Loading />}>
            <DriverList />
          </React.Suspense>
        ),
      },
      {
        path: ':id',
        element: (
          <React.Suspense fallback={<Loading />}>
            <DriverDetail />
          </React.Suspense>
        ),
      },
      {
        path: 'manage',
        element: (
          <React.Suspense fallback={<Loading />}>
            <DriverManagement />
          </React.Suspense>
        ),
      },
      {
        path: 'new',
        element: (
          <React.Suspense fallback={<Loading />}>
            <AddEditDriverPage />
          </React.Suspense>
        ),
      },
      {
        path: ':id/edit',
        element: (
          <React.Suspense fallback={<Loading />}>
            <AddEditDriverPage />
          </React.Suspense>
        ),
      },
    ],
  },
  {
    path: 'races',
    children: [
      {
        path: '',
        element: (
          <React.Suspense fallback={<Loading />}>
            <RaceList />
          </React.Suspense>
        ),
      },
      {
        path: ':id',
        element: (
          <React.Suspense fallback={<Loading />}>
            <RaceDetail />
          </React.Suspense>
        ),
      },
    ],
  },
  {
    path: 'seasons',
    children: [
      {
        path: '',
        element: (
          <React.Suspense fallback={<Loading />}>
            <SeasonList />
          </React.Suspense>
        ),
      },
      {
        path: ':id',
        element: (
          <React.Suspense fallback={<Loading />}>
            <SeasonDetail />
          </React.Suspense>
        ),
      },
    ],
  },
  {
    path: 'circuits',
    children: [
      {
        path: '',
        element: (
          <React.Suspense fallback={<Loading />}>
            <CircuitList />
          </React.Suspense>
        ),
      },
      {
        path: ':id',
        element: (
          <React.Suspense fallback={<Loading />}>
            <CircuitDetail />
          </React.Suspense>
        ),
      },
    ],
  },
  // Redirect to home for any unknown routes
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export default routes;