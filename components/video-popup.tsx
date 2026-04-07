"use client"

import * as React from "react"
import { X, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VideoPopup() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [activeVideo, setActiveVideo] = React.useState<1 | 2>(1)
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

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal ancho para dos videos lado a lado */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4">
        <div
          className="relative bg-black rounded-xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          style={{ width: "min(900px, 97vw)", maxHeight: "92vh" }}
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

          {/* Dos videos lado a lado */}
          <div className="flex flex-row gap-1">
            {/* Video 1 */}
            <div className="relative flex-1">
              <video
                ref={video1Ref}
                src="/Video-transfor.mp4"
                playsInline
                controls
                preload="metadata"
                className="w-full block"
                style={{ maxHeight: "85vh" }}
                onEnded={handleVideo1Ended}
              >
                Tu navegador no soporta el video.
              </video>
              {activeVideo === 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full pointer-events-none">
                  ▶ Reproduciendo
                </div>
              )}
            </div>

            {/* Video 2 */}
            <div className="relative flex-1">
              <video
                ref={video2Ref}
                src="/La-tribu-de-sentir.mp4"
                playsInline
                controls
                preload="metadata"
                className="w-full block"
                style={{ maxHeight: "85vh" }}
                onPlay={() => setActiveVideo(2)}
              >
                Tu navegador no soporta el video.
              </video>
              {activeVideo === 1 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded pointer-events-none">
                  <Play className="h-10 w-10 text-white/60" />
                </div>
              )}
              {activeVideo === 2 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full pointer-events-none">
                  ▶ Reproduciendo
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
