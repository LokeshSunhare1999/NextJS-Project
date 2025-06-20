"use client"

import { useAuth } from "@/lib/auth-context"
import { useBooking } from "@/lib/booking-context"
import { AppSidebar } from "@/components/app-sidebar"
import { Navbar } from "@/components/navbar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Smartphone, Phone, Mail } from "lucide-react"
import { format } from "date-fns"

export default function BookingsPage() {
  const { user } = useAuth()
  const { getUserBookings, updateBookingStatus } = useBooking()

  const userBookings = getUserBookings(user?.id)
  const upcomingBookings = userBookings.filter((b) => b.status === "confirmed" || b.status === "pending")
  const pastBookings = userBookings.filter((b) => b.status === "completed" || b.status === "cancelled")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCancelBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, "cancelled")
  }

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="bg-white/60 backdrop-blur-sm border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{booking.service.name}</CardTitle>
          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            <span>{booking.phoneModel}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(booking.date), "MMM dd, yyyy")}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {booking.time} ({booking.service.duration} mins)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">${booking.totalAmount}</span>
          </div>
        </div>

        {booking.guestInfo && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Contact Information</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3" />
                <span>{booking.guestInfo.email}</span>
              </div>
              {booking.guestInfo.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3" />
                  <span>{booking.guestInfo.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Booked on {format(new Date(booking.createdAt), "MMM dd, yyyy")}
          </div>
          {booking.status === "confirmed" && (
            <Button variant="outline" size="sm" onClick={() => handleCancelBooking(booking.id)}>
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-muted-foreground">You need to be signed in to view your bookings.</p>
        </Card>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Bookings
              </h1>
              <p className="text-muted-foreground mt-1">Manage your device care appointments</p>
            </div>

            <Tabs defaultValue="upcoming" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
                <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                {upcomingBookings.length === 0 ? (
                  <Card className="p-8 text-center bg-white/60 backdrop-blur-sm border-0">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Upcoming Bookings</h3>
                    <p className="text-muted-foreground">
                      You don't have any upcoming appointments. Book a service to get started!
                    </p>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {upcomingBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                {pastBookings.length === 0 ? (
                  <Card className="p-8 text-center bg-white/60 backdrop-blur-sm border-0">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Past Bookings</h3>
                    <p className="text-muted-foreground">Your completed and cancelled bookings will appear here.</p>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {pastBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
