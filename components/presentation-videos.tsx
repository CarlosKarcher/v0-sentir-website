"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

const VIDEO_1 = "/Video-transfor-abril-2026.mp4"
const VIDEO_2 = "/video-transfor-abril-2026-2.mp4"

export function PresentationVideos() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [activeVideo, setActiveVideo] = React.useState<1 | 2>(1)
  const video1Ref = React.useRef<HTMLVideoElement>(null)
  const video2Ref = React.useRef<HTMLVideoElement>(null)

  const handleClose = React.useCallback(() => {
    video1Ref.current?.pause()
    video2Ref.current?.pause()
    setIsOpen(false)
  }, [])

  // Autoplay del primer video al abrir
  React.useEffect(() => {
    const v = video1Ref.current
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

  // Cuando termina el video 1 → arrancar video 2
  const handleVideo1Ended = React.useCallback(() => {
    setActiveVideo(2)
    const v = video2Ref.current
    if (!v) return
    v.muted = false
    v.play().catch(() => {
      v.muted = true
      v.play().catch(() => {})
    })
  }, [])

  // Cuando termina el video 2 → cerrar
  const handleVideo2Ended = React.useCallback(() => {
    setIsOpen(false)
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

          {/* Videos */}
          <div className="bg-black">
            {/* Video 1 */}
            <video
              ref={video1Ref}
              src={VIDEO_1}
              playsInline
              controls
              preload="metadata"
              className="w-full block"
              style={{ maxHeight: "70vh", display: activeVideo === 1 ? "block" : "none" }}
              onEnded={handleVideo1Ended}
            >
              Tu navegador no soporta el video.
            </video>

            {/* Video 2 */}
            <video
              ref={video2Ref}
              src={VIDEO_2}
              playsInline
              controls
              preload="metadata"
              className="w-full block"
              style={{ maxHeight: "70vh", display: activeVideo === 2 ? "block" : "none" }}
              onEnded={handleVideo2Ended}
            >
              Tu navegador no soporta el video.
            </video>
          </div>
        </div>
      </div>
    </>
  )
}
