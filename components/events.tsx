"use client"

import { Calendar, Clock, MapPin, Phone, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { scrollToElement } from "@/lib/scroll"
import { CONTACT_PHONE_NUMBER, SECTION_IDS } from "@/lib/constants"
import type { Event } from "@/lib/types"
import { ImagePopup } from "@/components/ui/image-popup"

// Función helper para generar enlace de WhatsApp
const getWhatsAppLink = (phoneNumber: string) => {
  const cleanNumber = phoneNumber.replace(/\s+/g, '')
  return `https://wa.me/${cleanNumber}`
}

function EventCard({ event }: { event: Event }) {
  const [flyerOpen, setFlyerOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState(event.flyerImage || "/flyer-transformacion-rio-gallegos.jpg")
  const [attemptedPaths, setAttemptedPaths] = useState<string[]>([])
  
  // Resetear el estado cuando se abre el modal
  const handleOpenChange = (open: boolean) => {
    setFlyerOpen(open)
    if (open) {
      setImageError(false)
      setAttemptedPaths([])
      setImageSrc(event.flyerImage || "/flyer-transformacion-rio-gallegos.jpg")
    }
  }

  const handleFlyerClick = () => {
    setFlyerOpen(true)
    setImageError(false)
    setAttemptedPaths([])
    setImageSrc(event.flyerImage || "/flyer-transformacion-rio-gallegos.jpg")
    
    // Pre-cargar la imagen para verificar si existe
    const img = new Image()
    img.onerror = () => {
      // Si falla la principal, intentar la alternativa
      if (event.flyerImageAlt && imageSrc === event.flyerImage) {
        setImageSrc(event.flyerImageAlt)
      } else {
        setImageError(true)
      }
    }
    img.onload = () => {
      setImageError(false)
    }
    img.src = event.flyerImage || "/flyer-transformacion-rio-gallegos.jpg"
  }
  
  return (
    <Card className="overflow-hidden relative">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant={event.available ? "default" : "secondary"} className={event.available ? "bg-blue-900 text-white hover:bg-blue-800 border-blue-900" : ""}>{event.availabilityText}</Badge>
          <Badge variant="outline">{event.type}</Badge>
        </div>
        <CardTitle className="text-lg sm:text-xl">{event.title}</CardTitle>
        {event.subtitle && (
          event.subtitleHighlight
            ? <p className="text-base font-bold text-center mt-1">({event.subtitle})</p>
            : <p className="text-sm text-muted-foreground mt-1">{event.subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="whitespace-pre-line">{event.date}</span>
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
        {(event.hasFlyer || event.contactPhone) && (
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-2 items-center justify-between">
            <div className="flex flex-col sm:flex-row flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={event.hasFlyer ? handleFlyerClick : () => {
                  setFlyerOpen(true)
                  setImageError(true)
                }}
                disabled={!event.hasFlyer}
              >
                <FileText className="h-4 w-4" />
                Ver Flyer
              </Button>
              
              {/* Pop-up de flyer */}
              {flyerOpen && event.hasFlyer && (
                <ImagePopup
                  src={imageError ? "" : encodeURI(imageSrc)}
                  alt={`Flyer - ${event.title}`}
                  isOpen={flyerOpen && !imageError}
                  onClose={() => {
                    setFlyerOpen(false)
                    setImageError(false)
                    setAttemptedPaths([])
                    setImageSrc(event.flyerImage || "/flyer-transformacion-rio-gallegos.jpg")
                  }}
                />
              )}
              
              {/* Manejo de errores de carga o flyer no disponible */}
              {flyerOpen && (imageError || !event.hasFlyer) && (
                <div className="fixed inset-0 z-[9998] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-background rounded-lg shadow-2xl p-8 max-w-md text-center">
                    <p className="text-lg font-semibold mb-2">
                      {!event.hasFlyer ? "Flyer no disponible aún" : "No se pudo cargar el flyer"}
                    </p>
                    {!event.hasFlyer ? (
                      <p className="text-sm mb-4">El flyer de este evento estará disponible próximamente.</p>
                    ) : (
                      <>
                        <p className="text-sm mb-4">Ruta intentada: {imageSrc}</p>
                        <p className="text-sm mb-4">Asegúrate de que el archivo esté en: public{event.flyerImage} o public{event.flyerImageAlt || ''}</p>
                      </>
                    )}
                    <div className="flex gap-2 justify-center">
                      {event.hasFlyer && (
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setImageError(false)
                            setAttemptedPaths([])
                            setImageSrc(event.flyerImage)
                          }}
                        >
                          Reintentar
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setFlyerOpen(false)
                          setImageError(false)
                          setAttemptedPaths([])
                          setImageSrc(event.flyerImage || "/flyer-transformacion-rio-gallegos.jpg")
                        }}
                      >
                        Cerrar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {event.contactPhone && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(getWhatsAppLink(event.contactPhone!), '_blank')
                  }}
                >
                  <Phone className="h-4 w-4" />
                  Contacto
                </Button>
              )}
            </div>
            {event.level && (
              <Badge className="bg-blue-900 text-white hover:bg-blue-800 border-blue-900 text-xs font-semibold px-2 py-1">
                {event.level}
              </Badge>
            )}
          </div>
        )}
        {!event.hasFlyer && !event.contactPhone && event.level && (
          <div className="flex justify-end pt-2">
            <Badge className="bg-blue-900 text-white hover:bg-blue-800 border-blue-900 text-xs font-semibold px-2 py-1">
              {event.level}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function Events() {
  const [showHistory, setShowHistory] = useState(false)

  const pastEvents = [
    {
      title: "Taller de Autoconocimiento - Necochea (Buenos Aires)",
      date: "17, 18 y 19 de Abril, 2026",
      time: "Inicio: Viernes 17, 17 Horas",
      location: "Por Primera Vez",
      type: "Taller de Liderazgo",
      available: false,
      availabilityText: "Evento Realizado",
      hasFlyer: true,
      flyerImage: "/autoconocimiento Necochea Abril 2026.jpg",
      flyerImageAlt: "/images/autoconocimiento Necochea Abril 2026.jpg",
      level: "1er Nivel",
      contactPhone: "+54 9 2966 595803",
    },
    {
      title: "Taller de Autoconocimiento - Tandil (Buenos Aires)",
      date: "10, 11 y 12 de Abril, 2026",
      time: "Inicio: Viernes 10, 17 Horas",
      location: "Ruta 30 y Muñiz",
      type: "Taller de Liderazgo",
      available: false,
      availabilityText: "Evento Realizado",
      hasFlyer: true,
      flyerImage: "/Autoconocimiento Tandil Abril 2026.jpg",
      flyerImageAlt: "/images/Autoconocimiento Tandil Abril 2026.jpg",
      level: "1er Nivel",
      contactPhone: "+54 9 2966 595803",
    },
    {
      title: "Taller de Transformación en Río Gallegos",
      date: "2, 3, 4 y 5 de Abril 2026",
      time: "Inicio: Jueves 2 de Abril a las 18:00 hs",
      location: "Lugar a Confirmar",
      type: "Taller de Liderazgo",
      available: false,
      availabilityText: "Evento Realizado",
      hasFlyer: true,
      flyerImage: "/transfor-abril-2026.jpeg",
      flyerImageAlt: "/images/transfor-abril-2026.jpeg",
      level: "2do Nivel",
      contactPhone: "+54 9 2966 595803",
    },
    {
      title: "Taller de Autoconocimiento - Punta Arenas",
      date: "27, 28 y 29 de Marzo 2026",
      time: "Inicio: Viernes 27/03 a las 17 Horas.",
      location: "Avda. Jorge Alessandri #264 Barrio Sur - Club Huracán",
      type: "Taller de Liderazgo",
      available: false,
      availabilityText: "Evento Realizado",
      hasFlyer: true,
      flyerImage: "/auto-punta-arenas-2026.jpeg",
      flyerImageAlt: "/images/auto-punta-arenas-2026.jpeg",
      level: "1er Nivel",
      contactPhone: "+56 9 6113 0835",
    },
    {
      title: "Taller de Autoconocimiento - Río Gallegos",
      date: "13, 14 y 15 de Marzo 2026",
      time: "Inicio Viernes 13 de Marzo a las 17 Hs",
      location: "Lisandro de la Torre Nº 952 (Edif. de Vialidad)",
      type: "Taller de Liderazgo",
      available: false,
      availabilityText: "Evento Realizado",
      hasFlyer: true,
      flyerImage: "/auto-marzo-correcto.jpeg",
      flyerImageAlt: "/images/auto-marzo-correcto.jpeg",
      level: "1er Nivel",
      contactPhone: "+54 9 2966 595803",
    },
    {
      title: "Taller de Biodecodificación: \"Tu cuerpo tiene algo que contarte.\"",
      date: "07 de Marzo de 2026.",
      time: "Inicio: sabado 14 Horas.",
      location: "Lisandro de la Torre Nº 952 (Edif. de Vialidad) - Río Gallegos.",
      type: "Otro Taller",
      available: false,
      availabilityText: "Evento Realizado",
      hasFlyer: true,
      flyerImage: "/Taller-de-Bio-07-03-2026.jpeg",
      flyerImageAlt: "/images/Taller-de-Bio-07-03-2026.jpeg",
      contactPhone: "+54 9 2966 211547",
    },
    {
      title: "Taller: \"Sanando mi niño interior.\"",
      date: "8 de Marzo 2026.",
      time: "14 Horas a 20 horas.",
      location: "Lisandro de la Torre Nº 952 (Edif. de Vialidad) - Río Gallegos.",
      type: "Otro Taller",
      available: false,
      availabilityText: "Evento Realizado",
      hasFlyer: true,
      flyerImage: "/nino-interior-marzo-2026.jpeg",
      flyerImageAlt: "/images/nino-interior-marzo-2026.jpeg",
      contactPhone: "+54 9 2966 595803",
    },
    {
      title: "El Camino del Guerrero - Río Gallegos",
      date: "14 y 15 de Febrero de 2026",
      time: "Inicio: sábado 14, 15 Horas",
      location: "Río Gallegos",
      type: "Otro Taller",
      available: false,
      availabilityText: "Evento Realizado",
    },
    {
      title: "Taller de Autoconocimiento",
      date: "23, 24 y 25 de Enero del 2026",
      time: "Evento Realizado",
      location: "Río Gallegos - Salón de Vialidad Provincial, sito en Lisandro de la Torres 952",
      type: "Taller de Liderazgo",
      available: false,
      availabilityText: "Evento Realizado",
      level: "1er Nivel",
    },
    {
      title: "Taller de MyL: Creativa",
      date: "19 de Diciembre, 2025",
      time: "12:00 Horas",
      location: "Teatro Municipal de Río Gallegos",
      type: "Taller de Liderazgo",
      available: false,
      availabilityText: "Cupos Agotados",
      level: "3er Nivel",
    },
    {
      title: "Taller de MyL - Cierre y Campamento",
      date: "20 y 21 de Diciembre, 2025",
      time: "Inicio: 10:00 AM del 20 de Diciembre",
      location: "Incógnito",
      type: "Taller de Liderazgo",
      available: false,
      availabilityText: "Cupos Agotados",
      level: "3er Nivel",
    },
  ]

  const events = [
    {
      title: "Taller de Autoconocimiento - Río Gallegos",
      date: "8, 9 y 10 de Mayo 2026",
      time: "Inicio Viernes 8 de Mayo a las 17 Hs",
      location: "A confirmar.",
      type: "Taller de Liderazgo",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: false,
      flyerImage: "/auto-marzo-correcto.jpeg",
      flyerImageAlt: "/images/auto-marzo-correcto.jpeg",
      level: "1er Nivel",
      contactPhone: "+54 9 2966 595803",
    },
    {
      title: "Las 7 Leyes Universales",
      subtitle: "Virtual y Gratuito",
      subtitleHighlight: true,
      date: "Comienza 11 de Mayo 2026.\n7 Noches (11, 13, 15, 18, 20, 22, 25 de Mayo)",
      time: "21 Hs a 22:30 Hs",
      location: "Virtual",
      type: "Curso",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: true,
      flyerImage: "/las-7-leyes-universales.jpeg",
      flyerImageAlt: "/images/las-7-leyes-universales.jpeg",
      contactPhone: "+54 9 2966 595803",
    },
    {
      title: "CURSO ONLINE de ORATORIA 🗣️🧠",
      date: "A partir del 12 de Mayo 2026.\n5 clases: Martes y Jueves (12, 14, 19, 21 y 26 de Mayo)",
      time: "21:00 Hs a 22:30 Hs",
      location: "Online",
      type: "Curso",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: true,
      flyerImage: "/Flayer-Oratoria.jpeg",
      flyerImageAlt: "/images/Flayer-Oratoria.jpeg",
      contactPhone: "+54 9 2966 595803",
    },
    {
      title: "El Camino del Guerrero - Río Gallegos",
      date: "16 y 17 de Mayo 2026",
      time: "Inicio: Sábado 16 de Mayo, 15 Horas",
      location: "Río Gallegos",
      type: "Otro Taller",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: true,
      flyerImage: "/El-guerrero-mayo-gallegos.jpeg",
      flyerImageAlt: "/images/El-guerrero-mayo-gallegos.jpeg",
      contactPhone: "+54 9 2966 595803",
    },
    {
      title: "Sanando mi Niño Interior - Punta Arenas",
      date: "22 de Mayo 2026",
      time: "Inicio: Viernes 22 de Mayo, 17 Horas",
      location: "Avda. Jorge Alessandri #264 Barrio Sur - Club Huracán",
      type: "Otro Taller",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: true,
      flyerImage: "/nino-mayo-punta-arenas.jpeg",
      flyerImageAlt: "/images/nino-mayo-punta-arenas.jpeg",
      contactPhone: "+56 9 6113 0835",
    },
    {
      title: "El Camino del Guerrero - Punta Arenas",
      date: "23 y 24 de Mayo 2026",
      time: "Inicio: Sábado 23 de Mayo, 15 Horas",
      location: "Punta Arenas",
      type: "Otro Taller",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: true,
      flyerImage: "/El-guerrero-mayo-punta-arenas.jpeg",
      flyerImageAlt: "/images/El-guerrero-mayo-punta-arenas.jpeg",
      contactPhone: "+56 9 6113 0835",
    },
    {
      title: "Taller de Biodecodificación: \"Tu cuerpo tiene algo que contarte.\" - Río Gallegos",
      date: "13 de Junio de 2026",
      time: "Inicio: Sábado 14 Horas",
      location: "Lugar a Confirmar",
      type: "Otro Taller",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: true,
      flyerImage: "/bio-13-06-2026.jpeg",
      flyerImageAlt: "/images/bio-13-06-2026.jpeg",
      contactPhone: "+54 9 2966 211547",
    },
    {
      title: "Taller: \"Sanando mi Niño Interior.\" - Río Gallegos",
      date: "14 de Junio de 2026",
      time: "Inicio: Domingo 14 Horas",
      location: "Lugar a Confirmar",
      type: "Otro Taller",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: true,
      flyerImage: "/sanando-14-06-2026.jpeg",
      flyerImageAlt: "/images/sanando-14-06-2026.jpeg",
      contactPhone: "+54 9 2966 595803",
    },
    {
      title: "Taller de Transformación - Río Gallegos",
      date: "9, 10, 11 y 12 de Julio 2026",
      time: "Inicio: Jueves 9 de Julio, 17 Horas",
      location: "Lugar a Confirmar",
      type: "Taller de Liderazgo",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: true,
      flyerImage: "/transfor-gallegos-julio-2026.jpeg",
      flyerImageAlt: "/images/transfor-gallegos-julio-2026.jpeg",
      level: "2do Nivel",
      contactPhone: "+54 9 2966 595803",
    },
    {
      title: "Taller de MyL 7 - 1ra, Sala.",
      date: "7 y 8 de Agosto 2026",
      time: "Inicio: Sábado 7 de Agosto, 10:00 Horas",
      location: "Río Gallegos",
      type: "Taller de Liderazgo",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: false,
      level: "3er Nivel",
      contactPhone: "+54 9 2966 595803",
    },
    {
      title: "Taller de MyL 7 - 2da Sala.",
      date: "29 y 30 de Agosto 2026",
      time: "Inicio: Sábado 29 de Agosto, 10:00 Horas",
      location: "Río Gallegos",
      type: "Taller de Liderazgo",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: false,
      level: "3er Nivel",
      contactPhone: "+54 9 2966 595803",
    },
    {
      title: "Taller de Autoconocimiento - Córdoba",
      date: "25, 26 y 27 de Septiembre 2026",
      time: "Inicio: Viernes 25 de Septiembre a las 17 Hs",
      location: "Córdoba",
      type: "Taller de Liderazgo",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: true,
      flyerImage: "/Auto-Cordoba-25-26-27-septiembre.jpeg",
      flyerImageAlt: "/images/Auto-Cordoba-25-26-27-septiembre.jpeg",
      level: "1er Nivel",
      contactPhone: "+54 9 2966 595803",
    },
    {
      title: "Taller de MyL 7 - Campamento y Cierre.",
      date: "31 de Octubre y 1 de Noviembre 2026",
      time: "Inicio: Sábado 31 de Octubre, 10:00 Horas",
      location: "Río Gallegos",
      type: "Taller de Liderazgo",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: false,
      level: "3er Nivel",
      contactPhone: "+54 9 2966 595803",
    },
    {
      title: "El Camino del Guerrero - Quequén/Necochea",
      date: "7 y 8 de Noviembre, 2026",
      time: "Inicio: Sábado 7, 15 Horas",
      location: "A Confirmar",
      type: "Otro Taller",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: true,
      flyerImage: "/El Guerrero Necochea.jpeg",
      flyerImageAlt: "/images/El Guerrero Necochea.jpeg",
      contactPhone: "+54 11 6706 6630",
    },
    {
      title: "Taller de Autoconocimiento - Quequén/Necochea",
      date: "13, 14 y 15 de Noviembre, 2026",
      time: "Inicio: Viernes 13, 16 Horas",
      location: "A Confirmar",
      type: "Taller de Liderazgo",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: true,
      flyerImage: "/auto neco noviembre 2026.jpeg",
      flyerImageAlt: "/images/auto neco noviembre 2026.jpeg",
      level: "1er Nivel",
      contactPhone: "+54 11 6706 6630",
    },
  ]

  return (
    <section className="py-12 sm:py-16 bg-muted/30 w-full" id="proximos-eventos">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-balance">Próximos Eventos</h2>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty">
            Únete a nuestros próximos talleres y sesiones de transformación personal
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>

        <div className="flex justify-center mt-8 sm:mt-12">
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-base sm:text-lg font-semibold"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? "Ocultar" : "Registro de Eventos Realizados"}
          </Button>
        </div>

        {showHistory && (
          <div className="mt-12 sm:mt-16">
            <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-balance">Registro de Eventos Realizados</h2>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty">
                Eventos que ya se han realizado
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {pastEvents.map((event, index) => (
                <EventCard key={index} event={event} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
