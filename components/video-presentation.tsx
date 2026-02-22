"use client"

import * as React from "react"
import { X, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

const VIDEO_SOURCES = [
  "/Cual%20es%20tu%20mejor%20Terapia..mp4",
  "/circulo-auto-general.mp4",
]

export function VideoPresentation() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [retryCount, setRetryCount] = React.useState(0)
  const [currentVideoIndex, setCurrentVideoIndex] = React.useState(0)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [isMobile, setIsMobile] = React.useState(false)

  // Detectar si es dispositivo móvil
  React.useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
      const isSmallScreen = window.innerWidth <= 768
      setIsMobile(isMobileDevice || isSmallScreen)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handlePlay = async () => {
    if (videoRef.current) {
      try {
        // Si estamos en el 2º video, reiniciar desde el 1º
        if (currentVideoIndex === 1) {
          setCurrentVideoIndex(0)
          videoRef.current.src = VIDEO_SOURCES[0]
          videoRef.current.load()
        }
        if (isMobile && videoRef.current.readyState < 2) {
          await videoRef.current.load()
        }
        const playPromise = videoRef.current.play()
        if (playPromise !== undefined) {
          await playPromise
          setIsPlaying(true)
        }
      } catch (error: any) {
        console.error("Error al reproducir el video:", error)
        if (error.name !== 'NotAllowedError') {
          setHasError(true)
        }
      }
    }
  }

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    setCurrentVideoIndex(0)
    setIsOpen(false)
  }

  const handleRetry = () => {
    if (videoRef.current && retryCount < 3) {
      setHasError(false)
      setIsLoading(true)
      setRetryCount(prev => prev + 1)
      videoRef.current.load()
    }
  }

  React.useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current
      
      const handlePlayEvent = () => {
        setIsPlaying(true)
        setIsLoading(false)
      }
      
      const handlePauseEvent = () => {
        setIsPlaying(false)
      }
      
      const handleError = (e: Event) => {
        const videoElement = e.target as HTMLVideoElement
        const error = videoElement.error
        
        if (error) {
          let errorMessage = "Error desconocido"
          switch (error.code) {
            case error.MEDIA_ERR_ABORTED:
              errorMessage = "La reproducción fue abortada"
              break
            case error.MEDIA_ERR_NETWORK:
              errorMessage = "Error de red al cargar el video"
              break
            case error.MEDIA_ERR_DECODE:
              errorMessage = "Error al decodificar el video"
              break
            case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage = "Formato de video no soportado"
              break
          }
          console.error("Error al cargar el video:", errorMessage, error)
        } else {
          console.error("Error al cargar el video (sin detalles)")
        }
        
        setHasError(true)
        setIsLoading(false)
      }
      
      const handleLoadedData = () => {
        console.log("Video cargado correctamente")
        setHasError(false)
        setIsLoading(false)
      }
      
      const handleCanPlay = () => {
        console.log("Video listo para reproducir")
        setIsLoading(false)
      }
      
      const handleLoadStart = () => {
        console.log("Iniciando carga del video")
        setIsLoading(true)
      }
      
      const handleWaiting = () => {
        console.log("Video esperando datos")
        setIsLoading(true)
      }
      
      const handlePlaying = () => {
        console.log("Video reproduciéndose")
        setIsLoading(false)
      }
      
      video.addEventListener('play', handlePlayEvent)
      video.addEventListener('pause', handlePauseEvent)
      video.addEventListener('error', handleError)
      video.addEventListener('loadeddata', handleLoadedData)
      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('loadstart', handleLoadStart)
      video.addEventListener('waiting', handleWaiting)
      video.addEventListener('playing', handlePlaying)
      
      return () => {
        video.removeEventListener('play', handlePlayEvent)
        video.removeEventListener('pause', handlePauseEvent)
        video.removeEventListener('error', handleError)
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('loadstart', handleLoadStart)
        video.removeEventListener('waiting', handleWaiting)
        video.removeEventListener('playing', handlePlaying)
      }
    }
  }, [retryCount])

  // Precargar el video cuando el componente se monta
  React.useEffect(() => {
    if (videoRef.current && !isMobile) {
      videoRef.current.load()
    }
  }, [isMobile])

  // Al pasar al 2º video, cargar y reproducir
  React.useEffect(() => {
    if (currentVideoIndex === 1 && videoRef.current) {
      videoRef.current.load()
      videoRef.current.play().catch(() => {})
    }
  }, [currentVideoIndex])

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
                <p className="text-sm text-muted-foreground mb-4">Ruta: {VIDEO_SOURCES[currentVideoIndex]}</p>
                {retryCount < 3 && (
                  <Button
                    onClick={handleRetry}
                    className="mt-2"
                    variant="outline"
                  >
                    Reintentar ({retryCount}/3)
                  </Button>
                )}
              </div>
            ) : (
              <>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                    <div className="text-sm text-muted-foreground">Cargando video...</div>
                  </div>
                )}
                <video
                  key={currentVideoIndex}
                  ref={videoRef}
                  src={VIDEO_SOURCES[currentVideoIndex]}
                  playsInline
                  preload={isMobile ? "none" : "metadata"}
                  controls={isPlaying}
                  muted={false}
                  className="rounded-lg shadow-lg w-full h-full"
                  style={{ 
                    objectFit: "contain",
                    display: "block",
                    WebkitPlaysinline: true,
                    playsInline: true
                  }}
                  {...({
                    'webkit-playsinline': 'true',
                    'x5-playsinline': 'true',
                    'x5-video-player-type': 'h5',
                    'x5-video-player-fullscreen': 'true',
                    'x5-video-orientation': 'portraint'
                  } as any)}
                  onError={(e) => {
                    const videoElement = e.currentTarget
                    const error = videoElement.error
                    console.error("Error en el elemento video:", error)
                    if (error) {
                      console.error("Código de error:", error.code)
                      console.error("Mensaje:", error.message)
                    }
                    setHasError(true)
                    setIsLoading(false)
                  }}
                  onLoadedData={() => {
                    console.log("Video cargado correctamente")
                    setHasError(false)
                    setIsLoading(false)
                  }}
                  onCanPlay={() => {
                    console.log("Video listo para reproducir")
                    setIsLoading(false)
                  }}
                  onLoadStart={() => {
                    console.log("Iniciando carga del video")
                    setIsLoading(true)
                  }}
                  onWaiting={() => {
                    console.log("Video esperando datos")
                    setIsLoading(true)
                  }}
                  onPlaying={() => {
                    console.log("Video reproduciéndose")
                    setIsLoading(false)
                  }}
                  onEnded={() => {
                    if (currentVideoIndex < VIDEO_SOURCES.length - 1) {
                      setIsLoading(true)
                      setCurrentVideoIndex((i) => i + 1)
                    } else {
                      setIsPlaying(false)
                    }
                  }}
                >
                  Tu navegador no soporta la reproducción de video.
                </video>
              </>
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
                className="rounded-full shadow-lg px-6 py-6 text-white font-semibold touch-manipulation active:scale-95 transition-transform"
                style={{ 
                  backgroundColor: "#FFB84D",
                  borderColor: "#FFB84D",
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                  userSelect: "none"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFA500"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFB84D"
                }}
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
