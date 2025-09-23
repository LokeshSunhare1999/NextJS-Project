"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { Download, RotateCcw, Database, Save } from "lucide-react"
import FileUpload from "../components/file-upload"
import DataTable from "../components/data-table"
import StatsPanel from "../components/stats-panel"
import AdvancedFilters from "../components/advanced-filters"
import ExportModal from "../components/export-modal"
import ResetConfirmationModal from "../components/reset-confirmation-modal"

export default function CSVManager() {
  const [csvData, setCsvData] = useState([])
  const [originalData, setOriginalData] = useState([])
  const [headers, setHeaders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })
  const [currentPage, setCurrentPage] = useState(1)
  const [modifiedCells, setModifiedCells] = useState(new Set())
  const [filterGenre, setFilterGenre] = useState("")
  const [filterYear, setFilterYear] = useState("")
  const [advancedFilters, setAdvancedFilters] = useState({
    authorFilter: "",
    yearRange: { min: "", max: "" },
    titleContains: "",
    isbnFilter: "",
  })
  const [showExportModal, setShowExportModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)

  const itemsPerPage = 50

  useEffect(() => {
    const handleLoadSampleData = () => {
      loadSampleData()
    }

    window.addEventListener("loadSampleData", handleLoadSampleData)
    return () => window.removeEventListener("loadSampleData", handleLoadSampleData)
  }, [])

  // Auto-save functionality (simulated)
  useEffect(() => {
    if (modifiedCells.size > 0) {
      const timer = setTimeout(() => {
        setLastSaved(new Date())
      }, 2000) // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer)
    }
  }, [modifiedCells])

  // Load sample data
  const loadSampleData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/sample_data.csv")
      const csvText = await response.text()
      parseCsvData(csvText)
    } catch (error) {
      console.error("Error loading sample data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Parse CSV data
  const parseCsvData = useCallback((csvText) => {
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
    const data = lines.slice(1).map((line, index) => {
      const values = []
      let current = ""
      let inQuotes = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          values.push(current.trim().replace(/"/g, ""))
          current = ""
        } else {
          current += char
        }
      }
      values.push(current.trim().replace(/"/g, ""))

      const row = { id: index }
      headers.forEach((header, i) => {
        row[header] = values[i] || ""
      })
      return row
    })

    setHeaders(headers)
    setCsvData(data)
    setOriginalData(JSON.parse(JSON.stringify(data)))
    setModifiedCells(new Set())
    setCurrentPage(1)
    setLastSaved(null)
  }, [])

  const handleFileLoad = useCallback(
    (csvText) => {
      parseCsvData(csvText)
    },
    [parseCsvData],
  )

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    const filtered = csvData.filter((row) => {
      // Basic search
      const matchesSearch = Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      )

      // Basic filters
      const matchesGenre = !filterGenre || row.Genre === filterGenre
      const matchesYear = !filterYear || row.PublishedYear === filterYear

      // Advanced filters
      const matchesAuthor = !advancedFilters.authorFilter || row.Author === advancedFilters.authorFilter
      const matchesTitle =
        !advancedFilters.titleContains || row.Title.toLowerCase().includes(advancedFilters.titleContains.toLowerCase())
      const matchesISBN =
        !advancedFilters.isbnFilter || row.ISBN.toLowerCase().includes(advancedFilters.isbnFilter.toLowerCase())

      // Year range filter
      const matchesYearRange = (() => {
        if (!advancedFilters.yearRange.min && !advancedFilters.yearRange.max) return true
        const year = Number.parseInt(row.PublishedYear)
        if (isNaN(year)) return false

        const minYear = advancedFilters.yearRange.min
          ? Number.parseInt(advancedFilters.yearRange.min)
          : Number.NEGATIVE_INFINITY
        const maxYear = advancedFilters.yearRange.max
          ? Number.parseInt(advancedFilters.yearRange.max)
          : Number.POSITIVE_INFINITY

        return year >= minYear && year <= maxYear
      })()

      return (
        matchesSearch && matchesGenre && matchesYear && matchesAuthor && matchesTitle && matchesISBN && matchesYearRange
      )
    })

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key]
        const bVal = b[sortConfig.key]

        if (sortConfig.key === "PublishedYear") {
          return sortConfig.direction === "asc"
            ? Number.parseInt(aVal) - Number.parseInt(bVal)
            : Number.parseInt(bVal) - Number.parseInt(aVal)
        }

        return sortConfig.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      })
    }

    return filtered
  }, [csvData, searchTerm, sortConfig, filterGenre, filterYear, advancedFilters])

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedData, currentPage])

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)

  // Handle sorting
  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }, [])

  // Handle cell editing
  const handleCellEdit = useCallback((rowId, field, value) => {
    setCsvData((prev) => prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)))
    setModifiedCells((prev) => new Set([...prev, `${rowId}-${field}`]))
  }, [])

  // Reset all edits
  const resetAllEdits = useCallback(() => {
    setCsvData(JSON.parse(JSON.stringify(originalData)))
    setModifiedCells(new Set())
    setLastSaved(null)
  }, [originalData])

  // Quick save (simulated)
  const handleQuickSave = useCallback(() => {
    setLastSaved(new Date())
    // In a real app, this would save to a backend
  }, [])

  // Download CSV (legacy function for backward compatibility)
  const downloadCsv = useCallback(() => {
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            return value.includes(",") ? `"${value}"` : value
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "edited-books.csv"
    a.click()
    URL.revokeObjectURL(url)
  }, [csvData, headers])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-semibold text-foreground">CSV Book Manager</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Upload, edit, and manage book data</span>
                  {lastSaved && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Save className="w-3 h-3" />
                        <span>Saved {lastSaved.toLocaleTimeString()}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {csvData.length > 0 && (
                <>
                  {modifiedCells.size > 0 && (
                    <button
                      onClick={handleQuickSave}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-success/10 hover:bg-success/20 text-success border border-success/20 rounded-md transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Quick Save
                    </button>
                  )}

                  <button
                    onClick={() => setShowResetModal(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition-colors"
                    disabled={modifiedCells.size === 0}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset All
                  </button>

                  <button
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {csvData.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-card border border-border rounded-lg p-8 max-w-lg mx-auto">
              <Database className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-semibold mb-3">Welcome to CSV Book Manager</h2>
              <p className="text-muted-foreground mb-8">
                Upload your CSV file or try our sample data to get started managing your book collection
              </p>

              <FileUpload onFileLoad={handleFileLoad} isLoading={isLoading} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Panel */}
            <StatsPanel
              totalRecords={csvData.length}
              filteredRecords={filteredAndSortedData.length}
              modifiedCells={modifiedCells.size}
              currentPage={currentPage}
              totalPages={totalPages}
              searchTerm={searchTerm}
              filterGenre={filterGenre}
              filterYear={filterYear}
              csvData={csvData}
            />

            {/* Advanced Filters */}
            <AdvancedFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterGenre={filterGenre}
              onGenreChange={setFilterGenre}
              filterYear={filterYear}
              onYearChange={setFilterYear}
              csvData={csvData}
              onAdvancedFilter={setAdvancedFilters}
            />

            {/* Data Table */}
            <DataTable
              data={paginatedData}
              headers={headers}
              onCellEdit={handleCellEdit}
              modifiedCells={modifiedCells}
              sortConfig={sortConfig}
              onSort={handleSort}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length}{" "}
                  results
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm rounded-md transition-colors ${
                            currentPage === pageNum
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        csvData={csvData}
        headers={headers}
        filteredData={filteredAndSortedData}
        modifiedCells={modifiedCells}
      />

      <ResetConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={resetAllEdits}
        modifiedCellsCount={modifiedCells.size}
      />
    </div>
  )
}
