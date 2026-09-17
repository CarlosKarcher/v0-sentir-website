"use client"

import * as React from "react"
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

export function Hero({ onAnotate }: { onAnotate?: () => void }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1))
    }, 5000) // 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex justify-center overflow-hidden">
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
                className="w-full h-full mx-auto"
                style={{
                  objectFit: "cover",
                  objectPosition: "center center",
                  imageRendering: "-webkit-optimize-contrast",
                  filter: "none",
                  backfaceVisibility: "hidden",
                  transform: "translate3d(0, 0, 0)",
                  willChange: "opacity",
                  display: "block",
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

      <div className="w-full max-w-7xl mx-auto relative z-10 text-center px-4 pt-0 pb-2">
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-1 md:mb-2 leading-tight">
          <span className="text-blue-900">SENTIR</span>
        </h1>
        <p className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3 max-w-3xl mx-auto">
          Comunidad para el Liderazgo y Desarrollo Personal
        </p>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-2 md:mb-4 max-w-xl mx-auto">
          Un espacio de transformación, crecimiento y autoconocimiento donde descubrirás tu verdadero potencial
        </p>
        <div className="flex flex-col gap-2 items-center px-4">
          <div className="flex flex-row gap-2 justify-center flex-wrap">
            <Button
              size="sm"
              className="text-sm md:text-base md:px-5 bg-blue-900 hover:bg-blue-800 text-white"
              onClick={() => scrollToElement(SECTION_IDS.QUIENES_SOMOS)}
            >
              Comenza tu camino..
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              size="sm"
              className="text-sm md:text-base md:px-5 bg-blue-900 hover:bg-blue-800 text-white"
              onClick={() => scrollToElement(SECTION_IDS.CONTACTO)}
            >
              Contacto
            </Button>
          </div>
          <div className="flex flex-row gap-2 justify-center flex-wrap">
            <a
              href="/talleres-inscripcion"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px 16px",
                fontSize: "0.875rem",
                fontWeight: 900,
                color: "#fff",
                borderRadius: "6px",
                textDecoration: "none",
                letterSpacing: "0.04em",
                animation: "pulsarVerde 2s ease-in-out infinite",
                boxShadow: "0 0 20px 4px rgba(34,197,94,0.5)",
              }}
            >
              Inscribite Aquí.!!
            </a>
            <Button
              size="sm"
              className="text-sm md:text-base md:px-5 bg-green-700 hover:bg-green-600 text-white font-bold"
              onClick={onAnotate}
            >
              Registrate
            </Button>
          </div>
        </div>
        <style>{`
          @keyframes pulsarVerde {
            0%   { background-color: #15803d; box-shadow: 0 0 16px 3px rgba(34,197,94,0.4); }
            50%  { background-color: #22c55e; box-shadow: 0 0 32px 10px rgba(34,197,94,0.85); }
            100% { background-color: #15803d; box-shadow: 0 0 16px 3px rgba(34,197,94,0.4); }
          }
        `}</style>

        {/* Alianza SENTIR + ACEPTAR ES CRECER */}
        <div className="mt-3 md:mt-5 pt-3 border-t border-white/20">
          <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-1">Alianza Institucional</p>
          <p className="text-sm sm:text-lg md:text-2xl font-black text-slate-700 mb-2">SENTIR + ACEPTAR ES CRECER</p>
          <div className="flex flex-row items-center justify-center gap-4 sm:gap-12 md:gap-20 mb-2">
            <div className="flex flex-col items-center gap-1">
              <img src="/Fuego de Sentir.png" alt="Sentir" className="w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain drop-shadow-lg" />
              <span className="text-blue-900 font-bold text-xs sm:text-sm md:text-base">SENTIR</span>
            </div>
            <span className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-300">+</span>
            <div className="flex flex-col items-center gap-1">
              <img src="/images/logo-aceptar-es-crecer.jpeg" alt="Aceptar es Crecer" className="w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain rounded-lg drop-shadow-lg" />
              <span className="text-yellow-600 font-bold text-xs sm:text-sm md:text-base">ACEPTAR ES CRECER</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            La Comunidad SENTIR trabaja junto a Aceptar es Crecer en Río Grande y Ushuaia, uniendo fuerzas para acompañar procesos de transformación personal y liderazgo.
          </p>
          <p className="text-xs text-slate-400 italic mt-1">Dos comunidades, un mismo propósito</p>
        </div>
      </div>
    </section>
  )
}
