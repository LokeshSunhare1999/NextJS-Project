"use client"

import { useState, useCallback, useMemo } from "react"
import { Search, Filter, X, Calendar, BookOpen, User, Hash } from "lucide-react"

export default function AdvancedFilters({
  searchTerm,
  onSearchChange,
  filterGenre,
  onGenreChange,
  filterYear,
  onYearChange,
  csvData,
  onAdvancedFilter,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({
    authorFilter: "",
    yearRange: { min: "", max: "" },
    titleContains: "",
    isbnFilter: "",
  })

  // Get unique values for dropdowns
  const uniqueGenres = useMemo(() => [...new Set(csvData.map((row) => row.Genre))].sort(), [csvData])

  const uniqueYears = useMemo(
    () => [...new Set(csvData.map((row) => row.PublishedYear))].sort((a, b) => b - a),
    [csvData],
  )

  const uniqueAuthors = useMemo(() => [...new Set(csvData.map((row) => row.Author))].sort(), [csvData])

  // Handle advanced filter changes
  const handleAdvancedFilterChange = useCallback(
    (key, value) => {
      setAdvancedFilters((prev) => {
        const newFilters = { ...prev, [key]: value }
        onAdvancedFilter(newFilters)
        return newFilters
      })
    },
    [onAdvancedFilter],
  )

  const handleYearRangeChange = useCallback(
    (type, value) => {
      setAdvancedFilters((prev) => {
        const newFilters = {
          ...prev,
          yearRange: { ...prev.yearRange, [type]: value },
        }
        onAdvancedFilter(newFilters)
        return newFilters
      })
    },
    [onAdvancedFilter],
  )

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    onSearchChange("")
    onGenreChange("")
    onYearChange("")
    setAdvancedFilters({
      authorFilter: "",
      yearRange: { min: "", max: "" },
      titleContains: "",
      isbnFilter: "",
    })
    onAdvancedFilter({
      authorFilter: "",
      yearRange: { min: "", max: "" },
      titleContains: "",
      isbnFilter: "",
    })
  }, [onSearchChange, onGenreChange, onYearChange, onAdvancedFilter])

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm ||
      filterGenre ||
      filterYear ||
      advancedFilters.authorFilter ||
      advancedFilters.yearRange.min ||
      advancedFilters.yearRange.max ||
      advancedFilters.titleContains ||
      advancedFilters.isbnFilter
    )
  }, [searchTerm, filterGenre, filterYear, advancedFilters])

  return (
    <div className="space-y-4">
      {/* Basic Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* Global Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search all fields..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring w-64"
            />
          </div>

          {/* Genre Filter */}
          <div className="relative">
            <BookOpen className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <select
              value={filterGenre}
              onChange={(e) => onGenreChange(e.target.value)}
              className="pl-10 pr-4 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none min-w-32"
            >
              <option value="">All Genres</option>
              {uniqueGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <select
              value={filterYear}
              onChange={(e) => onYearChange(e.target.value)}
              className="pl-10 pr-4 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none min-w-32"
            >
              <option value="">All Years</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
              showAdvanced
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            }`}
          >
            <Filter className="w-4 h-4" />
            Advanced
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Advanced Filters</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Author Filter */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Author</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <select
                  value={advancedFilters.authorFilter}
                  onChange={(e) => handleAdvancedFilterChange("authorFilter", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                >
                  <option value="">All Authors</option>
                  {uniqueAuthors.map((author) => (
                    <option key={author} value={author}>
                      {author}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title Contains */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Title Contains</label>
              <input
                type="text"
                placeholder="Search in titles..."
                value={advancedFilters.titleContains}
                onChange={(e) => handleAdvancedFilterChange("titleContains", e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* ISBN Filter */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">ISBN</label>
              <div className="relative">
                <Hash className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search ISBN..."
                  value={advancedFilters.isbnFilter}
                  onChange={(e) => handleAdvancedFilterChange("isbnFilter", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Year Range */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm text-muted-foreground mb-2">Publication Year Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="From"
                  value={advancedFilters.yearRange.min}
                  onChange={(e) => handleYearRangeChange("min", e.target.value)}
                  className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  min="1800"
                  max="2024"
                />
                <span className="text-muted-foreground">to</span>
                <input
                  type="number"
                  placeholder="To"
                  value={advancedFilters.yearRange.max}
                  onChange={(e) => handleYearRangeChange("max", e.target.value)}
                  className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  min="1800"
                  max="2024"
                />
              </div>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="pt-3 border-t border-border">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                    Search: "{searchTerm}"
                    <button onClick={() => onSearchChange("")} className="hover:bg-primary/20 rounded p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterGenre && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-chart-2/10 text-chart-2 text-xs rounded">
                    Genre: {filterGenre}
                    <button onClick={() => onGenreChange("")} className="hover:bg-chart-2/20 rounded p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterYear && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-chart-3/10 text-chart-3 text-xs rounded">
                    Year: {filterYear}
                    <button onClick={() => onYearChange("")} className="hover:bg-chart-3/20 rounded p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {advancedFilters.authorFilter && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-chart-4/10 text-chart-4 text-xs rounded">
                    Author: {advancedFilters.authorFilter}
                    <button
                      onClick={() => handleAdvancedFilterChange("authorFilter", "")}
                      className="hover:bg-chart-4/20 rounded p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
