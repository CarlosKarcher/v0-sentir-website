"use client"

import * as React from "react"
import { X, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

const VIDEOS = ["/Video-transfor.mp4", "/La-tribu-de-sentir.mp4"]

export function VideoPopup() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const playVideo = (v: HTMLVideoElement) => {
    v.muted = false
    v.play().catch(() => {
      v.muted = true
      v.play().catch(() => {})
    })
  }

  // Autorun del primer video al montar
  React.useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (v.readyState >= 1) {
      playVideo(v)
    } else {
      v.addEventListener("loadedmetadata", () => playVideo(v), { once: true })
    }
  }, [])

  // Cuando cambia el índice: cambiar src, cargar y reproducir
  React.useEffect(() => {
    if (currentIndex === 0) return
    const v = videoRef.current
    if (!v) return
    v.src = VIDEOS[currentIndex]
    v.load()
    const onReady = () => playVideo(v)
    v.addEventListener("loadedmetadata", onReady, { once: true })
    return () => v.removeEventListener("loadedmetadata", onReady)
  }, [currentIndex])

  const handleClose = () => {
    videoRef.current?.pause()
    setIsOpen(false)
  }

  const handlePlay = () => {
    const v = videoRef.current
    if (!v) return
    playVideo(v)
  }

  const handleEnded = () => {
    if (currentIndex < VIDEOS.length - 1) {
      setIsPlaying(false)
      setCurrentIndex((i) => i + 1)
    } else {
      setIsPlaying(false)
    }
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

          {/* Video — elemento único, src se cambia imperativamente */}
          <video
            ref={videoRef}
            src={VIDEOS[0]}
            playsInline
            controls
            preload="metadata"
            className="w-full block"
            style={{ maxHeight: "85vh" }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={handleEnded}
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
