export interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  description?: string
  createdAt: Date
}

export function getDaysInMonth(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const days: Date[] = []

  // Add empty days for the previous month
  for (let i = 0; i < startingDayOfWeek; i++) {
    const prevDate = new Date(year, month, -startingDayOfWeek + i + 1)
    days.push(prevDate)
  }

  // Add days for the current month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day))
  }

  // Add empty days for the next month to complete the grid
  const remainingDays = 42 - days.length // 6 rows × 7 days
  for (let day = 1; day <= remainingDays; day++) {
    days.push(new Date(year, month + 1, day))
  }

  return days
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

export function isSameMonth(date: Date, month: number, year: number): boolean {
  return date.getMonth() === month && date.getFullYear() === year
}

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
