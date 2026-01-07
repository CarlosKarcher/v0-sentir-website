"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VideoPresentation() {
  const [isOpen, setIsOpen] = React.useState(true)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    // Intentar reproducir el video cuando se abre el modal
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Si falla el autoplay, el usuario puede hacer clic en play
      })
    }
  }, [isOpen])

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay que bloquea toda la página */}
      <div 
        className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      {/* Modal con el video */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
        <div 
          className="relative bg-background rounded-lg shadow-2xl p-6 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 rounded-full hover:bg-destructive hover:text-destructive-foreground"
            onClick={handleClose}
            aria-label="Cerrar presentación"
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="flex justify-center">
            <video
              ref={videoRef}
              src="/Tandil-2026.mp4"
              controls
              loop
              playsInline
              className="rounded-lg shadow-lg"
              style={{ width: "20cm", height: "20cm", maxWidth: "90vw", maxHeight: "90vh" }}
            >
              Tu navegador no soporta la reproducción de video.
            </video>
          </div>
        </div>
      </div>
    </>
  )
}

