"use client"

import { Calendar, Clock, MapPin, Phone, FileText, ClipboardList, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { scrollToElement } from "@/lib/scroll"
import { CONTACT_PHONE_NUMBER, SECTION_IDS } from "@/lib/constants"
import type { Event } from "@/lib/types"
import { ImagePopup } from "@/components/ui/image-popup"
import { useUser } from "@/lib/user-context"
import { LoginModal } from "@/components/login-modal"
import { supabase } from "@/lib/supabase-client"

// Función helper para generar enlace de WhatsApp
const getWhatsAppLink = (phoneNumber: string) => {
  const cleanNumber = phoneNumber.replace(/\s+/g, '')
  return `https://wa.me/${cleanNumber}`
}

// Talleres que requieren login obligatorio para inscribirse
const TALLERES_REQUIEREN_LOGIN = new Set(["transformacion", "metas-y-logros"])

function EventCard({ event, talleresActivos, talleresMap }: { event: Event, talleresActivos: Set<string>, talleresMap: Map<string, string> }) {
  const { estado } = useUser()
  const [loginOpen, setLoginOpen] = useState(false)
  const requiereLogin = TALLERES_REQUIEREN_LOGIN.has(event.tallerSlug || "")
  // Resolver tallerId: usar el hardcodeado si existe, sino buscar por slug+sede en Supabase
  const resolvedTallerId = event.tallerId || (event.tallerSlug && event.sede ? talleresMap.get(`${event.tallerSlug}|${event.sede}`) : undefined)
  // Tiene precio cargado si su tallerId está en la lista de activos, o si no tiene tallerSlug (no es inscribible)
  const tienePrecio = !event.tallerSlug || (resolvedTallerId ? talleresActivos.has(resolvedTallerId) : false)
  const [flyerOpen, setFlyerOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState(event.flyerImage || "/flyer-transformacion-rio-gallegos.jpg")
  const [attemptedPaths, setAttemptedPaths] = useState<string[]>([])
  const [mailCopiado, setMailCopiado] = useState(false)
  
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
                event.contactWhatsappOnly ? (
                  <a
                    href={getWhatsAppLink(event.contactPhone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 text-sm font-medium transition-colors"
                    title="Contactar por WhatsApp"
                  >
                    Contacto
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-green-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                ) : (
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
                )
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
        {event.tallerSlug && event.available && (
          <div className="pt-3">
            {!tienePrecio ? (
              <button
                disabled
                className="flex items-center justify-center gap-2 w-full bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 font-semibold py-2 px-4 rounded-lg text-sm cursor-not-allowed"
              >
                <ClipboardList className="h-4 w-4" />
                Precio no disponible aún
              </button>
            ) : event.sede === "Punta Arenas" ? (
              <button
                disabled
                className="flex items-center justify-center gap-2 w-full bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 font-semibold py-2 px-4 rounded-lg text-sm cursor-not-allowed"
              >
                <ClipboardList className="h-4 w-4" />
                Inscripción no disponible
              </button>
            ) : estado === "registrado" ? (
              <a
                href={`/inscribirse?taller=${event.tallerSlug}${resolvedTallerId ? `&id=${resolvedTallerId}` : ""}&localidad=${encodeURIComponent(event.sede || event.location)}&evento=${encodeURIComponent(`${event.title} — ${event.date} — ${event.location}`)}&back=proximos-eventos`}
                className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                <ClipboardList className="h-4 w-4" />
                Inscribirme
              </a>
            ) : estado === "sin_registro" && requiereLogin ? (
              <a
                href="#inicio"
                className="flex items-center justify-center gap-2 w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                <Lock className="h-4 w-4" />
                Registrate para inscribirte
              </a>
            ) : estado === "no_logueado" && requiereLogin ? (
              <>
                <button
                  onClick={() => setLoginOpen(true)}
                  className="flex items-center justify-center gap-2 w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  <Lock className="h-4 w-4" />
                  Ingresá para inscribirte
                </button>
                <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} onLoginSuccess={() => setLoginOpen(false)} />
              </>
            ) : (
              <a
                href={`/inscribirse?taller=${event.tallerSlug}${resolvedTallerId ? `&id=${resolvedTallerId}` : ""}&localidad=${encodeURIComponent(event.sede || event.location)}&evento=${encodeURIComponent(`${event.title} — ${event.date} — ${event.location}`)}&back=proximos-eventos`}
                className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                <ClipboardList className="h-4 w-4" />
                Inscribirme
              </a>
            )}
            {/* Comprobante de inscripción */}
            <div className="mt-3 flex flex-col items-center gap-1">
              <p className="text-sm text-muted-foreground">Comprobante de inscripción:</p>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <a
                  href="mailto:Sentir.inscripciones@gmail.com"
                  className="text-sm text-primary underline hover:no-underline"
                >
                  Sentir.inscripciones@gmail.com
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("Sentir.inscripciones@gmail.com")
                    setMailCopiado(true)
                    setTimeout(() => setMailCopiado(false), 2000)
                  }}
                  className="text-xs px-2 py-0.5 rounded-full border border-border bg-muted hover:bg-muted/70 transition-colors"
                >
                  {mailCopiado ? "¡Copiado!" : "Copiar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function Events() {
  const [showHistory, setShowHistory] = useState(false)
  const [talleresActivos, setTalleresActivos] = useState<Set<string>>(new Set())
  const [talleresMap, setTalleresMap] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    const hoy = new Date().toISOString()
    const hoyFecha = hoy.split("T")[0]
    supabase
      .from("talleres")
      .select("id, slug, sede")
      .eq("activo", true)
      .or(`fecha_inicio.gte.${hoy},fecha_fin.gte.${hoyFecha}`)
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setTalleresActivos(new Set(data.map((t: { id: string }) => t.id)))
          const map = new Map<string, string>()
          data.forEach((t: { id: string, slug: string, sede: string }) => {
            const key = `${t.slug}|${t.sede}`
            if (!map.has(key)) map.set(key, t.id)
          })
          setTalleresMap(map)
        }
      })
  }, [])

  const pastEvents = [
    {
      title: "Taller de MyL 7 - 1ra, Sala.",
      date: "8 y 9 de Agosto 2026",
      time: "Inicio: Sábado 8 de Agosto, 10:00 Horas",
      location: "Río Gallegos",
      type: "Taller de Liderazgo",
      available: false,
      availabilityText: "Evento Realizado",
      hasFlyer: true,
      flyerImage: "/MyL-7.jpeg",
      level: "3er Nivel",
      contactPhone: "+54 9 2966 595803",
    },
    {
      title: "Taller de Autoconocimiento - Río Gallegos",
      date: "19, 20 y 21 de Junio 2026",
      time: "Inicio: Viernes 19 de Junio, 17 Horas",
      location: "Henry Williams Jamieson 548 - Jubilados Legislativos",
      type: "Taller de Liderazgo",
      available: false,
      availabilityText: "Evento Realizado",
      hasFlyer: false,
      level: "1er Nivel",
      contactPhone: "+54 9 2966 595803",
    },
    {
      title: "Taller: \"Sanando mi Niño Interior.\" - Río Gallegos",
      date: "14 de Junio de 2026",
      time: "Inicio: Domingo 14 Horas",
      location: "Lugar a Confirmar",
      type: "Otro Taller",
      available: false,
      availabilityText: "Evento Realizado",
      hasFlyer: true,
      flyerImage: "/sanando-14-06-2026.jpeg",
      flyerImageAlt: "/images/sanando-14-06-2026.jpeg",
      contactPhone: "+54 9 2966 595803",
    },
    {
      title: "Taller de Biodecodificación: \"Tu cuerpo tiene algo que contarte.\" - Río Gallegos",
      date: "13 de Junio de 2026",
      time: "Inicio: Sábado 14 Horas",
      location: "Lugar a Confirmar",
      type: "Otro Taller",
      available: false,
      availabilityText: "Evento Realizado",
      hasFlyer: true,
      flyerImage: "/bio-13-06-2026.jpeg",
      flyerImageAlt: "/images/bio-13-06-2026.jpeg",
      contactPhone: "+54 9 2966 211547",
    },
    {
      title: "El Camino del Guerrero - Río Gallegos",
      date: "16 y 17 de Mayo 2026",
      time: "Inicio: Sábado 16 de Mayo, 15 Horas",
      location: "Río Gallegos",
      type: "Otro Taller",
      available: false,
      availabilityText: "Evento Realizado",
      hasFlyer: true,
      flyerImage: "/El-guerrero-mayo-gallegos.jpeg",
      flyerImageAlt: "/images/El-guerrero-mayo-gallegos.jpeg",
      contactPhone: "+54 9 2966 595803",
    },
    {
      title: "Las 7 Leyes Universales",
      subtitle: "Virtual y Gratuito",
      subtitleHighlight: true,
      date: "11, 13, 15, 18, 20, 22, 25 de Mayo 2026",
      time: "21 Hs a 22:30 Hs",
      location: "Virtual",
      type: "Curso",
      available: false,
      availabilityText: "Evento Realizado",
      hasFlyer: true,
      flyerImage: "/las-7-leyes-universales.jpeg",
      flyerImageAlt: "/images/las-7-leyes-universales.jpeg",
      contactPhone: "+54 9 2966 595803",
    },
    {
      title: "CURSO ONLINE de ORATORIA 🗣️🧠",
      date: "12, 14, 19, 21 y 26 de Mayo 2026",
      time: "21:00 Hs a 22:30 Hs",
      location: "Online",
      type: "Curso",
      available: false,
      availabilityText: "Evento Realizado",
      hasFlyer: true,
      flyerImage: "/Flayer-Oratoria.jpeg",
      flyerImageAlt: "/images/Flayer-Oratoria.jpeg",
      contactPhone: "+54 9 2966 595803",
    },
    {
      title: "Taller de Autoconocimiento - Río Gallegos",
      date: "8, 9 y 10 de Mayo 2026",
      time: "Inicio Viernes 8 de Mayo a las 17 Hs",
      location: "A confirmar.",
      type: "Taller de Liderazgo",
      available: false,
      availabilityText: "Evento Realizado",
      hasFlyer: true,
      flyerImage: "/auto-mayo-2026.jpeg",
      flyerImageAlt: "/images/auto-mayo-2026.jpeg",
      level: "1er Nivel",
      contactPhone: "+54 9 2966 595803",
    },
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
      tallerSlug: "transformacion",
      tallerId: "2ecd2571-70d4-401c-9a40-56f0a3ab589c",
      sede: "Río Gallegos",
      fechaInicio: "2026-07-09",
      fechaFin: "2026-07-12",
    },
    {
      title: "Taller: \"Sanando mi Niño Interior\" - Punta Arenas",
      date: "14 de Agosto de 2026",
      time: "14 Horas a 20 Horas",
      location: "Avda. Jorge Alessandri #264 Barrio Sur - Club Huracán",
      type: "Otro Taller",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: false,
      contactPhone: "+56 9 6113 0835",
      fechaInicio: "2026-08-14",
      fechaFin: "2026-08-14",
    },
    {
      title: "El Camino del Guerrero - Punta Arenas",
      date: "15 y 16 de Agosto 2026",
      time: "Inicio: Sábado 15, 15 Horas",
      location: "Avda. Jorge Alessandri #264 Barrio Sur - Club Huracán",
      type: "Otro Taller",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: false,
      contactPhone: "+56 9 6113 0835",
      tallerSlug: "camino-del-guerrero",
      sede: "Punta Arenas",
      fechaInicio: "2026-08-15",
      fechaFin: "2026-08-16",
    },
    {
      title: "El Camino del Guerrero - Río Gallegos",
      date: "22 y 23 de Agosto 2026",
      time: "Inicio: Sábado 22, 15 Horas",
      location: "Lugar a Confirmar",
      type: "Otro Taller",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: true,
      flyerImage: "/camino del guerrero 22-23 agosto rio gallegos.jpeg",
      flyerImageAlt: "/images/camino del guerrero 22-23 agosto rio gallegos.jpeg",
      contactPhone: "+54 9 2966 595803",
      tallerSlug: "camino-del-guerrero",
      sede: "Río Gallegos",
      fechaInicio: "2026-08-22",
      fechaFin: "2026-08-23",
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
      fechaInicio: "2026-08-29",
      fechaFin: "2026-08-30",
    },
    {
      title: "Constelaciones Familiares Abiertas.",
      subtitle: "Río Gallegos",
      date: "31 de Agosto 2026",
      time: "15:00 Horas",
      location: "Henry William Jamieson 547 - Quincho Jubi Legislativos",
      type: "Otro Taller",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: false,
      contactPhone: "+54 9 2966 595803",
      fechaInicio: "2026-08-31",
      fechaFin: "2026-08-31",
    },
    {
      title: "Taller de Autoconocimiento - Río Gallegos",
      date: "11, 12 y 13 de Septiembre 2026",
      time: "Inicio: Viernes 11 de Septiembre, 16:30 Horas",
      location: "Centro de Jubilados Legislativos — Henry Williams Jamieson 548, Río Gallegos",
      type: "Taller de Liderazgo",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: true,
      flyerImage: "/auto-septiembre-2026.jpeg",
      flyerImageAlt: "/images/auto-septiembre-2026.jpeg",
      level: "1er Nivel",
      contactPhone: "+54 9 2966 595803",
      tallerSlug: "autoconocimiento",
      tallerId: "6fc43f61-dc88-41ed-aa66-77d7d65d6456",
      sede: "Río Gallegos",
      fechaInicio: "2026-09-11",
      fechaFin: "2026-09-13",
    },
    {
      title: "Taller de Autoconocimiento - El Calafate",
      date: "9, 10 y 11 de Octubre 2026",
      time: "Inicio: Viernes 9 de Octubre, 17 Horas",
      location: "Lugar a Designar",
      type: "Taller de Liderazgo",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: true,
      flyerImage: "/auto-Calafate-octubre-2026.jpeg",
      flyerImageAlt: "/images/auto-Calafate-octubre-2026.jpeg",
      level: "1er Nivel",
      contactPhone: "+54 9 2966 595803",
      tallerSlug: "autoconocimiento",
      sede: "El Calafate",
      fechaInicio: "2026-10-09",
      fechaFin: "2026-10-11",
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
      fechaInicio: "2026-10-31",
      fechaFin: "2026-11-01",
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
      tallerSlug: "camino-del-guerrero",
      tallerId: "82cac61c-8f4b-4316-bdd0-126994ed6a81",
      sede: "Quequén-Neco",
      fechaInicio: "2026-11-07",
      fechaFin: "2026-11-08",
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
      tallerSlug: "autoconocimiento",
      sede: "Quequén-Neco",
      fechaInicio: "2026-11-13",
      fechaFin: "2026-11-15",
    },
    {
      title: "Taller de Autoconocimiento - Ciudad de Buenos Aires",
      date: "4, 5 y 6 de Diciembre 2026",
      time: "Inicio: Viernes 4 de Diciembre a las 17 Horas",
      location: "Ciudad de Buenos Aires",
      type: "Taller de Liderazgo",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: true,
      flyerImage: "/auto-caba-dic-2026.png",
      flyerImageAlt: "/images/auto-caba-dic-2026.png",
      level: "1er Nivel",
      contactPhone: "+54 11 65561592",
      contactWhatsappOnly: true,
      tallerSlug: "autoconocimiento",
      sede: "CABA",
      fechaInicio: "2026-12-04",
      fechaFin: "2026-12-06",
    },
    {
      title: "Taller de Transformación - Río Gallegos",
      date: "10, 11, 12 y 13 de Diciembre 2026",
      time: "Inicio: Jueves 10 de Diciembre, 17 Horas",
      location: "Lugar a Indicar",
      type: "Taller de Liderazgo",
      available: true,
      availabilityText: "Cupos disponibles",
      hasFlyer: true,
      flyerImage: "/transfor-dic-2026.jpeg",
      flyerImageAlt: "/images/transfor-dic-2026.jpeg",
      level: "2do Nivel",
      contactPhone: "+54 9 2966 595803",
      tallerSlug: "transformacion",
      sede: "Río Gallegos",
      fechaInicio: "2026-12-10",
      fechaFin: "2026-12-13",
    },
  ]

  const today = new Date().toISOString().split("T")[0]
  const upcomingEvents = events.filter(e => {
    const cutoff = e.fechaFin ?? e.fechaInicio
    return !cutoff || cutoff >= today
  })
  const autoPassedEvents = events
    .filter(e => {
      const cutoff = e.fechaFin ?? e.fechaInicio
      return !!cutoff && cutoff < today
    })
    .map(e => ({ ...e, available: false, availabilityText: "Evento Realizado" }))
  const allPastEvents = [...autoPassedEvents, ...pastEvents]

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
          {upcomingEvents.map((event, index) => (
            <EventCard key={index} event={event} talleresActivos={talleresActivos} talleresMap={talleresMap} />
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
              {allPastEvents.map((event, index) => (
                <EventCard key={index} event={event} talleresActivos={talleresActivos} talleresMap={talleresMap} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
