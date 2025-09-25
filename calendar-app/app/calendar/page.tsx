"use client"

import { useState, useEffect } from "react"
import { CalendarGrid } from "@/components/calendar-grid"
import { EventSidebar } from "@/components/event-sidebar"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { CalendarEvent } from "@/lib/calendar-utils"

export default function CalendarPage() {
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>("calendar-events", [])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    setSelectedDate(new Date())
  }, [])

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const handleAddEvent = (eventData: Omit<CalendarEvent, "id" | "createdAt">) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setEvents((prev) => [...prev, newEvent])
  }

  const handleUpdateEvent = (eventId: string, eventData: Omit<CalendarEvent, "id" | "createdAt">) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              ...eventData,
            }
          : event,
      ),
    )
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex-1 p-6">
        <CalendarGrid events={events} onDateClick={handleDateClick} selectedDate={selectedDate} />
      </div>
      <EventSidebar
        selectedDate={selectedDate}
        events={events}
        onAddEvent={handleAddEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </div>
  )
}
