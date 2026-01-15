"use client"

import * as React from "react"
import { X, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VideoPresentation() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    setIsOpen(false)
  }

  React.useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current
      const handlePlayEvent = () => setIsPlaying(true)
      const handlePauseEvent = () => setIsPlaying(false)
      
      video.addEventListener('play', handlePlayEvent)
      video.addEventListener('pause', handlePauseEvent)
      
      return () => {
        video.removeEventListener('play', handlePlayEvent)
        video.removeEventListener('pause', handlePauseEvent)
      }
    }
  }, [])

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
          className="relative bg-background rounded-lg shadow-2xl pointer-events-auto flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
          style={{ 
            width: "15cm", 
            height: "20cm", 
            maxWidth: "90vw", 
            maxHeight: "90vh",
            padding: "0.5rem"
          }}
        >
          {/* Botón de cerrar */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 z-[10000] rounded-full hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
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
          
          {/* Video */}
          <div className="relative w-full flex-1 flex items-center justify-center">
            <video
              ref={videoRef}
              src="/Auto-enero-26-todo-listo.mp4"
              loop
              playsInline
              className="rounded-lg shadow-lg w-full h-full object-contain"
              style={{ width: "100%", height: "100%" }}
            >
              Tu navegador no soporta la reproducción de video.
            </video>
          </div>
          
          {/* Botón de play en la parte inferior */}
          {!isPlaying && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[10000]">
              <Button
                size="lg"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handlePlay()
                }}
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-6 py-6"
                aria-label="Reproducir video"
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

