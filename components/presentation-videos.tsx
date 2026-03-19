"use client"

import * as React from "react"
import { X, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

const VIDEO_SRC = "/video-punta-arenas-2.mp4"

function getVideoSrc(path: string): string {
  if (typeof window === "undefined") return path
  return `${window.location.origin}${path}`
}

export function PresentationVideos() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [playing, setPlaying] = React.useState(false)
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

  const handlePlay = async () => {
    if (!videoRef.current) return
    try {
      await videoRef.current.play()
      setPlaying(true)
    } catch (err) {
      if ((err as Error).name !== "NotAllowedError") {
        setError(true)
      }
    }
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
      <div
        className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none p-2">
        <div
          className="relative bg-background rounded-lg shadow-2xl pointer-events-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "fit-content",
            maxWidth: "96vw",
            maxHeight: "90vh",
            padding: "0.5rem",
          }}
        >
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

          <div className="flex items-center justify-center gap-2 pt-2 pb-1 flex-wrap">
            <img src="/fuego-de-sentir.png" alt="" className="h-8 w-auto object-contain" />
            <p className="text-lg font-bold text-foreground">
              Taller de Autoconocimiento — Punta Arenas 2026
            </p>
            <img src="/fuego-de-sentir.png" alt="" className="h-8 w-auto object-contain" />
          </div>

          <div className="flex-1 min-h-0 mt-2">
            <div
              key={retryCount}
              className="w-full flex flex-col items-center justify-center rounded-lg overflow-hidden bg-muted/30"
            >
              {error ? (
                <div className="text-center p-6 space-y-2">
                  <p className="text-sm font-semibold">No se pudo cargar el video</p>
                  <p className="text-xs text-muted-foreground break-all">{VIDEO_SRC}</p>
                  <Button variant="outline" size="sm" onClick={handleRetry}>
                    Reintentar
                  </Button>
                </div>
              ) : (
                <div className="relative w-full flex items-center justify-center">
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10 rounded-lg">
                      <span className="text-xs text-muted-foreground">Cargando...</span>
                    </div>
                  )}
                  <video
                    ref={videoRef}
                    src={getVideoSrc(VIDEO_SRC)}
                    playsInline
                    preload="auto"
                    controls={playing}
                    muted={false}
                    className="rounded-lg object-contain block"
                    style={{ width: "min(480px, 90vw)", maxHeight: "70vh" }}
                    onError={handleError}
                    onEnded={() => setPlaying(false)}
                    onCanPlay={() => {
                      setLoading(false)
                      if (!autoplayAttempted.current) {
                        autoplayAttempted.current = true
                        handlePlay()
                      }
                    }}
                    onPlaying={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                  >
                    Tu navegador no soporta el video.
                  </video>
                </div>
              )}
            </div>
          </div>

          {!playing && !error && (
            <div className="flex justify-center py-3">
              <Button
                size="lg"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handlePlay()
                }}
                className="rounded-full shadow-lg px-6 py-6 text-white font-semibold"
                style={{ backgroundColor: "#FFB84D", borderColor: "#FFB84D" }}
                aria-label="Reproducir video"
                type="button"
              >
                <Play className="h-6 w-6 mr-2" />
                Reproducir
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
