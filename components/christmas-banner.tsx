"use client"

import { useState, useEffect, useRef } from "react"

export function ChristmasBanner() {
  const [showVideo, setShowVideo] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !showVideo) return

    // Intentar reproducir cuando el video esté listo
    const tryPlay = async () => {
      try {
        if (!video) return
        video.muted = true // Necesario para autoplay en la mayoría de navegadores
        await video.play()
        // Activar sonido después de que empiece
        setTimeout(() => {
          if (video) {
            video.muted = false
          }
        }, 500)
      } catch (error) {
        console.error("Error al reproducir video automáticamente:", error)
      }
    }

    const handleCanPlay = () => {
      tryPlay()
    }

    const handleLoadedMetadata = () => {
      tryPlay()
    }

    const handleEnded = () => {
      setShowVideo(false)
    }

    const handleError = (e: Event) => {
      console.error("Error en video:", e)
    }

    try {
      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('loadedmetadata', handleLoadedMetadata)
      video.addEventListener('ended', handleEnded)
      video.addEventListener('error', handleError)

      // Intentar reproducir inmediatamente si el video ya está cargado
      if (video.readyState >= 2) {
        tryPlay()
      }
    } catch (error) {
      console.error("Error al configurar eventos del video:", error)
    }

    return () => {
      try {
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
        video.removeEventListener('ended', handleEnded)
        video.removeEventListener('error', handleError)
      } catch (error) {
        // Ignorar errores en cleanup
      }
    }
  }, [showVideo])

  if (!showVideo) {
    return null
  }

  const handleClose = () => {
    try {
      const video = videoRef.current
      if (video) {
        video.pause()
        video.currentTime = 0
      }
      setShowVideo(false)
    } catch (error) {
      console.error("Error al cerrar video:", error)
      setShowVideo(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
      {/* Contenedor del video de 15cm x 15cm con botón X dentro */}
      <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl" style={{ width: '15cm', height: '15cm', maxWidth: '90vw', maxHeight: '90vh' }}>
        {/* Botón X para cerrar - dentro del contenedor del video */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-20 bg-white/90 hover:bg-white text-black rounded-full p-2 transition-colors shadow-lg"
          aria-label="Cerrar"
          style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video */}
        <video
          ref={videoRef}
          src="/Saludo-fin-de-año.mp4"
          className="w-full h-full object-contain"
          autoPlay
          playsInline
          preload="auto"
          muted={true}
          controls={false}
          onEnded={() => {
            try {
              setShowVideo(false)
            } catch (error) {
              console.error("Error al finalizar video:", error)
            }
          }}
          onError={(e) => {
            console.error("Error al cargar el video:", e)
            try {
              const video = e.currentTarget as HTMLVideoElement
              console.error("Video error details:", {
                error: video.error,
                networkState: video.networkState,
                readyState: video.readyState,
                src: video.src
              })
            } catch (error) {
              console.error("Error al obtener detalles del error:", error)
            }
          }}
          onPlaying={() => {
            try {
              const video = videoRef.current
              if (video) {
                video.muted = false
              }
            } catch (error) {
              console.error("Error al activar sonido:", error)
            }
          }}
        >
          Tu navegador no soporta el elemento de video.
        </video>
      </div>
    </div>
  )
}
