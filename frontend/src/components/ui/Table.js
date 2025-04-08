import React, { useState, useMemo } from 'react'

const Table = ({
  columns,
  data,
  initialSortColumn = '',
  initialSortDirection = 'asc',
  className = '',
  onRowClick = null,
  rowClassName = '',
  rowKeyField = 'id',
  striped = true,
  compact = false,
  centered = false,
  caption = '',
  footer = null,
  emptyMessage = 'No data available'
}) => {
  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: initialSortColumn,
    direction: initialSortDirection
  })
  
  // Handle column click for sorting
  const handleHeaderClick = (key) => {
    if (!columns.find(col => col.key === key).sortable) return
    
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc'
    })
  }
  
  // Sort data based on current sortConfig
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data
    
    const column = columns.find(col => col.key === sortConfig.key)
    if (!column || !column.sortable) return data
    
    return [...data].sort((a, b) => {
      // Get values - handle nested data with accessorFn
      let aValue = column.accessorFn ? column.accessorFn(a) : a[sortConfig.key]
      let bValue = column.accessorFn ? column.accessorFn(b) : b[sortConfig.key]
      
      // Handle null/undefined values
      if (aValue === null || aValue === undefined) aValue = ''
      if (bValue === null || bValue === undefined) bValue = ''
      
      // Compare based on type
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortConfig, columns])
  
  // Cell render logic
  const renderCell = (row, column) => {
    // Use the cell render function if provided
    if (column.cell) {
      return column.cell(row)
    }
    
    // Use the accessor function if provided
    if (column.accessorFn) {
      return column.accessorFn(row)
    }
    
    // Use the key to access the data directly
    return row[column.key]
  }
  
  // Table class names
  const tableClasses = `w-full border-collapse ${className}`
  
  // Cell class names
  const cellClasses = `${compact ? 'px-2 py-1' : 'px-4 py-2'} ${
    centered ? 'text-center' : ''
  }`
  
  return (
    <div className="overflow-x-auto">
      <table className={tableClasses}>
        {caption && <caption className="text-lg font-semibold mb-2">{caption}</caption>}
        
        <thead>
          <tr className="bg-f1-black text-white border-b border-f1-gray">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`${cellClasses} font-semibold text-left ${
                  column.sortable ? 'cursor-pointer hover:bg-f1-gray' : ''
                } ${column.headerClassName || ''}`}
                onClick={() => column.sortable && handleHeaderClick(column.key)}
                style={{ width: column.width || 'auto' }}
              >
                <div className="flex items-center justify-between">
                  <span>{column.header}</span>
                  {column.sortable && sortConfig.key === column.key && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((row, index) => (
              <tr
                key={row[rowKeyField] || index}
                className={`${
                  striped && index % 2 !== 0 ? 'bg-gray-800' : 'bg-f1-gray'
                } ${onRowClick ? 'cursor-pointer hover:bg-f1-black' : ''} ${
                  rowClassName ? (typeof rowClassName === 'function' ? rowClassName(row) : rowClassName) : ''
                }`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <td
                    key={`${row[rowKeyField] || index}-${column.key}`}
                    className={`${cellClasses} ${column.cellClassName || ''}`}
                  >
                    {renderCell(row, column)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className={`${cellClasses} text-center text-gray-400 py-4`}
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
        
        {footer && (
          <tfoot className="bg-f1-black text-white border-t border-f1-gray">
            {footer}
          </tfoot>
        )}
      </table>
    </div>
  )
}

export default Table
