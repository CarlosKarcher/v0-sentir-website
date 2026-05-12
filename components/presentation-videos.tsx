"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

const VIDEO = "/auto-Mayo-2026.mp4"

export function PresentationVideos() {
  const [isOpen, setIsOpen] = React.useState(true)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const handleClose = React.useCallback(() => {
    videoRef.current?.pause()
    setIsOpen(false)
  }, [])

  // Autoplay al abrir
  React.useEffect(() => {
    const v = videoRef.current
    if (!v) return

    let attempted = false

    const tryPlay = () => {
      if (attempted) return
      attempted = true
      v.muted = false
      v.play().catch(() => {
        v.muted = true
        v.play().catch(() => {})
      })
    }

    if (v.readyState >= 1) {
      tryPlay()
    } else {
      v.addEventListener("loadedmetadata", tryPlay, { once: true })
    }

    return () => {
      v.removeEventListener("loadedmetadata", tryPlay)
    }
  }, [])

  if (!isOpen) return null

  return (
    <>
      {/* Fondo oscuro */}
      <div
        className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4">
        <div
          className="relative bg-background rounded-xl shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          style={{ width: "min(480px, 96vw)", maxHeight: "92vh" }}
        >
          {/* Botón cerrar */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 z-10 rounded-full hover:bg-destructive hover:text-destructive-foreground bg-background/90"
            onClick={handleClose}
            aria-label="Cerrar"
            type="button"
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Título */}
          <div className="flex items-center justify-center gap-2 px-8 pt-3 pb-2 flex-wrap">
            <img src="/fuego-de-sentir.png" alt="" className="h-7 w-auto" />
            <p className="text-sm sm:text-base font-bold text-center text-foreground">
              Autoconocimiento — Mayo 2026
            </p>
            <img src="/fuego-de-sentir.png" alt="" className="h-7 w-auto" />
          </div>

          {/* Cartel oferta animado */}
          <div
            style={{
              overflow: "hidden",
              background: "linear-gradient(90deg, #7f1d1d, #dc2626, #fbbf24, #dc2626, #7f1d1d)",
              backgroundSize: "200% 100%",
              animation: "bgShiftOferta 2s linear infinite",
              padding: "10px 0",
              boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "max-content",
                animation: "marqueeOferta 10s linear infinite",
              }}
            >
              {[0, 1].map((i) => (
                <span
                  key={i}
                  style={{
                    whiteSpace: "nowrap",
                    fontSize: "1.2rem",
                    fontWeight: 900,
                    color: "#fff",
                    letterSpacing: "0.06em",
                    textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                    padding: "0 4rem",
                  }}
                >
                  🔥 SOLO POR HOY — OFERTA en el Camino del Guerrero 🔥
                </span>
              ))}
            </div>
          </div>

          {/* Video */}
          <div className="bg-black">
            <video
              ref={videoRef}
              src={VIDEO}
              playsInline
              controls
              preload="metadata"
              className="w-full block"
              style={{ maxHeight: "70vh" }}
            >
              Tu navegador no soporta el video.
            </video>
          </div>
        </div>
      </div>
    </>
  )
}
