"use client"

import { useState, useEffect, useRef } from "react"

export function ChristmasBanner() {
  const [showBanner, setShowBanner] = useState(true)
  const [showVideo, setShowVideo] = useState(false)
  const [isBlinking, setIsBlinking] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Parpadeo del cartel
    const blinkInterval = setInterval(() => {
      setIsBlinking((prev) => !prev)
    }, 500) // Cambia cada 500ms (medio segundo)

    // Después de 5 segundos, ocultar el cartel (solo si no se ha presionado el botón)
    const timer = setTimeout(() => {
      if (!showVideo) {
        setShowBanner(false)
      }
      clearInterval(blinkInterval)
    }, 5000) // 5 segundos

    return () => {
      clearTimeout(timer)
      clearInterval(blinkInterval)
    }
  }, [showVideo])


  const handleWatchVideo = async () => {
    setShowBanner(false)
    setShowVideo(true)
  }

  useEffect(() => {
    if (showVideo && videoRef.current) {
      const video = videoRef.current
      
      // Configurar el video cuando se muestre
      const setupVideo = () => {
        if (video) {
          // Establecer la fuente del video
          video.src = "/cierre_myl_2025.mp4"
          video.load()
          
          // Intentar reproducir cuando esté listo
          const tryPlay = () => {
            if (video.readyState >= 3) {
              video.play().then(() => {
                console.log("Video reproduciéndose")
                // Intentar pantalla completa después de un momento
                setTimeout(async () => {
                  try {
                    if (video.requestFullscreen) {
                      await video.requestFullscreen()
                    } else if ((video as any).webkitRequestFullscreen) {
                      await (video as any).webkitRequestFullscreen()
                    } else if ((video as any).mozRequestFullScreen) {
                      await (video as any).mozRequestFullScreen()
                    } else if ((video as any).msRequestFullscreen) {
                      await (video as any).msRequestFullscreen()
                    }
                  } catch (err) {
                    console.log("Pantalla completa requiere interacción:", err)
                  }
                }, 1000)
              }).catch((err) => {
                console.error("Error al reproducir:", err)
              })
            } else {
              setTimeout(tryPlay, 100)
            }
          }
          
          video.addEventListener('canplay', tryPlay, { once: true })
          video.addEventListener('loadeddata', tryPlay, { once: true })
        }
      }
      
      setTimeout(setupVideo, 100)
    }
  }, [showVideo])

  if (!showBanner && !showVideo) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      {showBanner && (
        <div className="relative flex items-center justify-center bg-gradient-to-b from-red-900 via-green-900 to-red-900 rounded-lg shadow-2xl overflow-hidden" style={{ width: '20cm', height: '20cm', maxWidth: '90vw', maxHeight: '90vh' }}>
          {/* Decoraciones navideñas - Estrellas */}
          <div className="absolute inset-0 overflow-hidden" style={{ width: '100%', height: '100%' }}>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`,
                }}
              >
                <svg
                  className="w-4 h-4 text-yellow-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            ))}
          </div>

          {/* Copos de nieve */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute text-white/60 animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l1.5 1.5L15 2l1.5 1.5L18 2v3l1.5 1.5L21 6v3l-1.5 1.5L18 12v3l-1.5 1.5L15 18h-3l-1.5-1.5L9 18H6l-1.5-1.5L3 15v-3l-1.5-1.5L0 9V6l1.5-1.5L3 5V2l1.5 1.5L6 2l1.5 1.5L9 2v3l1.5 1.5L12 6V2z" />
                </svg>
              </div>
            ))}
          </div>

          {/* Texto principal */}
          <div className="text-center px-4 z-10 relative">
            <div
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold transition-opacity duration-300 ${
                isBlinking ? "opacity-100" : "opacity-70"
              }`}
              style={{
                color: "#FFD700",
                textShadow: "0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.4), 2px 2px 4px rgba(0, 0, 0, 0.8)",
              }}
            >
              y Así cerramos este Maravilloso año 2025....<br />
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Gracias a Todos.!!!</span>
            </div>
            
            {/* Botón Ver Video */}
            <button
              onClick={handleWatchVideo}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white font-bold text-xl sm:text-2xl rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                boxShadow: "0 4px 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3)",
              }}
            >
              Ver Video
            </button>
          </div>
        </div>
      )}

      {showVideo && (
        <div className="w-full h-full bg-black">
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
            aria-label="Cerrar video"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <video
            ref={videoRef}
            autoPlay
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-contain"
            onEnded={() => setShowVideo(false)}
            onError={(e) => {
              const video = e.currentTarget
              console.error("Error al cargar video:", {
                code: video.error?.code,
                message: video.error?.message,
                src: video.src,
                currentSrc: video.currentSrc,
                networkState: video.networkState,
                readyState: video.readyState
              })
            }}
            onLoadedMetadata={() => {
              console.log("Metadata del video cargado")
            }}
            onCanPlay={() => {
              console.log("Video puede reproducirse")
            }}
            onPlaying={() => {
              console.log("Video está reproduciéndose")
            }}
          >
            <source src="/cierre_myl_2025.mp4" type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
        </div>
      )}
    </div>
  )
}

