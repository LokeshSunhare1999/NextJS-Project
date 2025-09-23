"use client"

import { useState, useCallback, useMemo } from "react"
import { ChevronUp, ChevronDown, Edit3, Eye, EyeOff, Square, CheckSquare, Edit } from "lucide-react"
import BulkEditModal from "./bulk-edit-modal"

export default function DataTable({
  data,
  headers,
  onCellEdit,
  modifiedCells,
  sortConfig,
  onSort,
  currentPage,
  itemsPerPage,
}) {
  const [editingCell, setEditingCell] = useState(null)
  const [hiddenColumns, setHiddenColumns] = useState(new Set())
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [showBulkEdit, setShowBulkEdit] = useState(false)

  // Get visible headers
  const visibleHeaders = useMemo(() => headers.filter((header) => !hiddenColumns.has(header)), [headers, hiddenColumns])

  // Toggle column visibility
  const toggleColumn = useCallback((header) => {
    setHiddenColumns((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(header)) {
        newSet.delete(header)
      } else {
        newSet.add(header)
      }
      return newSet
    })
  }, [])

  // Handle row selection
  const toggleRowSelection = useCallback((rowId) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(rowId)) {
        newSet.delete(rowId)
      } else {
        newSet.add(rowId)
      }
      return newSet
    })
  }, [])

  const toggleAllRows = useCallback(() => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(data.map((row) => row.id)))
    }
  }, [selectedRows.size, data])

  // Handle cell editing
  const handleCellClick = useCallback((rowId, field) => {
    setEditingCell(`${rowId}-${field}`)
  }, [])

  const handleCellChange = useCallback(
    (rowId, field, value) => {
      onCellEdit(rowId, field, value)
    },
    [onCellEdit],
  )

  const handleCellBlur = useCallback(() => {
    setEditingCell(null)
  }, [])

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" || e.key === "Escape") {
      setEditingCell(null)
    }
  }, [])

  // Handle bulk edit
  const handleBulkEdit = useCallback(
    (rowIds, field, value, mode) => {
      rowIds.forEach((rowId) => {
        const currentRow = data.find((row) => row.id === rowId)
        if (!currentRow) return

        let newValue = value
        if (mode === "append") {
          newValue = (currentRow[field] || "") + value
        } else if (mode === "prepend") {
          newValue = value + (currentRow[field] || "")
        }

        onCellEdit(rowId, field, newValue)
      })
      setSelectedRows(new Set())
    },
    [data, onCellEdit],
  )

  // Calculate row numbers for current page
  const getRowNumber = useCallback(
    (index) => {
      return (currentPage - 1) * itemsPerPage + index + 1
    },
    [currentPage, itemsPerPage],
  )

  const allRowsSelected = selectedRows.size === data.length && data.length > 0
  const someRowsSelected = selectedRows.size > 0 && selectedRows.size < data.length

  return (
    <div className="space-y-4">
      {/* Column Controls and Bulk Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {visibleHeaders.length} of {headers.length} columns
          {selectedRows.size > 0 && (
            <span className="ml-4 text-primary">
              {selectedRows.size} row{selectedRows.size !== 1 ? "s" : ""} selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Bulk Actions */}
          {selectedRows.size > 0 && (
            <button
              onClick={() => setShowBulkEdit(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors"
            >
              <Edit className="w-4 h-4" />
              Bulk Edit ({selectedRows.size})
            </button>
          )}

          {/* Column Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show/Hide:</span>
            <div className="flex flex-wrap gap-1">
              {headers.map((header) => (
                <button
                  key={header}
                  onClick={() => toggleColumn(header)}
                  className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                    hiddenColumns.has(header)
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary/10 text-primary hover:bg-primary/20"
                  }`}
                >
                  {hiddenColumns.has(header) ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {header}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                {/* Select All Checkbox */}
                <th className="px-4 py-3 w-12">
                  <button
                    onClick={toggleAllRows}
                    className="flex items-center justify-center w-5 h-5 rounded border border-border hover:bg-accent transition-colors"
                  >
                    {allRowsSelected ? (
                      <CheckSquare className="w-4 h-4 text-primary" />
                    ) : someRowsSelected ? (
                      <div className="w-3 h-3 bg-primary rounded-sm" />
                    ) : (
                      <Square className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </th>

                {/* Row Number Column */}
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground w-16">#</th>

                {visibleHeaders.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-sm font-medium text-foreground cursor-pointer hover:bg-muted/30 transition-colors min-w-32"
                    onClick={() => onSort(header)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="truncate">{header}</span>
                      {sortConfig.key === header &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="w-4 h-4 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 flex-shrink-0" />
                        ))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                const hasModifications = Array.from(modifiedCells).some((cell) => cell.startsWith(`${row.id}-`))
                const isSelected = selectedRows.has(row.id)

                return (
                  <tr
                    key={row.id}
                    className={`border-b border-border hover:bg-accent/5 transition-colors ${
                      hasModifications ? "row-modified" : ""
                    } ${isSelected ? "bg-primary/5" : ""}`}
                  >
                    {/* Row Selection Checkbox */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleRowSelection(row.id)}
                        className="flex items-center justify-center w-5 h-5 rounded border border-border hover:bg-accent transition-colors"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-primary" />
                        ) : (
                          <Square className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </td>

                    {/* Row Number */}
                    <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{getRowNumber(index)}</td>

                    {visibleHeaders.map((header) => {
                      const cellKey = `${row.id}-${header}`
                      const isModified = modifiedCells.has(cellKey)
                      const isEditing = editingCell === cellKey
                      const cellValue = row[header] || ""

                      return (
                        <td key={header} className={`px-4 py-3 text-sm relative ${isModified ? "cell-modified" : ""}`}>
                          {isEditing ? (
                            <input
                              type="text"
                              value={cellValue}
                              onChange={(e) => handleCellChange(row.id, header, e.target.value)}
                              onBlur={handleCellBlur}
                              onKeyDown={handleKeyDown}
                              className="w-full bg-input border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                              autoFocus
                            />
                          ) : (
                            <div
                              className="cursor-pointer hover:bg-accent/10 rounded px-2 py-1 -mx-2 -my-1 transition-colors group min-h-6 flex items-center"
                              onClick={() => handleCellClick(row.id, header)}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="truncate max-w-xs" title={cellValue}>
                                  {cellValue}
                                </span>
                                <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity ml-2 flex-shrink-0" />
                              </div>

                              {/* Modified indicator */}
                              {isModified && (
                                <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></div>
                              )}
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Rows: {data.length}</span>
          <span>Columns: {visibleHeaders.length}</span>
          <span>Modified Cells: {modifiedCells.size}</span>
          {selectedRows.size > 0 && <span>Selected: {selectedRows.size}</span>}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-primary/20 border border-primary/30 rounded"></div>
            <span>Modified</span>
          </div>
        </div>
      </div>

      {/* Bulk Edit Modal */}
      <BulkEditModal
        isOpen={showBulkEdit}
        onClose={() => setShowBulkEdit(false)}
        selectedRows={Array.from(selectedRows)}
        headers={headers}
        onBulkEdit={handleBulkEdit}
      />
    </div>
  )
}
