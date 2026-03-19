"use client"

import * as React from "react"
import { X, Play, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

const VIDEO_SRC = "/video-punta-arenas-2.mp4"

function getVideoSrc(path: string): string {
  if (typeof window === "undefined") return path
  return `${window.location.origin}${path}`
}

export function PresentationVideos() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [playing, setPlaying] = React.useState(false)
  const [muted, setMuted] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [retryCount, setRetryCount] = React.useState(0)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const autoplayAttempted = React.useRef(false)

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    setIsOpen(false)
  }

  // Intenta reproducir con sonido; si falla (móvil), reproduce silenciado
  const attemptAutoplay = async () => {
    if (!videoRef.current) return
    try {
      videoRef.current.muted = false
      await videoRef.current.play()
      setMuted(false)
      setPlaying(true)
    } catch {
      try {
        videoRef.current.muted = true
        await videoRef.current.play()
        setMuted(true)
        setPlaying(true)
      } catch {
        // El usuario tendrá que tocar play manualmente
        setPlaying(false)
      }
    }
  }

  const handlePlayClick = async () => {
    if (!videoRef.current) return
    try {
      videoRef.current.muted = false
      await videoRef.current.play()
      setMuted(false)
      setPlaying(true)
    } catch {
      // Si sigue fallando (raro), mostramos error
      setError(true)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setMuted(videoRef.current.muted)
  }

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const el = e.currentTarget
    const err = el.error
    if (err) {
      const codigos: Record<number, string> = {
        1: "MEDIA_ERR_ABORTED",
        2: "MEDIA_ERR_NETWORK",
        3: "MEDIA_ERR_DECODE",
        4: "MEDIA_ERR_SRC_NOT_SUPPORTED",
      }
      console.error("[Presentación]", codigos[err.code] || err.code, "URL:", el.src)
    }
    if (retryCount < 2) {
      setRetryCount((c) => c + 1)
      setLoading(true)
      setError(false)
      setTimeout(() => videoRef.current?.load(), 800)
    } else {
      setError(true)
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setError(false)
    setRetryCount(0)
    setLoading(true)
    if (videoRef.current) {
      videoRef.current.src = getVideoSrc(VIDEO_SRC)
      videoRef.current.load()
    }
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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none p-2 sm:p-4">
        <div
          className="relative bg-background rounded-xl shadow-2xl pointer-events-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "fit-content",
            maxWidth: "96vw",
            maxHeight: "92vh",
            padding: "0.5rem",
          }}
        >
          {/* Botón cerrar */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 z-[10000] rounded-full hover:bg-destructive hover:text-destructive-foreground cursor-pointer bg-background/80"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleClose()
            }}
            aria-label="Cerrar presentación"
            type="button"
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Título */}
          <div className="flex items-center justify-center gap-2 pt-2 pb-2 flex-wrap">
            <img src="/fuego-de-sentir.png" alt="" className="h-7 w-auto object-contain" />
            <p className="text-base sm:text-lg font-bold text-foreground">
              Taller de Autoconocimiento — Punta Arenas 2026
            </p>
            <img src="/fuego-de-sentir.png" alt="" className="h-7 w-auto object-contain" />
          </div>

          {/* Contenedor del video */}
          <div className="flex-1 min-h-0 mt-1">
            <div
              key={retryCount}
              className="relative w-full flex flex-col items-center justify-center rounded-lg overflow-hidden bg-black"
            >
              {error ? (
                <div className="text-center p-6 space-y-2 bg-muted/30 rounded-lg w-full">
                  <p className="text-sm font-semibold">No se pudo cargar el video</p>
                  <p className="text-xs text-muted-foreground break-all">{VIDEO_SRC}</p>
                  <Button variant="outline" size="sm" onClick={handleRetry}>
                    Reintentar
                  </Button>
                </div>
              ) : (
                <div className="relative flex items-center justify-center">
                  {/* Spinner de carga */}
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 rounded-lg">
                      <span className="text-xs text-white/80">Cargando...</span>
                    </div>
                  )}

                  <video
                    ref={videoRef}
                    src={getVideoSrc(VIDEO_SRC)}
                    playsInline
                    preload="auto"
                    controls={playing}
                    className="rounded-lg object-contain block"
                    style={{ width: "min(480px, 90vw)", maxHeight: "65vh" }}
                    onError={handleError}
                    onEnded={handleClose}
                    onCanPlay={() => {
                      setLoading(false)
                      if (!autoplayAttempted.current) {
                        autoplayAttempted.current = true
                        attemptAutoplay()
                      }
                    }}
                    onPlaying={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                  >
                    Tu navegador no soporta el video.
                  </video>

                  {/* Overlay: botón Play — visible cuando no está reproduciendo */}
                  {!playing && !loading && !error && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handlePlayClick()
                        }}
                        className="flex items-center justify-center rounded-full shadow-2xl transition-transform active:scale-95 hover:scale-105"
                        style={{
                          width: 72,
                          height: 72,
                          backgroundColor: "rgba(255, 184, 77, 0.92)",
                        }}
                        aria-label="Reproducir video"
                        type="button"
                      >
                        <Play className="h-8 w-8 text-white fill-white ml-1" />
                      </button>
                    </div>
                  )}

                  {/* Botón desmutear — aparece cuando está reproduciendo en silencio */}
                  {playing && muted && (
                    <div className="absolute bottom-2 right-2 z-30">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleMute()
                        }}
                        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-lg animate-pulse"
                        style={{ backgroundColor: "rgba(255, 184, 77, 0.92)" }}
                        type="button"
                        aria-label="Activar sonido"
                      >
                        <VolumeX className="h-4 w-4" />
                        Toca para activar sonido
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
