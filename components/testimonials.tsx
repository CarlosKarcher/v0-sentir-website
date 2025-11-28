"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Video } from "lucide-react"
import { useEffect, useState } from "react"
import { scrollToElement } from "@/lib/scroll"
import { SECTION_IDS, HEADER_OFFSET } from "@/lib/constants"
import type { WrittenTestimonial, VideoTestimonial } from "@/lib/types"

const writtenTestimonials: WrittenTestimonial[] = [
  {
    name: "Ainhoa Almonacid",
    image: "/Testimonio Ainhoa almonacid.jpg",
  },
  {
    name: "Cecilia Alvarez",
    image: "/Testimonio Cecilia Alvarez.jpg",
  },
  {
    name: "Deborah Bramuglia",
    image: "/Testimonio Deborah Bramuglia.jpg",
  },
  {
    name: "Lia Delfino",
    image: "/Testimonio Lia Delfino.jpg",
  },
  {
    name: "Francisco Ernesto Salazar",
    image: "/Testimonio Francisco Ernesto Salazar.jpg",
  },
  {
    name: "Natali Maresca",
    image: "/Testimonio Natali Maresca.jpg",
  },
]

const videoTestimonials: VideoTestimonial[] = [
  {
    name: "Natali",
    video: "/Testimonio Visual de Natali.mp4",
  },
  {
    name: "Soledad",
    video: "/Testimonio Visual de Soledad.mp4",
  },
  {
    name: "Francisco",
    video: "/Testimonio Visual Francisco .mp4",
  },
  {
    name: "Dami",
    video: "/Testimonio Visual Dami.mp4",
  },
]

export function Testimonials() {
  const [activeTab, setActiveTab] = useState("written")

  // Manejar cambio de pestaña desde clic directo
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  useEffect(() => {
    // Función para actualizar la pestaña activa basada en el hash (solo desde el menú)
    const updateTabFromHash = () => {
      const hash = window.location.hash
      if (hash === `#${SECTION_IDS.TESTIMONIOS_VIDEO}`) {
        setActiveTab("video")
      } else if (hash === `#${SECTION_IDS.TESTIMONIOS_ESCRITOS}`) {
        setActiveTab("written")
      }
    }

    // Detectar hash inicial solo si viene del menú
    const hash = window.location.hash
    if (hash === `#${SECTION_IDS.TESTIMONIOS_VIDEO}` || hash === `#${SECTION_IDS.TESTIMONIOS_ESCRITOS}`) {
      updateTabFromHash()
      // Scroll suave a la sección si hay hash
      setTimeout(() => {
        scrollToElement(SECTION_IDS.TESTIMONIOS, HEADER_OFFSET)
      }, 100)
    }

    // Escuchar cambios en el hash (solo desde el menú)
    const handleHashChange = () => {
      updateTabFromHash()
      setTimeout(() => {
        scrollToElement(SECTION_IDS.TESTIMONIOS, HEADER_OFFSET)
      }, 100)
    }

    // Escuchar eventos de hashchange
    window.addEventListener("hashchange", handleHashChange)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  return (
    <section id={SECTION_IDS.TESTIMONIOS} className="py-12 sm:py-16 md:py-20 bg-secondary/30 w-full flex justify-center">
      <div className="container px-4 mx-auto w-full max-w-7xl">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-balance">Testimonios</h2>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty">Historias reales de transformación y crecimiento</p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 sm:mb-12">
            <TabsTrigger value="written" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Escritos
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Visuales
            </TabsTrigger>
          </TabsList>

          <TabsContent id={SECTION_IDS.TESTIMONIOS_ESCRITOS} value="written">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {writtenTestimonials.map((testimonial, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0 flex justify-center items-center">
                    <img
                      src={testimonial.image}
                      alt={`Testimonio de ${testimonial.name}`}
                      className="w-full h-auto object-contain mx-auto block"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent id={SECTION_IDS.TESTIMONIOS_VIDEO} value="video">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {videoTestimonials.map((testimonial, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative flex justify-center items-center">
                      <video
                        src={testimonial.video}
                        controls
                        className="w-full h-auto mx-auto block"
                        preload="metadata"
                        playsInline
                        onError={(e) => {
                          console.error(`Error al cargar el video: ${testimonial.video}`, e)
                        }}
                      >
                        Tu navegador no soporta el elemento de video.
                      </video>
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
