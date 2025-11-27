"use client"

import { Calendar, Clock, MapPin, Phone, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useState } from "react"
import { scrollToElement } from "@/lib/scroll"
import { CONTACT_PHONE_NUMBER, SECTION_IDS } from "@/lib/constants"
import type { Event } from "@/lib/types"

function EventCard({ event }: { event: Event }) {
  const [flyerOpen, setFlyerOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState(event.flyerImage || "/flyer-transformacion-rio-gallegos.jpg")
  
  // Resetear el estado cuando se abre el modal
  const handleOpenChange = (open: boolean) => {
    setFlyerOpen(open)
    if (open) {
      setImageError(false)
      setImageSrc(event.flyerImage || "/flyer-transformacion-rio-gallegos.jpg")
    }
  }
  
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant={event.available ? "default" : "secondary"}>{event.availabilityText}</Badge>
          <Badge variant="outline">{event.type}</Badge>
        </div>
        <CardTitle className="text-xl">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-primary flex-shrink-0" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
          <span>{event.location}</span>
        </div>
        
        {/* Botones para Taller de Transformación */}
        {event.hasFlyer && (
          <div className="flex flex-wrap gap-2 pt-2">
            <Sheet open={flyerOpen} onOpenChange={handleOpenChange}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Ver Flyer
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[90vh] overflow-auto">
                <SheetHeader>
                  <SheetTitle>Flyer - {event.title}</SheetTitle>
                </SheetHeader>
                <div className="mt-4 flex justify-center items-center min-h-[400px] w-full p-4">
                  {!imageError ? (
                    <img
                      key={imageSrc}
                      src={imageSrc}
                      alt="Flyer Taller de Transformación Río Gallegos"
                      className="max-w-full h-auto rounded-lg shadow-lg"
                      style={{ maxHeight: '80vh', objectFit: 'contain' }}
                      onError={(e) => {
                        console.error('Error al cargar el flyer desde:', imageSrc)
                        // Intentar con ruta alternativa si existe
                        if (event.flyerImageAlt && imageSrc === event.flyerImage) {
                          console.log('Intentando con ruta alternativa:', event.flyerImageAlt)
                          setImageSrc(event.flyerImageAlt)
                          setImageError(false)
                          return
                        }
                        setImageError(true)
                      }}
                      onLoad={() => {
                        console.log('Flyer cargado correctamente desde:', imageSrc)
                        setImageError(false)
                      }}
                    />
                  ) : (
                    <div className="text-center text-muted-foreground p-8">
                      <p className="text-lg font-semibold mb-2">No se pudo cargar el flyer</p>
                      <p className="text-sm mb-4">Ruta intentada: {imageSrc}</p>
                      <p className="text-sm mb-4">Asegúrate de que el archivo esté en: public/flyer-transformacion-rio-gallegos.jpg</p>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setImageError(false)
                          setImageSrc(event.flyerImage)
                        }}
                      >
                        Reintentar
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                scrollToElement(SECTION_IDS.CONTACTO)
              }}
            >
              <Phone className="h-4 w-4" />
              Contacto
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function Events() {
  const events = [
    {
      title: "Taller de Transformación - Río Gallegos",
      date: "11, 12, 13 y 14 de Diciembre, 2025",
      time: "Inicio: Jueves 11, 18 Horas",
      location: "Zapiola 1768 (pasando Balbín)",
      type: "Taller de Liderazgo",
      available: true,
      availabilityText: "Cupos: quedan solo 10 Lugares disponibles",
      hasFlyer: true,
      flyerImage: "/flyer-transformacion-rio-gallegos.jpg",
      // También intentar con diferentes rutas posibles
      flyerImageAlt: "/images/flyer-transformacion-rio-gallegos.jpg",
    },
    {
      title: "Taller de MyL: Creativa",
      date: "19 de Diciembre, 2025",
      time: "12:00 Horas",
      location: "Teatro Municipal de Río Gallegos",
      type: "Taller de Liderazgo",
      available: false,
      availabilityText: "Cupos Agotados",
    },
    {
      title: "Taller de MyL - Cierre y Campamento",
      date: "20 y 21 de Diciembre, 2025",
      time: "Inicio: 10:00 AM del 20 de Diciembre",
      location: "Incógnito",
      type: "Taller de Liderazgo",
      available: false,
      availabilityText: "Cupos Agotados",
    },
    {
      title: "Taller de Autoconocimiento - Río Gallegos",
      date: "23, 24 y 25 de Enero, 2026",
      time: "Inicio: Viernes 23, 17 Horas",
      location: "Lugar a Designar",
      type: "Taller de Liderazgo",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: true,
      flyerImage: "/Autoconocimiento Rio Gallegos Enero 2026.jpg",
      flyerImageAlt: "/images/Autoconocimiento Rio Gallegos Enero 2026.jpg",
    },
    {
      title: "Taller de Autoconocimiento - Punta Arenas",
      date: "6, 7 y 8 de Febrero, 2026",
      time: "Inicio: Viernes 6, 17 Horas",
      location: "Chile - SEDE Club Huracán",
      type: "Taller de Liderazgo",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: true,
      flyerImage: "/Autoconocimiento Punta Arenas febrero 2026.jpg",
      flyerImageAlt: "/images/Autoconocimiento Punta Arenas febrero 2026.jpg",
    },
    {
      title: "El Camino del Guerrero - Río Gallegos",
      date: "Febrero, 2026",
      time: "Por confirmar",
      location: "Río Gallegos",
      type: "Otro Taller",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: true,
      flyerImage: "/El Camino de Guerrero febrero 2026.jpg",
      flyerImageAlt: "/images/El Camino de Guerrero febrero 2026.jpg",
    },
    {
      title: "Taller de Autoconocimiento - Tandil (Buenos Aires)",
      date: "10, 11 y 12 de Abril, 2026",
      time: "Inicio: Viernes 10, 17 Horas",
      location: "Ruta 30 y Muñiz",
      type: "Taller de Liderazgo",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: true,
      flyerImage: "/Autoconocimiento Tandil Abril 2026.jpg",
      flyerImageAlt: "/images/Autoconocimiento Tandil Abril 2026.jpg",
    },
    {
      title: "Taller de Autoconocimiento - Necochea (Buenos Aires)",
      date: "17, 18 y 19 de Abril, 2026",
      time: "Inicio: Viernes 17, 17 Horas",
      location: "Por Primera Vez",
      type: "Taller de Liderazgo",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: true,
      flyerImage: "/autoconocimiento Necochea Abril 2026.jpg",
      flyerImageAlt: "/images/autoconocimiento Necochea Abril 2026.jpg",
    },
  ]

  return (
    <section className="py-16 bg-muted/30" id="proximos-eventos">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Próximos Eventos</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Únete a nuestros próximos talleres y sesiones de transformación personal
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </div>
    </section>
  )
}
