"use client"

import { useState, useEffect } from "react"

export function ChristmasBanner() {
  const [showBanner, setShowBanner] = useState(true)
  const [showText, setShowText] = useState(true)

  useEffect(() => {
    // Después de 10 segundos, ocultar el texto y mostrar solo el flyer
    const timer = setTimeout(() => {
      setShowText(false)
    }, 10000) // 10 segundos

    return () => {
      clearTimeout(timer)
    }
  }, [])

  if (!showBanner) {
    return null
  }

  const handleClose = () => {
    setShowBanner(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
      {/* Contenedor del cartel de 20cm x 20cm con animación */}
      <div 
        className="relative bg-black rounded-lg overflow-hidden shadow-2xl"
        style={{ 
          width: '20cm', 
          height: '20cm', 
          maxWidth: '90vw', 
          maxHeight: '90vh',
          animation: 'pulse 2s ease-in-out infinite'
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

        {/* Flyer de fondo */}
        <img
          src="/Autoconocimiento Rio Gallegos Enero 2026.jpg"
          alt="Autoconocimiento Rio Gallegos Enero 2026"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Texto superpuesto - visible solo durante los primeros 10 segundos */}
        {showText && (
          <div 
            className="absolute inset-0 flex items-center justify-center z-10 bg-black/40"
            style={{
              animation: 'fadeOut 1s ease-in-out 9s forwards'
            }}
          >
            <h2 
              className="text-white font-bold text-center px-4"
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.6)',
                animation: 'scaleInOut 2s ease-in-out infinite'
              }}
            >
              próximo gran Evento En Sentir...
            </h2>
          </div>
        )}

        {/* Estilos CSS para las animaciones */}
        <style jsx>{`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
          
          @keyframes scaleInOut {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }
          
          @keyframes fadeOut {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </div>
  )
}
