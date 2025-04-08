import React from 'react'
import { Link } from 'react-router-dom'
import Table from '../ui/Table'
import Card from '../ui/Card'

const StandingsTable = ({
  type = 'driver',
  standings = [],
  title = 'Standings',
  loading = false,
  className = ''
}) => {
  const driverColumns = [
    {
      key: 'position',
      header: 'Pos',
      width: '50px',
      cell: (row) => (
        <div className="flex justify-center items-center w-8 h-8 bg-f1-black rounded-full">
          {row.rank}
        </div>
      ),
      sortable: true
    },
    {
      key: 'driver',
      header: 'Driver',
      cell: (row) => (
        <Link to={`/drivers/${row.entity_id}`} className="flex items-center">
          <span className="font-bold text-white hover:text-f1-red">
            {row.driver_name || `Driver #${row.entity_id}`}
          </span>
        </Link>
      ),
      sortable: true,
      accessorFn: (row) => row.driver_name || `Driver #${row.entity_id}`
    },
    {
      key: 'team',
      header: 'Team',
      cell: (row) => (
        <Link to={`/teams/${row.team_id}`} className="text-sm text-gray-300 hover:text-f1-red">
          {row.team_name || 'Unknown Team'}
        </Link>
      ),
      sortable: true,
      accessorFn: (row) => row.team_name || 'Unknown Team'
    },
    {
      key: 'points',
      header: 'Points',
      cell: (row) => <span className="font-semibold">{row.points}</span>,
      sortable: true,
      headerClassName: 'text-right',
      cellClassName: 'text-right'
    },
  ]

  const teamColumns = [
    {
      key: 'position',
      header: 'Pos',
      width: '50px',
      cell: (row) => (
        <div className="flex justify-center items-center w-8 h-8 bg-f1-black rounded-full">
          {row.rank}
        </div>
      ),
      sortable: true
    },
    {
      key: 'team',
      header: 'Team',
      cell: (row) => (
        <Link to={`/teams/${row.entity_id}`} className="flex items-center">
          <span className="font-bold text-white hover:text-f1-red">
            {row.team_name || `Team #${row.entity_id}`}
          </span>
        </Link>
      ),
      sortable: true,
      accessorFn: (row) => row.team_name || `Team #${row.entity_id}`
    },
    {
      key: 'wins',
      header: 'Wins',
      sortable: true,
      headerClassName: 'text-center',
      cellClassName: 'text-center'
    },
    {
      key: 'points',
      header: 'Points',
      cell: (row) => <span className="font-semibold">{row.points}</span>,
      sortable: true,
      headerClassName: 'text-right',
      cellClassName: 'text-right'
    },
  ]

  const columns = type === 'driver' ? driverColumns : teamColumns

  return (
    <Card title={title} className={className}>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-f1-red"></div>
        </div>
      ) : (
        <Table
          columns={columns}
          data={standings}
          initialSortColumn="points"
          initialSortDirection="desc"
          rowKeyField="entity_id"
          compact={true}
          emptyMessage={`No ${type} standings available`}
        />
      )}
    </Card>
  )
}

export default StandingsTable
