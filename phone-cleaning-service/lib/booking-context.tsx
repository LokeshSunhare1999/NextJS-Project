"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface Service {
  id: string
  name: string
  price: number
  duration: number
  description: string
  features: string[]
}

export interface Booking {
  id: string
  userId?: string
  guestInfo?: {
    name: string
    email: string
    phone: string
  }
  service: Service
  phoneModel: string
  date: string
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  totalAmount: number
  createdAt: string
}

interface BookingContextType {
  bookings: Booking[]
  addBooking: (booking: Omit<Booking, "id" | "createdAt">) => void
  updateBookingStatus: (id: string, status: Booking["status"]) => void
  getUserBookings: (userId?: string) => Booking[]
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([])

  const addBooking = (booking: Omit<Booking, "id" | "createdAt">) => {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setBookings((prev) => [...prev, newBooking])
  }

  const updateBookingStatus = (id: string, status: Booking["status"]) => {
    setBookings((prev) => prev.map((booking) => (booking.id === id ? { ...booking, status } : booking)))
  }

  const getUserBookings = (userId?: string) => {
    return bookings.filter((booking) => (userId ? booking.userId === userId : !booking.userId))
  }

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        updateBookingStatus,
        getUserBookings,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}
