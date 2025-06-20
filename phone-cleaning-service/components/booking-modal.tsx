"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useBooking, type Service } from "@/lib/booking-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { CalendarIcon, Clock, CreditCard, CheckCircle, Sparkles, Shield, Zap, User, Mail, Phone } from "lucide-react"
import { format } from "date-fns"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

const services: Service[] = [
  {
    id: "1",
    name: "Premium Deep Clean",
    price: 49.99,
    duration: 45,
    description: "Complete device sanitization with professional-grade equipment",
    features: ["Deep screen cleaning", "Port cleaning", "Camera lens polish", "Antimicrobial treatment"],
  },
  {
    id: "2",
    name: "Screen Protection",
    price: 29.99,
    duration: 30,
    description: "Premium screen protector application with lifetime warranty",
    features: ["Screen protector application", "Bubble-free installation", "Lifetime warranty", "Screen cleaning"],
  },
  {
    id: "3",
    name: "Performance Boost",
    price: 19.99,
    duration: 20,
    description: "Software optimization and cache cleaning for better performance",
    features: ["Cache cleaning", "Storage optimization", "Performance tuning", "Software updates"],
  },
]

const phoneModels = [
  "iPhone 15 Pro Max",
  "iPhone 15 Pro",
  "iPhone 15",
  "Samsung Galaxy S24 Ultra",
  "Samsung Galaxy S24+",
  "Samsung Galaxy S24",
  "Google Pixel 8 Pro",
  "Google Pixel 8",
  "OnePlus 12 Pro",
  "OnePlus 12",
  "Xiaomi 14 Ultra",
  "Nothing Phone (2a)",
]

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
]

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const { user } = useAuth()
  const { addBooking } = useBooking()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedPhone, setSelectedPhone] = useState("")
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setStep(2)
  }

  const handleBookingSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !selectedPhone) return

    setIsLoading(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const booking = {
        userId: user?.id,
        guestInfo: user ? undefined : guestInfo,
        service: selectedService,
        phoneModel: selectedPhone,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        status: "confirmed" as const,
        totalAmount: selectedService.price,
      }

      addBooking(booking)
      setStep(4) // Success step
    } catch (error) {
      console.error("Booking failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetModal = () => {
    setStep(1)
    setSelectedService(null)
    setSelectedDate(undefined)
    setSelectedTime("")
    setSelectedPhone("")
    setGuestInfo({ name: "", email: "", phone: "" })
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const getServiceIcon = (serviceId: string) => {
    switch (serviceId) {
      case "1":
        return Sparkles
      case "2":
        return Shield
      case "3":
        return Zap
      default:
        return Sparkles
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {step === 1 && "Choose Your Service"}
            {step === 2 && "Schedule Your Appointment"}
            {step === 3 && "Confirm & Pay"}
            {step === 4 && "Booking Confirmed!"}
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="space-y-4">
            {services.map((service) => {
              const Icon = getServiceIcon(service.id)
              return (
                <Card
                  key={service.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
                  onClick={() => handleServiceSelect(service)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{service.name}</h3>
                          <p className="text-muted-foreground mb-3">{service.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {service.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">${service.price}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {service.duration} mins
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Step 2: Date & Time Selection */}
        {step === 2 && selectedService && (
          <div className="space-y-6">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h3 className="font-semibold">{selectedService.name}</h3>
              <p className="text-sm text-muted-foreground">
                ${selectedService.price} • {selectedService.duration} minutes
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Phone Model</Label>
                <Select value={selectedPhone} onValueChange={setSelectedPhone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your phone model" />
                  </SelectTrigger>
                  <SelectContent>
                    {phoneModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Select Time</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className={selectedTime === time ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              {!user && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold">Guest Information</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="guest-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="guest-name"
                          placeholder="Enter your full name"
                          className="pl-10"
                          value={guestInfo.name}
                          onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="guest-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="guest-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          value={guestInfo.email}
                          onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="guest-phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="guest-phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          className="pl-10"
                          value={guestInfo.phone}
                          onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                disabled={
                  !selectedDate || !selectedTime || !selectedPhone || (!user && (!guestInfo.name || !guestInfo.email))
                }
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation & Payment */}
        {step === 3 && selectedService && selectedDate && (
          <div className="space-y-6">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h3 className="font-semibold mb-2">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span>{selectedService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span>{selectedPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{format(selectedDate, "PPP")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{selectedService.duration} minutes</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${selectedService.price}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                Payment Information
              </h4>
              <div className="p-4 bg-gray-50 rounded-lg text-center text-muted-foreground">
                <p>💳 Secure payment processing</p>
                <p className="text-sm mt-1">Payment will be processed securely</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleBookingSubmit}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner /> : `Pay $${selectedService.price}`}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
              <p className="text-muted-foreground">
                Your appointment has been successfully booked. You'll receive a confirmation email shortly.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
