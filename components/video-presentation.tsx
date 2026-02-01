"use client"

import * as React from "react"
import { X, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VideoPresentation() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Error al reproducir el video:", error)
        setHasError(true)
      })
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
      const handleError = () => {
        console.error("Error al cargar el video")
        setHasError(true)
      }
      const handleLoadedData = () => {
        console.log("Video cargado correctamente")
        setHasError(false)
      }
      
      video.addEventListener('play', handlePlayEvent)
      video.addEventListener('pause', handlePauseEvent)
      video.addEventListener('error', handleError)
      video.addEventListener('loadeddata', handleLoadedData)
      
      return () => {
        video.removeEventListener('play', handlePlayEvent)
        video.removeEventListener('pause', handlePauseEvent)
        video.removeEventListener('error', handleError)
        video.removeEventListener('loadeddata', handleLoadedData)
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
          className="relative bg-background rounded-lg shadow-2xl pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
          style={{ 
            width: "min(10cm, 90vw)", 
            height: "min(14cm, 90vh)", 
            maxWidth: "90vw", 
            maxHeight: "90vh",
            padding: "0.5rem",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* Botón de cerrar */}
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
          
          {/* Video */}
          <div className="relative flex-1 flex items-center justify-center min-h-0 overflow-hidden" style={{ width: "100%", height: "100%" }}>
            {hasError ? (
              <div className="text-center p-8">
                <p className="text-lg font-semibold mb-2">Error al cargar el video</p>
                <p className="text-sm text-muted-foreground">Ruta: /camino-del-guerrero-Febrero-2026.mp4</p>
              </div>
            ) : (
              <video
                ref={videoRef}
                src="/camino-del-guerrero-Febrero-2026.mp4"
                loop
                playsInline
                preload="metadata"
                controls={isPlaying}
                className="rounded-lg shadow-lg w-full h-full"
                style={{ 
                  objectFit: "contain",
                  display: "block",
                  WebkitPlaysinline: true
                }}
                {...({
                  'webkit-playsinline': true,
                  'x5-playsinline': true
                } as any)}
                onError={(e) => {
                  console.error("Error en el elemento video:", e)
                  setHasError(true)
                }}
                onLoadedData={() => {
                  console.log("Video cargado correctamente")
                  setHasError(false)
                }}
                onCanPlay={() => {
                  console.log("Video listo para reproducir")
                }}
              >
                Tu navegador no soporta la reproducción de video.
              </video>
            )}
          </div>
          
          {/* Botón de play en la parte inferior */}
          {!isPlaying && !hasError && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[10000] pointer-events-auto touch-manipulation">
              <Button
                size="lg"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handlePlay()
                }}
                onTouchStart={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handlePlay()
                }}
                className="rounded-full shadow-lg px-6 py-6 text-white font-semibold touch-manipulation"
                style={{ 
                  backgroundColor: "#FFB84D",
                  borderColor: "#FFB84D",
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFA500"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFB84D"
                }}
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

