"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { scrollToElement } from "@/lib/scroll"
import { SECTION_IDS } from "@/lib/constants"

const heroImages = [
  {
    src: "/images/sentir-20cierre-20autoconocimiento-20septiembre.jpg",
    alt: "Cierre Taller Autoconocimiento Septiembre",
  },
  {
    src: "/images/autoconocimiento-20vacio.jpg",
    alt: "Sala de Taller Autoconocimiento",
  },
  {
    src: "/images/552929862-102314116cierre-20autioconocimiento-20rio-20gallegos-20octubre.jpg",
    alt: "Taller Vivencial Autoconocimiento Río Gallegos",
  },
  {
    src: "/images/sentir-20noche-20magica.jpg",
    alt: "Noche Mágica SENTIR",
  },
  {
    src: "/images/sentir-20presentacion-20del-20staff-20autoconocimiento.jpg",
    alt: "Presentación del Staff",
  },
  {
    src: "/images/staff-20transformacion-20agosto-202025.jpg",
    alt: "Staff Transformación Agosto 2025",
  },
  {
    src: "/images/imagen-20de-20whatsapp-202025-11-26-20a-20las-2013.jpg",
    alt: "Fernando Cárcamo - Líder de SENTIR",
  },
]

export function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1))
    }, 5000) // 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[700px] flex justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{
                opacity: currentImageIndex === index ? 1 : 0,
                pointerEvents: currentImageIndex === index ? "auto" : "none",
              }}
            >
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-full"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  imageRendering: "-webkit-optimize-contrast",
                  filter: "none",
                  backfaceVisibility: "hidden",
                  transform: "translate3d(0, 0, 0)",
                  willChange: "opacity",
                }}
                loading="eager"
                fetchPriority="high"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentImageIndex === index ? "bg-primary w-8" : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>

      <div className="container relative z-10 text-center px-4 pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-balance leading-tight">
          <span className="text-lime-400">SENTIR</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-6 sm:mb-8 text-balance max-w-4xl mx-auto px-2">
          Comunidad para el Liderazgo y Desarrollo Personal
        </p>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto text-pretty px-2">
          Un espacio de transformación, crecimiento y autoconocimiento donde descubrirás tu verdadero potencial
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          <Button 
            size="lg" 
            className="text-sm sm:text-base w-full sm:w-auto"
            onClick={() => scrollToElement(SECTION_IDS.QUIENES_SOMOS)}
          >
            Comenza tu camino..
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button 
            size="lg" 
            className="text-sm sm:text-base bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
            onClick={() => scrollToElement(SECTION_IDS.CONTACTO)}
          >
            Contacto
          </Button>
        </div>
        <div className="mt-3 sm:mt-4 px-4">
          <Button 
            size="lg" 
            className="text-sm sm:text-base bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
            onClick={() => scrollToElement(SECTION_IDS.SENTIR_DESDE_ADENTRO)}
          >
            Sentir desde Adentro
          </Button>
        </div>
      </div>
    </section>
  )
}
