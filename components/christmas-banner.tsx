"use client"

import { useState, useEffect, useRef } from "react"

export function ChristmasBanner() {
  const [showBanner, setShowBanner] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Reproducir video automáticamente cuando el componente se monte
  useEffect(() => {
    if (!showBanner) return

    // Esperar a que el DOM esté listo
    const initVideo = () => {
      const video = videoRef.current
      if (!video) {
        console.log("⚠️ Video ref no disponible, reintentando...")
        setTimeout(initVideo, 100)
        return
      }

      console.log("📹 Inicializando video:", video.src)

      // Configurar video
      video.volume = 1.0
      video.preload = "auto"
      video.playsInline = true
      video.muted = true // Empezar con muted para que el autoplay funcione

      // Cargar el video
      video.load()
      console.log("📥 Video.load() llamado")

      // Función para reproducir video (siempre empezar con muted)
      const tryPlay = async () => {
        if (!video) return

        try {
          console.log("▶️ Intentando reproducir video...")
          console.log("Estado del video:", {
            readyState: video.readyState,
            paused: video.paused,
            muted: video.muted,
            volume: video.volume,
            src: video.src,
            networkState: video.networkState
          })

          // Empezar con muted para que el autoplay funcione
          video.muted = true
          video.volume = 1.0
          await video.play()
          console.log("✅ Video reproduciéndose con muted")
          
          // Activar audio inmediatamente después de que empiece
          requestAnimationFrame(() => {
            if (video) {
              video.muted = false
              console.log("🔊 Audio activado (requestAnimationFrame)")
            }
          })
          
          // También usar setTimeout como respaldo
          setTimeout(() => {
            if (video) {
              video.muted = false
              video.volume = 1.0
              console.log("🔊 Audio activado (setTimeout)")
            }
          }, 100)
        } catch (error) {
          console.error("❌ Error al reproducir video:", error)
        }
      }

      // Intentar reproducir cuando el video esté listo
      const handleReady = () => {
        console.log("🎬 Video listo para reproducir")
        tryPlay()
      }

      video.addEventListener('canplay', handleReady, { once: true })
      video.addEventListener('canplaythrough', handleReady, { once: true })
      video.addEventListener('loadeddata', handleReady, { once: true })
      video.addEventListener('loadedmetadata', () => {
        console.log("📋 Metadata cargado")
        if (video.readyState >= 2) {
          tryPlay()
        }
      }, { once: true })

      // Intentar reproducir inmediatamente si ya está listo
      if (video.readyState >= 2) {
        tryPlay()
      }

      // Reintentos agresivos
      setTimeout(() => {
        if (video && video.paused) {
          console.log("🔄 Reintento 1 (500ms)")
          tryPlay()
        }
      }, 500)

      setTimeout(() => {
        if (video && video.paused) {
          console.log("🔄 Reintento 2 (1000ms)")
          tryPlay()
        }
      }, 1000)

      setTimeout(() => {
        if (video && video.paused) {
          console.log("🔄 Reintento 3 (2000ms)")
          tryPlay()
        }
      }, 2000)

      const handleError = (e: Event) => {
        console.error("❌ Error en video:", e)
        const videoTarget = e.currentTarget as HTMLVideoElement
        console.error("Detalles del error:", {
          error: videoTarget.error,
          errorCode: videoTarget.error?.code,
          errorMessage: videoTarget.error?.message,
          networkState: videoTarget.networkState,
          readyState: videoTarget.readyState,
          src: videoTarget.src,
          currentSrc: videoTarget.currentSrc
        })
      }

      const handlePlay = () => {
        console.log("▶️ Video empezó a reproducirse")
        if (video) {
          video.muted = false
          video.volume = 1.0
        }
      }

      const handlePlaying = () => {
        console.log("▶️ Video reproduciéndose")
        if (video) {
          video.muted = false
          video.volume = 1.0
        }
      }

      video.addEventListener('error', handleError)
      video.addEventListener('play', handlePlay)
      video.addEventListener('playing', handlePlaying)

      // Cerrar banner después de 20 segundos
      const timer = setTimeout(() => {
        if (video) {
          video.pause()
          video.currentTime = 0
        }
        setShowBanner(false)
      }, 20000)

      return () => {
        clearTimeout(timer)
        video.removeEventListener('error', handleError)
        video.removeEventListener('play', handlePlay)
        video.removeEventListener('playing', handlePlaying)
        video.removeEventListener('canplay', handleReady)
        video.removeEventListener('canplaythrough', handleReady)
        video.removeEventListener('loadeddata', handleReady)
        try {
          video.pause()
          video.currentTime = 0
        } catch (e) {
          console.error("Error al limpiar video:", e)
        }
      }
    }

    const timeoutId = setTimeout(initVideo, 0)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [showBanner])

  if (!showBanner) {
    return null
  }

  const handleClose = () => {
    try {
      const video = videoRef.current
      if (video) {
        video.pause()
        video.currentTime = 0
      }
    } catch (error) {
      console.error("Error al cerrar banner:", error)
    } finally {
      setShowBanner(false)
    }
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
        
        .banner-pulse {
          animation: pulseScale 2s ease-in-out infinite;
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

          {/* Video - object-contain para que se vea completo */}
          <video
            ref={videoRef}
            src="/video-campanas-vilma.mp4"
            className="absolute inset-0 w-full h-full bg-black"
            style={{ 
              objectFit: 'contain',
              zIndex: 1
            }}
            playsInline
            preload="auto"
            muted
            autoPlay
            loop={false}
            onError={(e) => {
              console.error("❌ Error al cargar el video:", e)
              const video = e.currentTarget as HTMLVideoElement
              console.error("Detalles:", {
                error: video.error,
                networkState: video.networkState,
                readyState: video.readyState,
                src: video.src,
                currentSrc: video.currentSrc
              })
            }}
            onPlay={() => {
              const video = videoRef.current
              if (video) {
                video.muted = false
                video.volume = 1.0
                console.log("▶️ Video en reproducción, audio activado")
              }
            }}
            onPlaying={() => {
              const video = videoRef.current
              if (video) {
                video.muted = false
                video.volume = 1.0
                console.log("▶️ Video playing, audio activado")
              }
            }}
            onLoadedData={() => {
              console.log("📥 Video loadeddata")
            }}
            onCanPlay={() => {
              console.log("🎬 Video canplay")
            }}
            onCanPlayThrough={() => {
              console.log("🎬 Video canplaythrough")
            }}
            onLoadedMetadata={() => {
              console.log("📋 Video loadedmetadata")
            }}
          />
        </div>
      </div>
    </>
  )
}
