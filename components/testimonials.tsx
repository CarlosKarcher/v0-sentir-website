"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Video } from "lucide-react"
import { useEffect, useState } from "react"

const writtenTestimonials = [
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

const videoTestimonials = [
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

  useEffect(() => {
    // Función para actualizar la pestaña activa basada en el hash
    const updateTabFromHash = () => {
      const hash = window.location.hash
      if (hash === "#testimonios-video") {
        setActiveTab("video")
      } else if (hash === "#testimonios-escritos") {
        setActiveTab("written")
      }
    }

    // Detectar hash inicial
    updateTabFromHash()
    
    // Scroll suave a la sección si hay hash, teniendo en cuenta el header sticky
    const hash = window.location.hash
    if (hash === "#testimonios-video" || hash === "#testimonios-escritos") {
      setTimeout(() => {
        const element = document.getElementById("testimonios")
        if (element) {
          const headerOffset = 80
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          })
        }
      }, 100)
    }

    // Escuchar cambios en el hash
    const handleHashChange = () => {
      updateTabFromHash()
      setTimeout(() => {
        const element = document.getElementById("testimonios")
        if (element) {
          const headerOffset = 80
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          })
        }
      }, 100)
    }

    // Escuchar eventos de hashchange
    window.addEventListener("hashchange", handleHashChange)
    // También escuchar cambios manuales del hash
    const interval = setInterval(() => {
      const currentHash = window.location.hash
      if (currentHash === "#testimonios-video" && activeTab !== "video") {
        setActiveTab("video")
      } else if (currentHash === "#testimonios-escritos" && activeTab !== "written") {
        setActiveTab("written")
      }
    }, 100)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
      clearInterval(interval)
    }
  }, [activeTab])

  return (
    <section id="testimonios" className="py-20 bg-secondary/30">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Testimonios</h2>
          <p className="text-lg text-muted-foreground text-pretty">Historias reales de transformación y crecimiento</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="written" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Escritos
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Visuales
            </TabsTrigger>
          </TabsList>

          <TabsContent id="testimonios-escritos" value="written">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {writtenTestimonials.map((testimonial, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <img
                      src={testimonial.image}
                      alt={`Testimonio de ${testimonial.name}`}
                      className="w-full h-auto object-cover"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent id="testimonios-video" value="video">
            <div className="grid md:grid-cols-2 gap-6">
              {videoTestimonials.map((testimonial, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <video
                        src={testimonial.video}
                        controls
                        className="w-full h-auto"
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
