"use client"

import { useState, useEffect } from "react"

export function ChristmasBanner() {
  const [showBanner, setShowBanner] = useState(true)
  const [isBlinking, setIsBlinking] = useState(true)

  useEffect(() => {
    // Parpadeo del cartel
    const blinkInterval = setInterval(() => {
      setIsBlinking((prev) => !prev)
    }, 500) // Cambia cada 500ms (medio segundo)

    // Después de 5 segundos, ocultar el cartel
    const timer = setTimeout(() => {
      setShowBanner(false)
      clearInterval(blinkInterval)
    }, 5000) // 5 segundos

    return () => {
      clearTimeout(timer)
      clearInterval(blinkInterval)
    }
  }, [])

  if (!showBanner) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {showBanner && (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-red-900 via-green-900 to-red-900">
          {/* Decoraciones navideñas - Estrellas */}
          <div className="absolute inset-0 overflow-hidden">
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
          </div>
        </div>
      )}
    </div>
  )
}

