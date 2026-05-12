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

          {/* Video + Cartel oferta animado encima */}
          <div className="bg-black" style={{ position: "relative" }}>
            <style>{`
              @keyframes bgShift {
                0% { background-position: 0% 0%; }
                100% { background-position: 200% 0%; }
              }
              @keyframes marqueeOferta {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
              }
            `}</style>

            {/* Cartel marquee sobre el video */}
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: 0,
                right: 0,
                zIndex: 20,
                pointerEvents: "none",
                overflow: "hidden",
                padding: "10px 0",
                background: "linear-gradient(90deg, #7f1d1d, #dc2626, #fbbf24, #dc2626, #7f1d1d)",
                backgroundSize: "200% 100%",
                animation: "bgShift 2s linear infinite",
                boxShadow: "0 4px 24px rgba(0,0,0,0.7)",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  whiteSpace: "nowrap",
                  animation: "marqueeOferta 8s linear infinite",
                  fontSize: "1.25rem",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "0.06em",
                  textShadow: "0 2px 10px rgba(0,0,0,0.9), 0 0 20px #fbbf24",
                  padding: "0 2rem",
                }}
              >
                🔥 SOLO POR HOY — OFERTA en el Camino del Guerrero 🔥 &nbsp;&nbsp;&nbsp;&nbsp; 🔥 SOLO POR HOY — OFERTA en el Camino del Guerrero 🔥
              </div>
            </div>

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
