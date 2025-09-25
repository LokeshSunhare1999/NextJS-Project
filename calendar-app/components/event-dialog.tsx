"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatDate, type CalendarEvent } from "@/lib/calendar-utils"

interface EventDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date | null
  event?: CalendarEvent
  onSave: (event: Omit<CalendarEvent, "id" | "createdAt">) => void
  onUpdate?: (eventId: string, event: Omit<CalendarEvent, "id" | "createdAt">) => void
}

export function EventDialog({ isOpen, onClose, selectedDate, event, onSave, onUpdate }: EventDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    time: "",
    description: "",
  })

  const isEditing = !!event

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        time: event.time,
        description: event.description || "",
      })
    } else {
      setFormData({
        title: "",
        time: "",
        description: "",
      })
    }
  }, [event, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !formData.title.trim()) return

    const eventData = {
      title: formData.title.trim(),
      date: formatDate(selectedDate),
      time: formData.time,
      description: formData.description.trim(),
    }

    if (isEditing && event && onUpdate) {
      onUpdate(event.id, eventData)
    } else {
      onSave(eventData)
    }

    handleClose()
  }

  const handleClose = () => {
    setFormData({ title: "", time: "", description: "" })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Event" : "Add New Event"}</DialogTitle>
          <DialogDescription>
            {selectedDate &&
              `${isEditing ? "Update the" : "Create a new"} event for ${selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                placeholder="Enter event title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add event description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Update Event" : "Add Event"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
