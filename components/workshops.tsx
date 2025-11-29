"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Sparkles, Trophy, Sword, Baby, Activity, Users, MessageCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { scrollToElement } from "@/lib/scroll"
import { SECTION_IDS, HEADER_OFFSET } from "@/lib/constants"

// Función helper para generar enlace de WhatsApp
const getWhatsAppLink = (phoneNumber: string) => {
  const cleanNumber = phoneNumber.replace(/\s+/g, '')
  return `https://wa.me/${cleanNumber}`
}

export function Workshops() {
  const [activeTab, setActiveTab] = useState("liderazgo")

  // Manejar cambio de pestaña desde clic directo
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  useEffect(() => {
    // Función para actualizar la pestaña activa basada en el hash (solo desde el menú)
    const updateTabFromHash = () => {
      const hash = window.location.hash
      if (hash === `#${SECTION_IDS.LIDERAZGO}`) {
        setActiveTab("liderazgo")
      } else if (hash === `#${SECTION_IDS.OTROS_TALLERES}`) {
        setActiveTab("otros")
      } else if (hash === `#${SECTION_IDS.SESIONES}`) {
        setActiveTab("sesiones")
      }
    }

    // Detectar hash inicial solo si viene del menú
    const hash = window.location.hash
    if (hash === `#${SECTION_IDS.LIDERAZGO}` || hash === `#${SECTION_IDS.OTROS_TALLERES}` || hash === `#${SECTION_IDS.SESIONES}`) {
      updateTabFromHash()
      // Scroll suave a la sección si hay hash
      setTimeout(() => {
        scrollToElement(SECTION_IDS.TALLERES, HEADER_OFFSET)
      }, 100)
    }

    // Escuchar cambios en el hash (solo desde el menú)
    const handleHashChange = () => {
      updateTabFromHash()
      setTimeout(() => {
        scrollToElement(SECTION_IDS.TALLERES, HEADER_OFFSET)
      }, 100)
    }

    // Escuchar eventos de hashchange
    window.addEventListener("hashchange", handleHashChange)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  return (
    <section id={SECTION_IDS.TALLERES} className="py-12 sm:py-16 md:py-20 w-full">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-balance">Talleres, Charlas y Sesiones</h2>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty">
            Programas diseñados para tu crecimiento y transformación personal
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8 sm:mb-12 overflow-x-auto">
            <TabsTrigger value="liderazgo" className="text-xs sm:text-sm">Liderazgo</TabsTrigger>
            <TabsTrigger value="otros" className="text-xs sm:text-sm">Otros Talleres</TabsTrigger>
            <TabsTrigger value="sesiones" className="text-xs sm:text-sm">Sesiones</TabsTrigger>
          </TabsList>

          <TabsContent id={SECTION_IDS.LIDERAZGO} value="liderazgo">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="rounded-full bg-blue-900/10 w-12 h-12 flex items-center justify-center mb-4 overflow-hidden">
                    <img src="/Mano 4D.png" alt="Mano 4D" className="w-full h-full object-contain" />
                  </div>
                  <CardTitle>1. Autoconocimiento</CardTitle>
                  <CardDescription>Descubre tu esencia</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-pretty">
                    Explora tu interior, identifica tus patrones y conecta con tu verdadero ser. El primer paso hacia el
                    liderazgo auténtico.
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Nivel 1</Badge>
                    <Button 
                      size="sm"
                      className="text-xs bg-blue-900 hover:bg-blue-800 text-white"
                      onClick={() => window.open(getWhatsAppLink('+5492966595803'), '_blank')}
                    >
                      Más Información...
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="rounded-full bg-blue-900/10 w-12 h-12 flex items-center justify-center mb-4 overflow-hidden">
                    <img src="/Transfor Gaviotas.jpg" alt="Transformación" className="w-full h-full object-contain" />
                  </div>
                  <CardTitle>2. Transformación</CardTitle>
                  <CardDescription>Evoluciona conscientemente</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-pretty">
                    Libera creencias limitantes, transforma tus paradigmas y crea la versión más poderosa de ti mismo.
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Nivel 2</Badge>
                    <Button 
                      size="sm"
                      className="text-xs bg-blue-900 hover:bg-blue-800 text-white"
                      onClick={() => window.open(getWhatsAppLink('+5492966595803'), '_blank')}
                    >
                      Más Información...
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="rounded-full bg-blue-900/10 w-12 h-12 flex items-center justify-center mb-4 overflow-hidden">
                    <img src="/Vuelo de Gansos.jpg" alt="Vuelo de Gansos" className="w-full h-full object-contain" />
                  </div>
                  <CardTitle>3. MyL - Metas y Logros</CardTitle>
                  <CardDescription>Alcanza tus objetivos</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-pretty">
                    Define objetivos claros, diseña tu plan de acción y materializa tus sueños con estrategias efectivas
                    de liderazgo.
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Nivel 3</Badge>
                    <Button 
                      size="sm"
                      className="text-xs bg-blue-900 hover:bg-blue-800 text-white"
                      onClick={() => window.open(getWhatsAppLink('+5492966595803'), '_blank')}
                    >
                      Más Información...
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent id={SECTION_IDS.OTROS_TALLERES} value="otros">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="rounded-full bg-accent/10 w-12 h-12 flex items-center justify-center mb-4 overflow-hidden">
                    <img src="/Camino del Guerrero.png" alt="Camino del Guerrero" className="w-full h-full object-contain" />
                  </div>
                  <CardTitle>El Camino del Guerrero</CardTitle>
                  <CardDescription>Fortaleza y coraje</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-pretty">
                    Desarrolla valentía, disciplina y resiliencia. Aprende a enfrentar desafíos con la fuerza y
                    sabiduría de un guerrero consciente.
                  </p>
                  <Button 
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                    onClick={() => window.open(getWhatsAppLink('+5492966595803'), '_blank')}
                  >
                    Más Información...
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 overflow-hidden">
                    <img src="/Niño interior.jpg" alt="Niño Interior" className="w-full h-full object-contain" />
                  </div>
                  <CardTitle>Sanando mi Niño Interior</CardTitle>
                  <CardDescription>Sanación emocional profunda</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-pretty">
                    Reconecta con tu niño interior, sana heridas del pasado y recupera la inocencia, alegría y
                    espontaneidad.
                  </p>
                  <Button 
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                    onClick={() => window.open(getWhatsAppLink('+5492966595803'), '_blank')}
                  >
                    Más Información...
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="rounded-full bg-accent/10 w-12 h-12 flex items-center justify-center mb-4 overflow-hidden">
                    <img src="/biodecodificacion cuerpo.png" alt="Biodecodificación" className="w-full h-full object-contain" />
                  </div>
                  <CardTitle>Taller de Biodecodificación</CardTitle>
                  <CardDescription>Tu cuerpo tiene algo que contarte</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-pretty">
                    Descubre el mensaje emocional detrás de tus síntomas físicos. Aprende a escuchar y sanar desde la
                    raíz.
                  </p>
                  <Button 
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                    onClick={() => window.open(getWhatsAppLink('+5492966211547'), '_blank')}
                  >
                    Más Información...
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent id={SECTION_IDS.SESIONES} value="sesiones">
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 overflow-hidden">
                    <img src="/Constelaciones.jpg" alt="Constelaciones Familiares" className="w-full h-full object-contain" />
                  </div>
                  <CardTitle>Constelaciones Familiares</CardTitle>
                  <CardDescription>Grupales e Individuales</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-pretty">
                    Explora y sana las dinámicas familiares que afectan tu vida. Libera patrones transgeneracionales y
                    encuentra paz en tus relaciones.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Sesiones grupales mensuales
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Sesiones individuales Presenciales y On Line
                    </li>
                  </ul>
                  <Button 
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                    onClick={() => window.open(getWhatsAppLink('+5492966595803'), '_blank')}
                  >
                    Más Información...
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="rounded-full bg-accent/10 w-12 h-12 flex items-center justify-center mb-4 overflow-hidden">
                    <img src="/sesiones de Coaching.jpg" alt="Sesiones de Coaching" className="w-full h-full object-contain" />
                  </div>
                  <CardTitle>Sesiones de Coaching</CardTitle>
                  <CardDescription>Acompañamiento personalizado</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-pretty">
                    Recibe acompañamiento uno a uno para alcanzar tus metas personales y profesionales. Coaching
                    ontológico y de vida.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                      Sesiones presenciales y online
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                      Planes personalizados
                    </li>
                  </ul>
                  <Button 
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                    onClick={() => window.open(getWhatsAppLink('+5492966595803'), '_blank')}
                  >
                    Más Información...
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
