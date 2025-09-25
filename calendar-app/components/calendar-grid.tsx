"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  getDaysInMonth,
  formatDate,
  isSameDay,
  isToday,
  isSameMonth,
  MONTH_NAMES,
  DAY_NAMES,
  type CalendarEvent,
} from "@/lib/calendar-utils"
import { cn } from "@/lib/utils"

interface CalendarGridProps {
  events: CalendarEvent[]
  onDateClick: (date: Date) => void
  selectedDate: Date | null
}

export function CalendarGrid({ events, onDateClick, selectedDate }: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const days = getDaysInMonth(currentYear, currentMonth)

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const getEventsForDate = (date: Date) => {
    const dateString = formatDate(date)
    return events.filter((event) => event.date === dateString)
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Day Names Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAY_NAMES.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const dateEvents = getEventsForDate(date)
          const isCurrentMonth = isSameMonth(date, currentMonth, currentYear)
          const isTodayDate = isToday(date)
          const isSelected = selectedDate && isSameDay(date, selectedDate)

          return (
            <button
              key={index}
              onClick={() => onDateClick(date)}
              className={cn(
                "min-h-[100px] p-2 text-left border border-border/50 hover:bg-accent/50 transition-colors rounded-md",
                {
                  "bg-accent/30": isTodayDate,
                  "bg-primary/10 border-primary/30": isSelected,
                  "text-muted-foreground": !isCurrentMonth,
                  "text-foreground": isCurrentMonth,
                },
              )}
            >
              <div className="flex flex-col h-full">
                <span
                  className={cn("text-sm font-medium mb-1", {
                    "text-primary font-bold": isTodayDate,
                  })}
                >
                  {date.getDate()}
                </span>
                <div className="flex-1 space-y-1">
                  {dateEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs bg-primary/20 text-primary px-1 py-0.5 rounded truncate"
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dateEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground">+{dateEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
