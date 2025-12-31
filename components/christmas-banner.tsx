"use client"

import { useState, useEffect, useRef } from "react"

export function ChristmasBanner() {
  const [showVideo, setShowVideo] = useState(true)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (hasError) return

    try {
      const video = videoRef.current
      if (!video || !showVideo) return

      // Función para activar el audio de forma segura
      const enableAudio = () => {
        try {
          if (video && !video.muted) return // Ya está activado
          if (video) {
            video.muted = false
          }
        } catch (error) {
          console.error("Error al activar audio:", error)
        }
      }

      // Intentar reproducir cuando el video esté listo
      const tryPlay = async () => {
        try {
          if (!video) return
          
          // Asegurar que está muted para autoplay
          if (!video.muted) {
            video.muted = true
          }
          
          // Reproducir
          await video.play()
          
          // Activar audio después de que empiece (más rápido)
          setTimeout(() => {
            enableAudio()
          }, 200)
        } catch (error) {
          console.error("Error al reproducir video:", error)
        }
      }

      const handleCanPlay = () => {
        tryPlay()
      }

      const handleLoadedMetadata = () => {
        tryPlay()
      }

      const handleLoadedData = () => {
        tryPlay()
      }

      const handlePlay = () => {
        // Cuando el video empiece a reproducirse, activar audio
        enableAudio()
      }

      const handlePlaying = () => {
        // Asegurar que el audio esté activo mientras se reproduce
        enableAudio()
      }

      const handlePause = () => {
        // Si se pausa, intentar reproducir de nuevo
        try {
          if (video && !video.ended) {
            video.play().catch(console.error)
          }
        } catch (error) {
          console.error("Error al reanudar video:", error)
        }
      }

      const handleWaiting = () => {
        // Si el video está esperando (buffering), asegurar que siga reproduciendo
        console.log("Video esperando datos (buffering)...")
      }

      const handleStalled = () => {
        // Si el video se estanca, intentar continuar
        console.log("Video estancado, intentando continuar...")
        try {
          if (video && !video.ended) {
            video.play().catch(console.error)
          }
        } catch (error) {
          console.error("Error al continuar video estancado:", error)
        }
      }

      const handleEnded = () => {
        setShowVideo(false)
      }

      const handleError = (e: Event) => {
        console.error("Error en video:", e)
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
        setHasError(true)
        setShowVideo(false)
      }

      // Agregar todos los listeners
      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('loadedmetadata', handleLoadedMetadata)
      video.addEventListener('loadeddata', handleLoadedData)
      video.addEventListener('play', handlePlay)
      video.addEventListener('playing', handlePlaying)
      video.addEventListener('pause', handlePause)
      video.addEventListener('waiting', handleWaiting)
      video.addEventListener('stalled', handleStalled)
      video.addEventListener('ended', handleEnded)
      video.addEventListener('error', handleError)

      // Cargar el video explícitamente
      video.load()

      // Intentar reproducir si el video ya está listo
      if (video.readyState >= 2) {
        tryPlay()
      }

      return () => {
        try {
          video.removeEventListener('canplay', handleCanPlay)
          video.removeEventListener('loadedmetadata', handleLoadedMetadata)
          video.removeEventListener('loadeddata', handleLoadedData)
          video.removeEventListener('play', handlePlay)
          video.removeEventListener('playing', handlePlaying)
          video.removeEventListener('pause', handlePause)
          video.removeEventListener('waiting', handleWaiting)
          video.removeEventListener('stalled', handleStalled)
          video.removeEventListener('ended', handleEnded)
          video.removeEventListener('error', handleError)
        } catch (error) {
          // Ignorar errores en cleanup
        }
      }
    } catch (error) {
      console.error("Error en useEffect del video:", error)
      setHasError(true)
      setShowVideo(false)
    }
  }, [showVideo, hasError])

  if (!showVideo || hasError) {
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
      setHasError(true)
    }
  }

  try {
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

          {/* Video - sin controls, reproducción automática */}
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
                setHasError(true)
              }
            }}
            onError={(e) => {
              console.error("Error al cargar el video:", e)
              setHasError(true)
              setShowVideo(false)
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
            onPlay={() => {
              try {
                const video = videoRef.current
                if (video) {
                  // Activar audio cuando empiece a reproducirse
                  video.muted = false
                }
              } catch (error) {
                console.error("Error al activar sonido:", error)
              }
            }}
            onPlaying={() => {
              try {
                const video = videoRef.current
                if (video) {
                  // Asegurar que el audio esté activo
                  video.muted = false
                }
              } catch (error) {
                console.error("Error al mantener audio activo:", error)
              }
            }}
          >
            Tu navegador no soporta el elemento de video.
          </video>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error al renderizar ChristmasBanner:", error)
    return null
  }
}
