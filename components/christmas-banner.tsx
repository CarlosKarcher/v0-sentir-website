"use client"

import { useState, useEffect, useRef } from "react"

export function ChristmasBanner() {
  const [showBanner, setShowBanner] = useState(true)
  const [showText, setShowText] = useState(true)
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Ocultar texto después de 3 segundos
  useEffect(() => {
    if (!showBanner) return

    const textTimer = setTimeout(() => {
      setShowText(false)
      setShouldPlayVideo(true)
      console.log("⏱️ 3 segundos transcurridos, activando reproducción del video...")
    }, 3000)

    return () => {
      clearTimeout(textTimer)
    }
  }, [showBanner])

  // Reproducir video cuando shouldPlayVideo sea true
  useEffect(() => {
    if (!shouldPlayVideo || !showBanner) return

    const video = videoRef.current
    if (!video) {
      console.log("⚠️ Video ref no disponible")
      return
    }

    console.log("▶️ Intentando reproducir video...")
    console.log("Video estado:", {
      readyState: video.readyState,
      paused: video.paused,
      muted: video.muted,
      volume: video.volume,
      src: video.src
    })

    // Función para reproducir video
    const playVideo = async () => {
      if (!video) return

      try {
        // Intentar reproducir sin muted primero
        video.muted = false
        video.volume = 1.0
        await video.play()
        console.log("✅ Video reproduciéndose SIN muted")
      } catch (error1) {
        console.log("⚠️ Error sin muted, intentando con muted...", error1)
        try {
          // Si falla, intentar con muted
          video.muted = true
          await video.play()
          console.log("✅ Video reproduciéndose con muted")
          
          // Activar audio inmediatamente
          requestAnimationFrame(() => {
            if (video) {
              video.muted = false
              video.volume = 1.0
              console.log("🔊 Audio activado")
            }
          })
          
          setTimeout(() => {
            if (video) {
              video.muted = false
              video.volume = 1.0
              console.log("🔊 Audio activado (setTimeout)")
            }
          }, 100)
        } catch (error2) {
          console.error("❌ Error al reproducir video:", error2)
        }
      }
    }

    // Intentar reproducir inmediatamente
    if (video.readyState >= 2) {
      playVideo()
    } else {
      // Si no está listo, esperar a que esté listo
      const handleCanPlay = () => {
        console.log("🎬 Video puede reproducirse")
        playVideo()
      }

      const handleCanPlayThrough = () => {
        console.log("🎬 Video puede reproducirse completamente")
        playVideo()
      }

      const handleLoadedData = () => {
        console.log("📥 Datos del video cargados")
        playVideo()
      }

      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('canplaythrough', handleCanPlayThrough)
      video.addEventListener('loadeddata', handleLoadedData)

      // También intentar después de un delay
      setTimeout(() => {
        if (video && video.paused) {
          console.log("🔄 Reintento después de delay")
          playVideo()
        }
      }, 500)

      return () => {
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('canplaythrough', handleCanPlayThrough)
        video.removeEventListener('loadeddata', handleLoadedData)
      }
    }
  }, [shouldPlayVideo, showBanner])

  // Inicializar video cuando el componente se monte
  useEffect(() => {
    if (!showBanner) return

    const video = videoRef.current
    if (!video) {
      console.log("⚠️ Video ref no disponible en inicialización")
      return
    }

    console.log("📹 Inicializando video:", video.src)

    // Configurar video
    video.volume = 1.0
    video.preload = "auto"
    video.playsInline = true
    video.muted = false

    // Cargar el video
    video.load()
    console.log("📥 Video.load() llamado")

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
      try {
        video.pause()
        video.currentTime = 0
      } catch (e) {
        console.error("Error al limpiar video:", e)
      }
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
            className="absolute inset-0 w-full h-full bg-black"
            style={{ 
              objectFit: 'contain',
              zIndex: 1
            }}
            playsInline
            preload="auto"
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
          />

          {/* Texto superpuesto - se oculta después de 3 segundos */}
          {showText && (
            <div 
              className="absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-500"
              style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                zIndex: 2
              }}
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
          )}
        </div>
      </div>
    </>
  )
}
