"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Calendar, Clock, Edit, Trash2 } from "lucide-react"
import { formatDate, type CalendarEvent } from "@/lib/calendar-utils"
import { EventDialog } from "./event-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface EventSidebarProps {
  selectedDate: Date | null
  events: CalendarEvent[]
  onAddEvent: (event: Omit<CalendarEvent, "id" | "createdAt">) => void
  onUpdateEvent: (eventId: string, event: Omit<CalendarEvent, "id" | "createdAt">) => void
  onDeleteEvent: (eventId: string) => void
}

export function EventSidebar({ selectedDate, events, onAddEvent, onUpdateEvent, onDeleteEvent }: EventSidebarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>()
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null)

  const selectedDateEvents = selectedDate ? events.filter((event) => event.date === formatDate(selectedDate)) : []

  const handleAddEvent = () => {
    setEditingEvent(undefined)
    setIsDialogOpen(true)
  }

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event)
    setIsDialogOpen(true)
  }

  const handleDeleteEvent = (eventId: string) => {
    setDeleteEventId(eventId)
  }

  const confirmDelete = () => {
    if (deleteEventId) {
      onDeleteEvent(deleteEventId)
      setDeleteEventId(null)
    }
  }

  const formatTime = (time: string) => {
    if (!time) return ""
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <>
      <div className="w-80 bg-card border-l border-border p-6 overflow-y-auto">
        <div className="space-y-6">
          {selectedDate ? (
            <>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? "s" : ""}
                </p>
              </div>

              <Separator />

              <Button onClick={handleAddEvent} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>

              {/* Events List */}
              <div className="space-y-3">
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents
                    .sort((a, b) => {
                      // Sort by time, then by title
                      if (a.time && b.time) {
                        return a.time.localeCompare(b.time)
                      }
                      if (a.time && !b.time) return -1
                      if (!a.time && b.time) return 1
                      return a.title.localeCompare(b.title)
                    })
                    .map((event) => (
                      <Card key={event.id} className="relative group">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground truncate">{event.title}</h4>
                              {event.time && (
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {formatTime(event.time)}
                                </div>
                              )}
                              {event.description && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{event.description}</p>
                              )}
                            </div>
                            <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditEvent(event)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteEvent(event.id)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-sm text-muted-foreground">No events for this date</p>
                    <p className="text-xs text-muted-foreground mt-1">Click "Add Event" to create one</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Select a Date</h3>
              <p className="text-sm text-muted-foreground">Click on a date in the calendar to view and manage events</p>
            </div>
          )}
        </div>
      </div>

      <EventDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedDate={selectedDate}
        event={editingEvent}
        onSave={onAddEvent}
        onUpdate={onUpdateEvent}
      />

      <AlertDialog open={!!deleteEventId} onOpenChange={() => setDeleteEventId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
