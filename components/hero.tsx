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

const TALLERES_DISPONIBLES = [
  { title: "Taller de Autoconocimiento — Río Gallegos", date: "19, 20 y 21 de Junio 2026", slug: "autoconocimiento", id: "9a45a2ae-ec59-41ea-befb-a28c7c59c87d", sede: "Río Gallegos", location: "Henry Williams Jamieson 548 - Jubilados Legislativos" },
  { title: "Taller de Transformación — Río Gallegos", date: "9, 10, 11 y 12 de Julio 2026", slug: "transformacion", id: "2ecd2571-70d4-401c-9a40-56f0a3ab589c", sede: "Río Gallegos", location: "Lugar a Confirmar" },
  { title: "Taller de MyL 7 — 1ra Sala — Río Gallegos", date: "8 y 9 de Agosto 2026", slug: "metas-y-logros", id: "893c6f59-783e-45ae-bb45-282216b1f616", sede: "Río Gallegos", location: "Río Gallegos" },
  { title: "Taller de MyL 7 — 2da Sala — Río Gallegos", date: "29 y 30 de Agosto 2026", slug: "metas-y-logros", id: "", sede: "Río Gallegos", location: "Río Gallegos" },
  { title: "Taller de Autoconocimiento — Córdoba", date: "25, 26 y 27 de Septiembre 2026", slug: "autoconocimiento", id: "", sede: "Córdoba", location: "Córdoba" },
  { title: "Taller de Autoconocimiento — El Calafate", date: "9, 10 y 11 de Octubre 2026", slug: "autoconocimiento", id: "", sede: "El Calafate", location: "Lugar a Designar" },
  { title: "Taller de MyL 7 — Campamento y Cierre — Río Gallegos", date: "31 de Octubre y 1 de Noviembre 2026", slug: "metas-y-logros", id: "", sede: "Río Gallegos", location: "Río Gallegos" },
  { title: "El Camino del Guerrero — Quequén/Necochea", date: "7 y 8 de Noviembre 2026", slug: "camino-del-guerrero", id: "82cac61c-8f4b-4316-bdd0-126994ed6a81", sede: "Quequén-Neco", location: "A Confirmar" },
  { title: "Taller de Autoconocimiento — Quequén/Necochea", date: "13, 14 y 15 de Noviembre 2026", slug: "autoconocimiento", id: "", sede: "Quequén-Neco", location: "A Confirmar" },
  { title: "Taller de Autoconocimiento — Ciudad de Buenos Aires", date: "4, 5 y 6 de Diciembre 2026", slug: "autoconocimiento", id: "", sede: "CABA", location: "Ciudad de Buenos Aires" },
]

export function Hero({ onAnotate }: { onAnotate?: () => void }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showTalleres, setShowTalleres] = useState(false)

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

      <div className="w-full max-w-7xl mx-auto relative z-10 text-center px-4 pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-balance leading-tight">
          <span className="text-blue-900">SENTIR</span>
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
            className="text-sm sm:text-base bg-blue-900 hover:bg-blue-800 text-white w-full sm:w-auto"
            onClick={() => scrollToElement(SECTION_IDS.QUIENES_SOMOS)}
          >
            Comenza tu camino..
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button 
            size="lg" 
            className="text-sm sm:text-base bg-blue-900 hover:bg-blue-800 text-white w-full sm:w-auto"
            onClick={() => scrollToElement(SECTION_IDS.CONTACTO)}
          >
            Contacto
          </Button>
        </div>
        <div className="mt-3 sm:mt-4 px-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            className="text-sm sm:text-base bg-blue-900 hover:bg-blue-800 text-white w-full sm:w-auto"
            onClick={() => scrollToElement(SECTION_IDS.SENTIR_DESDE_ADENTRO)}
          >
            Sentir desde Adentro
          </Button>
          <Button
            size="lg"
            className="text-sm sm:text-base bg-green-700 hover:bg-green-600 text-white w-full sm:w-auto font-bold"
            onClick={onAnotate}
          >
            Registrate
          </Button>
        </div>
        <div className="mt-3 sm:mt-4 px-4 flex justify-center relative">
          <button
            className="text-sm sm:text-base bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-md transition-colors"
            onClick={() => setShowTalleres((v) => !v)}
          >
            Inscribirse!!!!
          </button>
          {showTalleres && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowTalleres(false)} />
              <div className="absolute top-full mt-2 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 w-[min(420px,90vw)] text-left overflow-hidden">
                <p className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-b">
                  Elegí tu taller
                </p>
                {TALLERES_DISPONIBLES.map((t, i) => {
                  const url = `/inscribirse?taller=${t.slug}${t.id ? `&id=${t.id}` : ""}&localidad=${encodeURIComponent(t.sede)}&evento=${encodeURIComponent(`${t.title} — ${t.date} — ${t.location}`)}&back=proximos-eventos`
                  return (
                    <a
                      key={i}
                      href={url}
                      className="block px-4 py-3 hover:bg-green-50 border-b border-gray-100 last:border-0"
                      onClick={() => setShowTalleres(false)}
                    >
                      <p className="font-semibold text-sm text-gray-800">{t.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{t.date}</p>
                    </a>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
