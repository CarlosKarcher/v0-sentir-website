"use client"

import * as React from "react"
import { X, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

const VIDEOS = ["/01-guerrero-15-02.mp4", "/02-Guerrero-15-02.mp4"]

export function PresentationVideos() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const currentSrc = VIDEOS[currentIndex]
  const isLastVideo = currentIndex === VIDEOS.length - 1

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    setIsOpen(false)
  }

  const handlePlay = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play()
        setIsPlaying(true)
        setIsLoading(false)
      } catch (err) {
        if ((err as Error).name !== "NotAllowedError") setHasError(true)
      }
    }
  }

  const handleEnded = () => {
    if (isLastVideo) {
      handleClose()
      return
    }
    setCurrentIndex((i) => i + 1)
    setIsPlaying(false)
    setIsLoading(true)
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
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
            flexDirection: "column",
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

          <div
            className="relative flex-1 flex items-center justify-center min-h-0 overflow-hidden"
            style={{ width: "100%", height: "100%" }}
          >
            {hasError ? (
              <div className="text-center p-8">
                <p className="text-lg font-semibold mb-2">Error al cargar el video</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Video {currentIndex + 1}: {currentSrc}
                </p>
              </div>
            ) : (
              <>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                    <div className="text-sm text-muted-foreground">
                      Cargando video {currentIndex + 1}...
                    </div>
                  </div>
                )}
                <video
                  ref={videoRef}
                  key={currentIndex}
                  src={currentSrc}
                  playsInline
                  preload="metadata"
                  controls={isPlaying}
                  muted={false}
                  className="rounded-lg shadow-lg w-full h-full"
                  style={{
                    objectFit: "contain",
                    display: "block",
                  }}
                  onEnded={handleEnded}
                  onError={() => {
                    setHasError(true)
                    setIsLoading(false)
                  }}
                  onCanPlay={() => setIsLoading(false)}
                  onPlaying={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  Tu navegador no soporta la reproducción de video.
                </video>
              </>
            )}
          </div>

          {!isPlaying && !hasError && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[10000] pointer-events-auto">
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
