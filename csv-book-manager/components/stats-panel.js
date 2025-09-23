"use client"

import { useMemo } from "react"
import { BarChart3, FileText, Edit, Filter } from "lucide-react"

export default function StatsPanel({
  totalRecords,
  filteredRecords,
  modifiedCells,
  currentPage,
  totalPages,
  searchTerm,
  filterGenre,
  filterYear,
  csvData,
}) {
  // Calculate statistics
  const stats = useMemo(() => {
    if (!csvData.length) return null

    const genreCount = csvData.reduce((acc, row) => {
      const genre = row.Genre || "Unknown"
      acc[genre] = (acc[genre] || 0) + 1
      return acc
    }, {})

    const yearCount = csvData.reduce((acc, row) => {
      const year = row.PublishedYear || "Unknown"
      acc[year] = (acc[year] || 0) + 1
      return acc
    }, {})

    const topGenres = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    const yearRange = csvData
      .map((row) => Number.parseInt(row.PublishedYear))
      .filter((year) => !isNaN(year))
      .sort((a, b) => a - b)

    return {
      topGenres,
      totalGenres: Object.keys(genreCount).length,
      yearRange:
        yearRange.length > 0
          ? {
              min: yearRange[0],
              max: yearRange[yearRange.length - 1],
            }
          : null,
      totalAuthors: new Set(csvData.map((row) => row.Author)).size,
    }
  }, [csvData])

  const hasActiveFilters = searchTerm || filterGenre || filterYear

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Records */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Records</p>
            <p className="text-2xl font-semibold text-foreground">{totalRecords.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filtered Records */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-chart-2/10 rounded-lg">
            <Filter className="w-5 h-5 text-chart-2" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{hasActiveFilters ? "Filtered" : "Showing"}</p>
            <p className="text-2xl font-semibold text-foreground">{filteredRecords.toLocaleString()}</p>
            {hasActiveFilters && (
              <p className="text-xs text-muted-foreground">
                {((filteredRecords / totalRecords) * 100).toFixed(1)}% of total
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modified Cells */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-warning/10 rounded-lg">
            <Edit className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Modified Cells</p>
            <p className="text-2xl font-semibold text-foreground">{modifiedCells}</p>
            {modifiedCells > 0 && <p className="text-xs text-success">Unsaved changes</p>}
          </div>
        </div>
      </div>

      {/* Page Info */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-chart-3/10 rounded-lg">
            <BarChart3 className="w-5 h-5 text-chart-3" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Page</p>
            <p className="text-2xl font-semibold text-foreground">
              {currentPage} / {totalPages}
            </p>
            <p className="text-xs text-muted-foreground">50 records per page</p>
          </div>
        </div>
      </div>

      {/* Data Insights - spans full width on larger screens */}
      {stats && (
        <div className="md:col-span-2 lg:col-span-4 bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Data Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-2">Top Genres</p>
              <div className="space-y-1">
                {stats.topGenres.map(([genre, count]) => (
                  <div key={genre} className="flex justify-between">
                    <span className="truncate">{genre}</span>
                    <span className="text-muted-foreground">{count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-muted-foreground mb-2">Collection Stats</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Total Authors</span>
                  <span className="text-muted-foreground">{stats.totalAuthors.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Genres</span>
                  <span className="text-muted-foreground">{stats.totalGenres}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground mb-2">Publication Years</p>
              {stats.yearRange ? (
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Earliest</span>
                    <span className="text-muted-foreground">{stats.yearRange.min}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Latest</span>
                    <span className="text-muted-foreground">{stats.yearRange.max}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Span</span>
                    <span className="text-muted-foreground">{stats.yearRange.max - stats.yearRange.min} years</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No valid years found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
