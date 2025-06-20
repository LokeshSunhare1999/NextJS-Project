"use client"

import { PhoneServiceCard } from "@/components/phone-service-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Sparkles, Clock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Dashboard } from "@/components/dashboard"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

const flagshipPhones = [
  {
    id: 1,
    brand: "iPhone",
    model: "15 Pro Max",
    image: "/placeholder.svg?height=200&width=200",
    price: "$49.99",
    duration: "45 mins",
    services: ["Deep Screen Cleaning", "Camera Lens Polish", "Port Cleaning", "Antimicrobial Treatment"],
    rating: 4.9,
    description: "Premium cleaning for Apple's flagship with specialized tools for titanium finish",
  },
  {
    id: 2,
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    image: "/placeholder.svg?height=200&width=200",
    price: "$44.99",
    duration: "40 mins",
    services: [
      "S Pen Slot Cleaning",
      "Screen Protector Application",
      "Camera Module Care",
      "Wireless Charging Pad Clean",
    ],
    rating: 4.8,
    description: "Comprehensive cleaning for Samsung's premium device with S Pen maintenance",
  },
  {
    id: 3,
    brand: "Google",
    model: "Pixel 8 Pro",
    image: "/placeholder.svg?height=200&width=200",
    price: "$39.99",
    duration: "35 mins",
    services: ["Camera Bar Deep Clean", "Fingerprint Sensor Care", "Speaker Grill Cleaning", "USB-C Port Service"],
    rating: 4.7,
    description: "Specialized cleaning for Google's AI-powered flagship with camera bar focus",
  },
  {
    id: 4,
    brand: "OnePlus",
    model: "12 Pro",
    image: "/placeholder.svg?height=200&width=200",
    price: "$37.99",
    duration: "35 mins",
    services: ["Alert Slider Cleaning", "Fast Charging Port Care", "Camera Lens Polish", "Haptic Motor Service"],
    rating: 4.6,
    description: "Premium cleaning service for OnePlus flagship with alert slider maintenance",
  },
  {
    id: 5,
    brand: "Xiaomi",
    model: "14 Ultra",
    image: "/placeholder.svg?height=200&width=200",
    price: "$42.99",
    duration: "40 mins",
    services: [
      "Leica Camera System Clean",
      "Wireless Charging Coil Care",
      "IR Blaster Cleaning",
      "Premium Build Polish",
    ],
    rating: 4.5,
    description: "Expert cleaning for Xiaomi's photography-focused flagship with Leica partnership",
  },
  {
    id: 6,
    brand: "Nothing",
    model: "Phone (2a)",
    image: "/placeholder.svg?height=200&width=200",
    price: "$34.99",
    duration: "30 mins",
    services: ["Glyph Interface Clean", "Transparent Back Care", "LED Strip Maintenance", "Unique Design Polish"],
    rating: 4.4,
    description: "Specialized cleaning for Nothing's unique transparent design and Glyph interface",
  },
]

export default function HomePage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return user ? (
    <Dashboard />
  ) : (
    <div className="flex-1 space-y-8 p-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 px-8 py-16 text-white">
        <div className="relative z-10 max-w-4xl">
          <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">Premium Mobile Care</Badge>
          <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-6xl">
            Professional Mobile Phone Cleaning Service
          </h1>
          <p className="mb-8 text-xl text-blue-100 lg:text-2xl">
            Expert cleaning and maintenance for your premium devices. We use specialized tools and techniques to keep
            your flagship phones in pristine condition.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Book Service Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              View Pricing
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent" />
      </section>

      {/* Service Features */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="flex items-start space-x-4 rounded-lg border p-6">
          <div className="rounded-full bg-blue-100 p-3">
            <Sparkles className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold">Deep Cleaning</h3>
            <p className="text-sm text-muted-foreground">
              Professional-grade cleaning with specialized tools and solutions
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-4 rounded-lg border p-6">
          <div className="rounded-full bg-green-100 p-3">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold">Device Protection</h3>
            <p className="text-sm text-muted-foreground">Antimicrobial treatment and protective coating application</p>
          </div>
        </div>
        <div className="flex items-start space-x-4 rounded-lg border p-6">
          <div className="rounded-full bg-purple-100 p-3">
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold">Quick Service</h3>
            <p className="text-sm text-muted-foreground">Fast turnaround time with same-day service available</p>
          </div>
        </div>
      </section>

      {/* Flagship Phones Section */}
      <section>
        <div className="mb-8">
          <h2 className="mb-4 text-3xl font-bold">Flagship Phone Services</h2>
          <p className="text-lg text-muted-foreground">
            Specialized cleaning services tailored for premium mobile devices. Each service is customized based on your
            phone's unique features and materials.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {flagshipPhones.map((phone) => (
            <PhoneServiceCard key={phone.id} phone={phone} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-2xl bg-muted p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Ready to Give Your Phone the Care It Deserves?</h2>
        <p className="mb-6 text-muted-foreground">
          Book your premium cleaning service today and experience the difference professional care makes.
        </p>
        <Button size="lg">Schedule Your Service</Button>
      </section>
    </div>
  )
}
