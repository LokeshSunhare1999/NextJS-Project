"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AuthModal } from "@/components/auth-modal"
import { BookingModal } from "@/components/booking-modal"
import { Smartphone, Shield, Sparkles, Clock, Star, ArrowRight, Users, Award, Zap } from "lucide-react"

const services = [
  {
    icon: Sparkles,
    title: "Premium Deep Clean",
    description: "Complete device sanitization with professional-grade equipment",
    price: "From $39",
  },
  {
    icon: Shield,
    title: "Screen Protection",
    description: "Premium screen protector application with lifetime warranty",
    price: "From $29",
  },
  {
    icon: Zap,
    title: "Performance Boost",
    description: "Software optimization and cache cleaning for better performance",
    price: "From $19",
  },
]

const stats = [
  { icon: Users, value: "50K+", label: "Happy Customers" },
  { icon: Award, value: "4.9/5", label: "Average Rating" },
  { icon: Clock, value: "30min", label: "Average Service Time" },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment: "Amazing service! My iPhone looks brand new after their premium cleaning.",
    device: "iPhone 15 Pro",
  },
  {
    name: "Mike Chen",
    rating: 5,
    comment: "Professional and quick. The screen protector application was flawless.",
    device: "Samsung Galaxy S24",
  },
  {
    name: "Emily Davis",
    rating: 5,
    comment: "Best phone cleaning service in the city. Highly recommended!",
    device: "Google Pixel 8",
  },
]

export function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")

  const handleGetStarted = () => {
    setAuthMode("signup")
    setShowAuthModal(true)
  }

  const handleLogin = () => {
    setAuthMode("login")
    setShowAuthModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CleanPhone Pro
                </h1>
                <p className="text-xs text-muted-foreground">Premium Care</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleLogin}>
                Sign In
              </Button>
              <Button onClick={handleGetStarted} className="bg-gradient-to-r from-blue-600 to-purple-600">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200">
              ✨ Premium Mobile Care Service
            </Badge>
            <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-7xl">
              Your Phone Deserves
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}
                Premium Care
              </span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground lg:text-2xl">
              Professional cleaning and maintenance services for your flagship devices. Expert care with specialized
              tools and techniques.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                onClick={() => setShowBookingModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Book Service Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleGetStarted}>
                Create Account
              </Button>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-purple-400/20 to-indigo-400/20 blur-3xl" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold lg:text-5xl">Our Premium Services</h2>
            <p className="text-lg text-muted-foreground">
              Specialized care for your flagship devices with professional-grade equipment
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300"
              >
                <CardContent className="p-8">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
                    <service.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{service.title}</h3>
                  <p className="mb-4 text-muted-foreground">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-blue-600">{service.price}</span>
                    <Button variant="ghost" size="sm" className="group-hover:bg-blue-50">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold lg:text-5xl">What Our Customers Say</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of satisfied customers who trust us with their devices
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 text-muted-foreground">"{testimonial.comment}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.device}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold lg:text-5xl">Ready to Give Your Phone the Care It Deserves?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Book your premium cleaning service today and experience the difference professional care makes.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                onClick={() => setShowBookingModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Book Service Now
              </Button>
              <Button size="lg" variant="outline" onClick={handleGetStarted}>
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">CleanPhone Pro</h3>
              <p className="text-sm text-gray-400">Premium Care Service</p>
            </div>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2024 CleanPhone Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
      <BookingModal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} />
    </div>
  )
}
