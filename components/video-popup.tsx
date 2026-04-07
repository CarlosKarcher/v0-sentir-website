"use client"

import * as React from "react"
import { X, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VideoPopup() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  // Autorun al montar
  React.useEffect(() => {
    const v = videoRef.current
    if (!v) return

    const tryPlay = () => {
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

    return () => v.removeEventListener("loadedmetadata", tryPlay)
  }, [])

  const handleClose = () => {
    videoRef.current?.pause()
    setIsOpen(false)
  }

  const handlePlay = () => {
    videoRef.current?.play().catch(() => {})
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4">
        <div
          className="relative bg-black rounded-xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          style={{ width: "min(480px, 96vw)", maxHeight: "92vh" }}
        >
          {/* Botón cerrar */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 rounded-full bg-black/60 hover:bg-destructive hover:text-destructive-foreground text-white"
            onClick={handleClose}
            aria-label="Cerrar"
            type="button"
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Video */}
          <video
            ref={videoRef}
            src="/Video-transfor.mp4"
            playsInline
            controls={isPlaying}
            preload="metadata"
            className="w-full block"
            style={{ maxHeight: "85vh" }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          >
            Tu navegador no soporta el video.
          </video>

          {/* Botón play (visible solo si no está reproduciendo) */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Button
                size="lg"
                className="rounded-full px-6 py-6 text-white font-semibold pointer-events-auto"
                style={{ backgroundColor: "#FFB84D", borderColor: "#FFB84D" }}
                onClick={handlePlay}
                type="button"
                aria-label="Reproducir"
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
