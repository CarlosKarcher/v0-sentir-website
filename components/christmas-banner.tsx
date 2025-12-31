"use client"

import { useState, useEffect, useRef } from "react"

export function ChristmasBanner() {
  const [showVideo, setShowVideo] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video && showVideo) {
      // Intentar reproducir automáticamente
      const playVideo = async () => {
        try {
          video.muted = false // Permitir sonido
          await video.play()
        } catch (error) {
          console.error("Error al reproducir video automáticamente:", error)
          // Si falla el autoplay, al menos cargar el video
          video.load()
        }
      }

      const handleEnded = () => {
        setShowVideo(false)
      }

      const handleError = (e: Event) => {
        console.error("Error en video:", e)
        setShowVideo(false)
      }

      const handleCanPlay = () => {
        playVideo()
      }

      video.addEventListener('ended', handleEnded)
      video.addEventListener('error', handleError)
      video.addEventListener('canplay', handleCanPlay)

      // Intentar reproducir si el video ya está listo
      if (video.readyState >= 3) {
        playVideo()
      }

      return () => {
        video.removeEventListener('ended', handleEnded)
        video.removeEventListener('error', handleError)
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
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

      {/* Video */}
      <video
        ref={videoRef}
        src="/Saludo-fin-de-año.mp4"
        className="w-full h-full object-contain"
        autoPlay
        playsInline
        preload="auto"
        controls={false}
        onEnded={() => setShowVideo(false)}
        onError={(e) => {
          console.error("Error al cargar el video:", e)
          setShowVideo(false)
        }}
      >
        Tu navegador no soporta el elemento de video.
      </video>
    </div>
  )
}
