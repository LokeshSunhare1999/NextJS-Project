"use client"

import { useState, useCallback } from "react"
import { X, RotateCcw, AlertTriangle } from "lucide-react"

export default function ResetConfirmationModal({ isOpen, onClose, onConfirm, modifiedCellsCount }) {
  const [confirmText, setConfirmText] = useState("")
  const requiredText = "RESET"

  const handleConfirm = useCallback(() => {
    if (confirmText === requiredText) {
      onConfirm()
      onClose()
      setConfirmText("")
    }
  }, [confirmText, requiredText, onConfirm, onClose])

  const handleClose = useCallback(() => {
    onClose()
    setConfirmText("")
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Reset All Changes</h2>
          <button onClick={handleClose} className="p-1 hover:bg-accent rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-destructive mb-1">This action cannot be undone</p>
              <p className="text-destructive/80">
                All {modifiedCellsCount} modified cell{modifiedCellsCount !== 1 ? "s" : ""} will be reverted to their
                original values. Any unsaved changes will be permanently lost.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Type <span className="font-mono bg-muted px-1 rounded">{requiredText}</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={`Type "${requiredText}" here...`}
              autoFocus
            />
          </div>

          <div className="text-xs text-muted-foreground">
            <p>What will be reset:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>All cell modifications ({modifiedCellsCount} cells)</li>
              <li>Data will revert to original uploaded state</li>
              <li>Filters and view settings will remain unchanged</li>
            </ul>
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
            onClick={handleConfirm}
            disabled={confirmText !== requiredText}
            className="flex items-center gap-2 px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All Changes
          </button>
        </div>
      </div>
    </div>
  )
}
