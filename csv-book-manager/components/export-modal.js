"use client"

import { useState, useCallback, useMemo } from "react"
import { X, Download, FileText, Filter, CheckSquare, Square } from "lucide-react"

export default function ExportModal({ isOpen, onClose, csvData, headers, filteredData, modifiedCells }) {
  const [exportType, setExportType] = useState("all") // 'all', 'filtered', 'modified'
  const [selectedColumns, setSelectedColumns] = useState(new Set(headers))
  const [includeRowNumbers, setIncludeRowNumbers] = useState(false)
  const [filename, setFilename] = useState("books-export")

  // Get data based on export type
  const exportData = useMemo(() => {
    switch (exportType) {
      case "filtered":
        return filteredData
      case "modified":
        return csvData.filter((row) => Array.from(modifiedCells).some((cellKey) => cellKey.startsWith(`${row.id}-`)))
      default:
        return csvData
    }
  }, [exportType, csvData, filteredData, modifiedCells])

  // Get selected headers
  const exportHeaders = useMemo(() => {
    const selected = headers.filter((header) => selectedColumns.has(header))
    return includeRowNumbers ? ["Row", ...selected] : selected
  }, [headers, selectedColumns, includeRowNumbers])

  // Toggle column selection
  const toggleColumn = useCallback((header) => {
    setSelectedColumns((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(header)) {
        newSet.delete(header)
      } else {
        newSet.add(header)
      }
      return newSet
    })
  }, [])

  const toggleAllColumns = useCallback(() => {
    if (selectedColumns.size === headers.length) {
      setSelectedColumns(new Set())
    } else {
      setSelectedColumns(new Set(headers))
    }
  }, [headers, selectedColumns.size])

  // Handle export
  const handleExport = useCallback(() => {
    if (selectedColumns.size === 0) return

    const csvContent = [
      exportHeaders.join(","),
      ...exportData.map((row, index) => {
        const values = []
        if (includeRowNumbers) {
          values.push(index + 1)
        }
        headers.forEach((header) => {
          if (selectedColumns.has(header)) {
            const value = row[header] || ""
            values.push(value.includes(",") ? `"${value}"` : value)
          }
        })
        return values.join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    URL.revokeObjectURL(url)

    onClose()
  }, [exportData, exportHeaders, headers, selectedColumns, includeRowNumbers, filename, onClose])

  const handleClose = useCallback(() => {
    onClose()
    setExportType("all")
    setSelectedColumns(new Set(headers))
    setIncludeRowNumbers(false)
    setFilename("books-export")
  }, [onClose, headers])

  if (!isOpen) return null

  const allColumnsSelected = selectedColumns.size === headers.length
  const someColumnsSelected = selectedColumns.size > 0 && selectedColumns.size < headers.length

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Export CSV Data</h2>
          <button onClick={handleClose} className="p-1 hover:bg-accent rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Export Type */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">What to Export</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-border rounded-md hover:bg-accent/5 cursor-pointer">
                <input
                  type="radio"
                  name="exportType"
                  value="all"
                  checked={exportType === "all"}
                  onChange={(e) => setExportType(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">All Records</div>
                    <div className="text-xs text-muted-foreground">{csvData.length.toLocaleString()} records</div>
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-border rounded-md hover:bg-accent/5 cursor-pointer">
                <input
                  type="radio"
                  name="exportType"
                  value="filtered"
                  checked={exportType === "filtered"}
                  onChange={(e) => setExportType(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Filtered Records</div>
                    <div className="text-xs text-muted-foreground">
                      {filteredData.length.toLocaleString()} records (current view)
                    </div>
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-border rounded-md hover:bg-accent/5 cursor-pointer">
                <input
                  type="radio"
                  name="exportType"
                  value="modified"
                  checked={exportType === "modified"}
                  onChange={(e) => setExportType(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary/20 border border-primary/30 rounded"></div>
                  <div>
                    <div className="text-sm font-medium">Modified Records Only</div>
                    <div className="text-xs text-muted-foreground">
                      {
                        csvData.filter((row) =>
                          Array.from(modifiedCells).some((cellKey) => cellKey.startsWith(`${row.id}-`)),
                        ).length
                      }{" "}
                      records with changes
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Column Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-foreground">Columns to Include</h3>
              <button
                onClick={toggleAllColumns}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                {allColumnsSelected ? (
                  <CheckSquare className="w-4 h-4" />
                ) : someColumnsSelected ? (
                  <div className="w-4 h-4 border border-primary rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-sm" />
                  </div>
                ) : (
                  <Square className="w-4 h-4" />
                )}
                {allColumnsSelected ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-border rounded-md p-3">
              {headers.map((header) => (
                <label key={header} className="flex items-center gap-2 cursor-pointer hover:bg-accent/5 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={selectedColumns.has(header)}
                    onChange={() => toggleColumn(header)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm truncate" title={header}>
                    {header}
                  </span>
                </label>
              ))}
            </div>

            <div className="text-xs text-muted-foreground mt-2">
              {selectedColumns.size} of {headers.length} columns selected
            </div>
          </div>

          {/* Additional Options */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Additional Options</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeRowNumbers}
                  onChange={(e) => setIncludeRowNumbers(e.target.checked)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">Include row numbers</span>
              </label>
            </div>
          </div>

          {/* Filename */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Filename</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter filename..."
              />
              <span className="text-sm text-muted-foreground">.csv</span>
            </div>
          </div>

          {/* Export Preview */}
          <div className="bg-muted/20 border border-border rounded-md p-3">
            <h4 className="text-sm font-medium text-foreground mb-2">Export Preview</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Records: {exportData.length.toLocaleString()}</div>
              <div>Columns: {selectedColumns.size}</div>
              <div>Filename: {filename}.csv</div>
              <div>Estimated size: {Math.round((exportData.length * selectedColumns.size * 15) / 1024)} KB</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-border">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={selectedColumns.size === 0}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  )
}
