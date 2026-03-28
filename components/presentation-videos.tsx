"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

const VIDEO_SRC = "/Video-transfor-abril-2026.mp4"

export function PresentationVideos() {
  const [isOpen, setIsOpen] = React.useState(true)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const handleClose = React.useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    setIsOpen(false)
  }, [])

  // Intento de autoplay usando listener nativo del DOM (más confiable que
  // los synthetic events de React, especialmente con caché en móvil)
  React.useEffect(() => {
    const v = videoRef.current
    if (!v) return

    let attempted = false

    const tryPlay = () => {
      if (attempted) return
      attempted = true
      v.muted = false
      v.play().catch(() => {
        // Si el navegador bloquea el autoplay con sonido, intentar sin mute
        // pero dejar que el usuario active el sonido manualmente
        v.muted = false
      })
    }

    if (v.readyState >= 1) {
      // Ya cargado desde caché → actuar de inmediato
      tryPlay()
    } else {
      // Primera carga → esperar el evento nativo
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
              Taller de Transformación — Abril 2026
            </p>
            <img src="/fuego-de-sentir.png" alt="" className="h-7 w-auto" />
          </div>

          {/* Video — sin spinner, controles nativos siempre visibles */}
          <div className="bg-black">
            <video
              ref={videoRef}
              src={VIDEO_SRC}
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
