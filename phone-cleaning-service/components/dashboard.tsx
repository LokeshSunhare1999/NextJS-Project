"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { AppSidebar } from "@/components/app-sidebar"
import { Navbar } from "@/components/navbar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookingModal } from "@/components/booking-modal"
import { Calendar, Clock, Smartphone, Star, TrendingUp, CheckCircle } from "lucide-react"

const quickStats = [
  {
    title: "Total Bookings",
    value: "12",
    change: "+2 this month",
    icon: Calendar,
    color: "text-blue-600",
  },
  {
    title: "Completed Services",
    value: "8",
    change: "+3 this week",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Upcoming",
    value: "2",
    change: "Next: Tomorrow",
    icon: Clock,
    color: "text-orange-600",
  },
  {
    title: "Saved Devices",
    value: "4",
    change: "iPhone, Samsung...",
    icon: Smartphone,
    color: "text-purple-600",
  },
]

const recentBookings = [
  {
    id: "1",
    service: "Premium Deep Clean",
    device: "iPhone 15 Pro Max",
    date: "2024-01-15",
    time: "2:00 PM",
    status: "completed",
    amount: 49.99,
  },
  {
    id: "2",
    service: "Screen Protection",
    device: "Samsung Galaxy S24",
    date: "2024-01-20",
    time: "10:30 AM",
    status: "confirmed",
    amount: 29.99,
  },
  {
    id: "3",
    service: "Performance Boost",
    device: "Google Pixel 8",
    date: "2024-01-25",
    time: "3:15 PM",
    status: "pending",
    amount: 19.99,
  },
]

export function Dashboard() {
  const { user } = useAuth()
  const [showBookingModal, setShowBookingModal] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6 space-y-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-muted-foreground mt-1">Manage your device care services and bookings</p>
            </div>
            <Button
              onClick={() => setShowBookingModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Book Service
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {quickStats.map((stat, index) => (
              <Card key={index} className="bg-white/60 backdrop-blur-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-gradient-to-br from-blue-100 to-purple-100`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Bookings */}
          <Card className="bg-white/60 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Bookings
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg bg-white/50">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
                        <Smartphone className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{booking.service}</p>
                        <p className="text-sm text-muted-foreground">{booking.device}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {booking.date} at {booking.time}
                      </p>
                      <p className="font-medium">${booking.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Premium Membership</h3>
                    <p className="text-blue-100 mb-4">Upgrade to get 20% off all services and priority booking</p>
                    <Button variant="secondary" size="sm">
                      Learn More
                    </Button>
                  </div>
                  <Star className="h-12 w-12 text-yellow-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Refer Friends</h3>
                    <p className="text-muted-foreground mb-4">Get $10 credit for each friend you refer</p>
                    <Button variant="outline" size="sm">
                      Share Link
                    </Button>
                  </div>
                  <TrendingUp className="h-12 w-12 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <BookingModal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} />
    </SidebarProvider>
  )
}
