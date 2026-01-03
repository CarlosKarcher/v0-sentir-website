"use client"

import { useState, useEffect, useRef } from "react"

export function ChristmasBanner() {
  const [showBanner, setShowBanner] = useState(true)
  const [showText, setShowText] = useState(true)
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!showBanner) return

    // Esperar a que el DOM esté listo
    const initVideo = () => {
      try {
        const video = videoRef.current
        if (!video) {
          console.log("⚠️ Video ref no disponible, reintentando...")
          // Reintentar después de un breve delay
          setTimeout(initVideo, 100)
          return
        }

        console.log("📹 Inicializando video:", video.src)

        // Función para reproducir video automáticamente SIN muted
        const playVideo = async () => {
          if (!video || !shouldPlayVideo) return
          
          try {
            console.log("▶️ Intentando reproducir video SIN muted...")
            // Intentar reproducir directamente sin muted
            video.muted = false
            video.volume = 1.0
            await video.play()
            console.log("✅ Video play() exitoso SIN muted")
            
          } catch (error) {
            console.log("⚠️ Error al reproducir sin muted, intentando con muted...", error)
            // Si falla sin muted, intentar con muted como respaldo
            try {
              video.muted = true
              await video.play()
              console.log("✅ Video play() exitoso con muted")
              
              // Activar audio inmediatamente después
              requestAnimationFrame(() => {
                if (video) {
                  video.muted = false
                  console.log("🔊 Audio activado (requestAnimationFrame)")
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

        // Múltiples eventos para intentar reproducir cuando esté listo (solo si shouldPlayVideo es true)
        const handleCanPlay = () => {
          console.log("🎬 Video puede reproducirse (canplay)")
          if (shouldPlayVideo) {
            playVideo()
          }
        }

        const handleCanPlayThrough = () => {
          console.log("🎬 Video puede reproducirse completamente (canplaythrough)")
          if (shouldPlayVideo) {
            playVideo()
          }
        }

        const handleLoadedData = () => {
          console.log("📥 Datos del video cargados (loadeddata)")
          if (shouldPlayVideo) {
            playVideo()
          }
        }

        const handleLoadedMetadata = () => {
          console.log("📋 Metadata del video cargado (loadedmetadata)")
          // No reproducir aquí, esperar a que se oculte el texto
        }

        const handlePlay = () => {
          console.log("▶️ Video empezó a reproducirse (play)")
          if (video) {
            video.muted = false
            video.volume = 1.0
          }
        }

        const handlePlaying = () => {
          console.log("▶️ Video reproduciéndose (playing)")
          if (video) {
            video.muted = false
            video.volume = 1.0
          }
        }

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

        video.addEventListener('canplay', handleCanPlay)
        video.addEventListener('canplaythrough', handleCanPlayThrough)
        video.addEventListener('loadeddata', handleLoadedData)
        video.addEventListener('loadedmetadata', handleLoadedMetadata)
        video.addEventListener('play', handlePlay)
        video.addEventListener('playing', handlePlaying)
        video.addEventListener('error', handleError)

        // Configurar video
        video.volume = 1.0
        video.preload = "auto"
        video.playsInline = true
        video.muted = false // Intentar sin muted desde el inicio

        // Cargar el video
        video.load()
        console.log("📥 Video.load() llamado")

        // Ocultar texto después de 3 segundos y activar reproducción del video
        const textTimer = setTimeout(() => {
          setShowText(false)
          setShouldPlayVideo(true)
          console.log("⏱️ 3 segundos transcurridos, iniciando reproducción del video...")
          
          // Intentar reproducir cuando el texto se oculte
          if (video.readyState >= 2) {
            console.log("✅ Video ya está listo, reproduciendo...")
            playVideo()
          }
        }, 3000) // 3 segundos

        // Reintentos adicionales después de que shouldPlayVideo sea true
        setTimeout(() => {
          if (video && video.paused && shouldPlayVideo) {
            console.log("🔄 Reintento 1 (3500ms)")
            playVideo()
          }
        }, 3500)

        setTimeout(() => {
          if (video && video.paused && shouldPlayVideo) {
            console.log("🔄 Reintento 2 (4000ms)")
            playVideo()
          }
        }, 4000)

        setTimeout(() => {
          if (video && video.paused && shouldPlayVideo) {
            console.log("🔄 Reintento 3 (5000ms)")
            playVideo()
          }
        }, 5000)

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
          clearTimeout(textTimer)
          if (video) {
            video.removeEventListener('canplay', handleCanPlay)
            video.removeEventListener('canplaythrough', handleCanPlayThrough)
            video.removeEventListener('loadeddata', handleLoadedData)
            video.removeEventListener('loadedmetadata', handleLoadedMetadata)
            video.removeEventListener('play', handlePlay)
            video.removeEventListener('playing', handlePlaying)
            video.removeEventListener('error', handleError)
            try {
              video.pause()
              video.currentTime = 0
            } catch (e) {
              console.error("Error al limpiar video:", e)
            }
          }
        }
      } catch (error) {
        console.error("❌ Error en useEffect del video:", error)
        // Si hay un error, ocultar el banner para no bloquear la aplicación
        setShowBanner(false)
      }
    }

    // Inicializar después de que el componente se monte
    const timeoutId = setTimeout(initVideo, 0)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [showBanner, shouldPlayVideo])

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
          />

          {/* Texto superpuesto - se oculta después de 5 segundos */}
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
