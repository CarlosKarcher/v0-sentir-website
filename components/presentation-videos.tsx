"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

const VIDEO_SRC = "/video-punta-arenas-2.mp4"

export function PresentationVideos() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const autoplayAttempted = React.useRef(false)
  const loadingTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fuerza ocultar el spinner después de 5 segundos sin importar qué
  React.useEffect(() => {
    loadingTimerRef.current = setTimeout(() => {
      setLoading(false)
    }, 5000)
    return () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current)
    }
  }, [])

  // Si el video ya está en caché, los eventos disparan ANTES de que React
  // termine de montar — chequeamos readyState manualmente al montar
  React.useEffect(() => {
    const v = videoRef.current
    if (!v) return
    // readyState >= 1 = HAVE_METADATA (ya cargado desde caché)
    if (v.readyState >= 1) {
      stopLoading()
      if (!autoplayAttempted.current) {
        autoplayAttempted.current = true
        v.muted = false
        v.play().catch(() => {
          v.muted = true
          v.play().catch(() => {})
        })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stopLoading = () => {
    setLoading(false)
    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current)
  }

  const tryAutoplay = async () => {
    const v = videoRef.current
    if (!v || autoplayAttempted.current) return
    autoplayAttempted.current = true
    try {
      v.muted = false
      await v.play()
    } catch {
      try {
        v.muted = true
        await v.play()
      } catch {
        // El usuario usa los controles nativos
      }
    }
  }

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    setIsOpen(false)
  }

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
          className="relative bg-background rounded-xl shadow-2xl flex flex-col"
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
              Taller de Autoconocimiento — Punta Arenas 2026
            </p>
            <img src="/fuego-de-sentir.png" alt="" className="h-7 w-auto" />
          </div>

          {/* Video */}
          <div className="relative rounded-b-xl overflow-hidden bg-black">
            {/* Spinner — desaparece con onLoadedMetadata o tras 5s */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  <span className="text-xs text-white/60">Cargando video...</span>
                </div>
              </div>
            )}

            {error ? (
              <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
                <p className="text-sm font-semibold text-white">No se pudo cargar el video</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setError(false)
                    setLoading(true)
                    autoplayAttempted.current = false
                    videoRef.current?.load()
                  }}
                >
                  Reintentar
                </Button>
              </div>
            ) : (
              <video
                ref={videoRef}
                src={VIDEO_SRC}
                playsInline
                controls
                preload="metadata"
                className="w-full block"
                style={{ maxHeight: "70vh" }}
                onLoadedMetadata={() => {
                  // Dispara rápido incluso en móvil — suficiente para ocultar el spinner
                  stopLoading()
                  tryAutoplay()
                }}
                onCanPlay={() => {
                  stopLoading()
                  tryAutoplay()
                }}
                onPlaying={stopLoading}
                onEnded={handleClose}
                onError={() => {
                  stopLoading()
                  setError(true)
                }}
              >
                Tu navegador no soporta el video.
              </video>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
