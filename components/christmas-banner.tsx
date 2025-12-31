"use client"

import { useState, useEffect, useRef } from "react"

export function ChristmasBanner() {
  const [showVideo, setShowVideo] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video && showVideo) {
      const playVideo = async () => {
        try {
          // Intentar reproducir con muted primero (más compatible con autoplay)
          video.muted = true
          await video.play()
          // Después de que empiece, activar el sonido
          setTimeout(() => {
            video.muted = false
          }, 100)
        } catch (error) {
          console.error("Error al reproducir video:", error)
        }
      }

      const handleEnded = () => {
        setShowVideo(false)
      }

      const handleError = (e: Event) => {
        console.error("Error en video:", e)
      }

      const handleLoadedData = () => {
        playVideo()
      }

      const handleCanPlayThrough = () => {
        playVideo()
      }

      video.addEventListener('ended', handleEnded)
      video.addEventListener('error', handleError)
      video.addEventListener('loadeddata', handleLoadedData)
      video.addEventListener('canplaythrough', handleCanPlayThrough)

      // Cargar el video
      video.load()

      // Intentar reproducir si el video ya está listo
      if (video.readyState >= 3) {
        playVideo()
      }

      return () => {
        video.removeEventListener('ended', handleEnded)
        video.removeEventListener('error', handleError)
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('canplaythrough', handleCanPlayThrough)
      }
    }
  }, [showVideo])

  if (!showVideo) {
    return null
  }

  const handleClose = () => {
    const video = videoRef.current
    if (video) {
      video.pause()
      video.currentTime = 0
    }
    setShowVideo(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
      {/* Contenedor del video de 15cm x 15cm con botón X dentro */}
      <div className="relative bg-black rounded-lg overflow-hidden" style={{ width: '15cm', height: '15cm', maxWidth: '90vw', maxHeight: '90vh' }}>
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
          muted
          onLoadedData={() => {
            const video = videoRef.current
            if (video) {
              video.play().then(() => {
                video.muted = false
              }).catch(console.error)
            }
          }}
          onEnded={() => setShowVideo(false)}
          onError={(e) => {
            console.error("Error al cargar el video:", e)
          }}
        >
          Tu navegador no soporta el elemento de video.
        </video>
      </div>
    </div>
  )
}
