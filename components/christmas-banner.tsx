"use client"

import { useState, useEffect, useRef } from "react"

export function ChristmasBanner() {
  const [showBanner, setShowBanner] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Reproducir audio automáticamente cuando se muestre el banner
    const audio = audioRef.current
    if (audio && showBanner) {
      const playAudio = async () => {
        try {
          // Intentar reproducir con muted primero para autoplay
          audio.muted = true
          await audio.play()
          // Activar audio inmediatamente
          audio.muted = false
        } catch (error) {
          console.error("Error al reproducir audio:", error)
          // Si falla, intentar sin muted
          try {
            audio.muted = false
            await audio.play()
          } catch (error2) {
            console.error("Error al reproducir audio sin muted:", error2)
          }
        }
      }
      playAudio()
    }

    // Después de 20 segundos, cerrar todo el banner (texto + flyer) y detener audio
    const timer = setTimeout(() => {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
      setShowBanner(false)
    }, 20000) // 20 segundos

    return () => {
      clearTimeout(timer)
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [showBanner])

  if (!showBanner) {
    return null
  }

  const handleClose = () => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
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

          {/* Flyer de fondo - object-contain para que se vea completo */}
          <img
            src="/Autoconocimiento Rio Gallegos Enero 2026.jpg"
            alt="Autoconocimiento Rio Gallegos Enero 2026"
            className="absolute inset-0 w-full h-full object-contain bg-black"
            style={{ objectFit: 'contain' }}
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

      {/* Audio oculto */}
      <audio
        ref={audioRef}
        src="/campanas-en-la-noche.mp3"
        preload="auto"
        loop={false}
      >
        Tu navegador no soporta el elemento de audio.
      </audio>
    </>
  )
}
