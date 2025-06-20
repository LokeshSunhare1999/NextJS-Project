import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, CheckCircle } from "lucide-react"
import Image from "next/image"

interface PhoneServiceCardProps {
  phone: {
    id: number
    brand: string
    model: string
    image: string
    price: string
    duration: string
    services: string[]
    rating: number
    description: string
  }
}

export function PhoneServiceCard({ phone }: PhoneServiceCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{phone.brand}</h3>
            <p className="text-sm text-muted-foreground">{phone.model}</p>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{phone.rating}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          <Image
            src={phone.image || "/placeholder.svg"}
            alt={`${phone.brand} ${phone.model}`}
            fill
            className="object-cover"
          />
        </div>

        <p className="text-sm text-muted-foreground">{phone.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{phone.duration}</span>
          </div>
          <Badge variant="secondary">{phone.price}</Badge>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Included Services:</h4>
          <div className="space-y-1">
            {phone.services.map((service, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-xs text-muted-foreground">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Button className="w-full">Book Service</Button>
      </CardFooter>
    </Card>
  )
}
