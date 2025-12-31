"use client"

import { useState, useEffect, useRef } from "react"

export function ChristmasBanner() {
  const [showVideo, setShowVideo] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video && showVideo) {
      // Configurar video para autoplay
      video.muted = false
      video.preload = "auto"
      
      // Intentar reproducir automáticamente
      const playVideo = async () => {
        try {
          await video.play()
        } catch (error) {
          console.error("Error al reproducir video automáticamente:", error)
          // Si falla, intentar con muted para autoplay
          try {
            video.muted = true
            await video.play()
            // Una vez que empiece a reproducir, activar el sonido
            video.muted = false
          } catch (error2) {
            console.error("Error al reproducir video con muted:", error2)
          }
        }
      }

      const handleEnded = () => {
        setShowVideo(false)
      }

      const handleError = (e: Event) => {
        console.error("Error en video:", e)
        setShowVideo(false)
      }

      const handleLoadedData = () => {
        playVideo()
      }

      const handleCanPlay = () => {
        playVideo()
      }

      video.addEventListener('ended', handleEnded)
      video.addEventListener('error', handleError)
      video.addEventListener('loadeddata', handleLoadedData)
      video.addEventListener('canplay', handleCanPlay)

      // Cargar el video
      video.load()

      // Intentar reproducir si el video ya está listo
      if (video.readyState >= 2) {
        playVideo()
      }

      return () => {
        video.removeEventListener('ended', handleEnded)
        video.removeEventListener('error', handleError)
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('canplay', handleCanPlay)
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
      {/* Botón X para cerrar */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white text-black rounded-full p-2 transition-colors shadow-lg"
        aria-label="Cerrar"
        style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Video centrado de 15cm x 15cm */}
      <div className="relative" style={{ width: '15cm', height: '15cm', maxWidth: '90vw', maxHeight: '90vh' }}>
        <video
          ref={videoRef}
          src="/Saludo-fin-de-año.mp4"
          className="w-full h-full object-contain"
          autoPlay
          playsInline
          preload="auto"
          controls={false}
          muted={false}
          onEnded={() => setShowVideo(false)}
          onError={(e) => {
            console.error("Error al cargar el video:", e)
            setShowVideo(false)
          }}
        >
          Tu navegador no soporta el elemento de video.
        </video>
      </div>
    </div>
  )
}
