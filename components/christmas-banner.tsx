"use client"

import { useState } from "react"

export function ChristmasBanner() {
  const [showBanner, setShowBanner] = useState(true)

  if (!showBanner) {
    return null
  }

  const handleClose = () => {
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
        {/* Contenedor del cartel de 25cm alto x 15cm ancho con animación */}
        <div 
          className="relative bg-black rounded-lg overflow-hidden shadow-2xl banner-pulse"
          style={{ 
            width: '15cm', 
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

          {/* Flyer de fondo - object-cover para que ocupe toda la ventana */}
          <img
            src="/Autoconocimiento Rio Gallegos Enero 2026.jpg"
            alt="Autoconocimiento Rio Gallegos Enero 2026"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Texto superpuesto - visible hasta que se presione la X */}
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
