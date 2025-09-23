"use client"

import { useState, useCallback } from "react"
import { X, Save, AlertTriangle } from "lucide-react"

export default function BulkEditModal({ isOpen, onClose, selectedRows, headers, onBulkEdit }) {
  const [editField, setEditField] = useState("")
  const [editValue, setEditValue] = useState("")
  const [editMode, setEditMode] = useState("replace") // 'replace', 'append', 'prepend'

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      if (!editField || !editValue) return

      onBulkEdit(selectedRows, editField, editValue, editMode)
      onClose()
      setEditField("")
      setEditValue("")
      setEditMode("replace")
    },
    [editField, editValue, editMode, selectedRows, onBulkEdit, onClose],
  )

  const handleClose = useCallback(() => {
    onClose()
    setEditField("")
    setEditValue("")
    setEditMode("replace")
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Bulk Edit Records</h2>
          <button onClick={handleClose} className="p-1 hover:bg-accent rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-md">
            <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
            <p className="text-sm text-warning">
              This will modify {selectedRows.length} selected record{selectedRows.length !== 1 ? "s" : ""}.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Field to Edit</label>
            <select
              value={editField}
              onChange={(e) => setEditField(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="">Select a field...</option>
              {headers.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Edit Mode</label>
            <select
              value={editMode}
              onChange={(e) => setEditMode(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="replace">Replace entire value</option>
              <option value="append">Append to end</option>
              <option value="prepend">Prepend to beginning</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {editMode === "replace" ? "New Value" : editMode === "append" ? "Text to Append" : "Text to Prepend"}
            </label>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={
                editMode === "replace"
                  ? "Enter new value..."
                  : editMode === "append"
                    ? "Text to add at end..."
                    : "Text to add at beginning..."
              }
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors"
            >
              <Save className="w-4 h-4" />
              Apply Changes
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
