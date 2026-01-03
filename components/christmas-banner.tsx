"use client"

import { useState, useEffect, useRef } from "react"

export function ChristmasBanner() {
  const [showBanner, setShowBanner] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!showBanner) return

    const video = videoRef.current
    if (!video) return

    // Función para reproducir video automáticamente
    const playVideo = async () => {
      if (!video) return
      
      try {
        // Estrategia: empezar con muted para que el autoplay funcione (política de navegadores)
        video.muted = true
        video.volume = 1.0
        await video.play()
        
        // Activar audio inmediatamente después de que empiece
        requestAnimationFrame(() => {
          if (video) {
            video.muted = false
          }
        })
        
        // También usar setTimeout como respaldo
        setTimeout(() => {
          if (video) {
            video.muted = false
            video.volume = 1.0
          }
        }, 50)
        
        console.log("✅ Video reproduciéndose automáticamente")
      } catch (error) {
        console.error("❌ Error al reproducir video:", error)
      }
    }

    // Múltiples eventos para intentar reproducir cuando esté listo
    const handleCanPlay = () => {
      playVideo()
    }

    const handleCanPlayThrough = () => {
      playVideo()
    }

    const handleLoadedData = () => {
      playVideo()
    }

    const handleLoadedMetadata = () => {
      playVideo()
    }

    const handlePlay = () => {
      if (video) {
        video.muted = false
        video.volume = 1.0
      }
    }

    const handlePlaying = () => {
      if (video) {
        video.muted = false
        video.volume = 1.0
      }
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('canplaythrough', handleCanPlayThrough)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('play', handlePlay)
    video.addEventListener('playing', handlePlaying)

    // Configurar video
    video.volume = 1.0
    video.preload = "auto"
    video.playsInline = true

    // Cargar el video
    video.load()

    // Intentar reproducir inmediatamente si está listo
    if (video.readyState >= 2) {
      playVideo()
    }

    // Reintentos adicionales
    setTimeout(() => {
      if (video && video.paused) {
        playVideo()
      }
    }, 300)

    setTimeout(() => {
      if (video && video.paused) {
        playVideo()
      }
    }, 1000)

    // Después de 20 segundos, cerrar todo el banner y detener video
    const timer = setTimeout(() => {
      if (video) {
        video.pause()
        video.currentTime = 0
      }
      setShowBanner(false)
    }, 20000) // 20 segundos

    return () => {
      clearTimeout(timer)
      if (video) {
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('canplaythrough', handleCanPlayThrough)
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
        video.removeEventListener('play', handlePlay)
        video.removeEventListener('playing', handlePlaying)
        video.pause()
        video.currentTime = 0
      }
    }
  }, [showBanner])

  if (!showBanner) {
    return null
  }

  const handleClose = () => {
    const video = videoRef.current
    if (video) {
      video.pause()
      video.currentTime = 0
    }
    setShowBanner(false)
  }

  return (
    <>
      <style jsx global>{`
        @keyframes pulseScale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
        }
        
        @keyframes textScale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }
        
        .banner-pulse {
          animation: pulseScale 2s ease-in-out infinite;
        }
        
        .text-pulse {
          animation: textScale 2s ease-in-out infinite;
        }
      `}</style>
      
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
        {/* Contenedor del cartel de 25cm alto x 12cm ancho con animación */}
        <div 
          className="relative bg-black rounded-lg overflow-hidden shadow-2xl banner-pulse"
          style={{ 
            width: '12cm', 
            height: '25cm', 
            maxWidth: '90vw', 
            maxHeight: '90vh'
          }}
        >
          {/* Botón X para cerrar - dentro del contenedor */}
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

          {/* Video de fondo - object-contain para que se vea completo */}
          <video
            ref={videoRef}
            src="/video-campanas-vilma.mp4"
            className="absolute inset-0 w-full h-full object-contain bg-black"
            style={{ objectFit: 'contain' }}
            playsInline
            preload="auto"
            autoPlay
            loop={false}
            onError={(e) => {
              console.error("❌ Error al cargar el video:", e)
              const video = e.currentTarget as HTMLVideoElement
              console.error("Detalles:", {
                error: video.error,
                networkState: video.networkState,
                readyState: video.readyState,
                src: video.src
              })
            }}
            onPlay={() => {
              const video = videoRef.current
              if (video) {
                video.muted = false
                video.volume = 1.0
              }
            }}
            onPlaying={() => {
              const video = videoRef.current
              if (video) {
                video.muted = false
                video.volume = 1.0
              }
            }}
          />

          {/* Texto superpuesto - visible durante toda la presentación */}
          <div 
            className="absolute inset-0 flex items-center justify-center z-10 bg-black/40"
          >
            <h2 
              className="text-white font-bold text-center px-4 text-pulse"
              style={{
                fontSize: 'clamp(1.2rem, 3vw, 2.5rem)',
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.6)'
              }}
            >
              próximo gran Evento En Sentir...
            </h2>
          </div>
        </div>
      </div>

    </>
  )
}
