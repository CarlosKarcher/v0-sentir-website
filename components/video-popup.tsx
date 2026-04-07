"use client"

import * as React from "react"
import { X, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VideoPopup() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [activeVideo, setActiveVideo] = React.useState<1 | 2>(1)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const video1Ref = React.useRef<HTMLVideoElement>(null)
  const video2Ref = React.useRef<HTMLVideoElement>(null)

  // Autorun video 1 al montar
  React.useEffect(() => {
    const v = video1Ref.current
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

  // Cuando termina video 1 → reproducir video 2
  const handleVideo1Ended = () => {
    setActiveVideo(2)
    const v = video2Ref.current
    if (!v) return
    v.muted = false
    v.play().catch(() => {
      v.muted = true
      v.play().catch(() => {})
    })
  }

  const handleClose = () => {
    video1Ref.current?.pause()
    video2Ref.current?.pause()
    setIsOpen(false)
  }

  const handlePlay = () => {
    const v = activeVideo === 1 ? video1Ref.current : video2Ref.current
    if (!v) return
    v.muted = false
    v.play().catch(() => {
      v.muted = true
      v.play().catch(() => {})
    })
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

          {/* Video 1 */}
          <video
            ref={video1Ref}
            src="/Video-transfor.mp4"
            playsInline
            controls
            preload="metadata"
            className="w-full block"
            style={{ maxHeight: "85vh", display: activeVideo === 1 ? "block" : "none" }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={handleVideo1Ended}
          >
            Tu navegador no soporta el video.
          </video>

          {/* Video 2 */}
          <video
            ref={video2Ref}
            src="/La-tribu-de-sentir.mp4"
            playsInline
            controls
            preload="metadata"
            className="w-full block"
            style={{ maxHeight: "85vh", display: activeVideo === 2 ? "block" : "none" }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          >
            Tu navegador no soporta el video.
          </video>

          {/* Botón play */}
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
