"use client"

import { useState, useEffect } from "react"

export function ChristmasBanner() {
  const [showBanner, setShowBanner] = useState(true)
  const [showVideo, setShowVideo] = useState(false)
  const [isBlinking, setIsBlinking] = useState(true)

  useEffect(() => {
    // Parpadeo del cartel
    const blinkInterval = setInterval(() => {
      setIsBlinking((prev) => !prev)
    }, 500) // Cambia cada 500ms (medio segundo)

    // Después de 10 segundos, ocultar el cartel y mostrar el video
    const timer = setTimeout(() => {
      setShowBanner(false)
      setShowVideo(true)
      clearInterval(blinkInterval)
    }, 10000) // 10 segundos

    return () => {
      clearTimeout(timer)
      clearInterval(blinkInterval)
    }
  }, [])

  if (!showBanner && !showVideo) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
      {showBanner && (
        <div className="text-center px-4">
          <div
            className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white transition-opacity duration-300 ${
              isBlinking ? "opacity-100" : "opacity-30"
            }`}
            style={{
              textShadow: "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6)",
            }}
          >
            Y Asi cerramos este MAravilloso Año 2025...
          </div>
        </div>
      )}

      {showVideo && (
        <div className="w-full h-full flex items-center justify-center relative">
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
            autoPlay
            controls
            className="max-w-full max-h-full"
            style={{ width: "90vw", height: "auto" }}
            onEnded={() => setShowVideo(false)}
          >
            <source src="/cierre de myl 2025.mp4" type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
        </div>
      )}
    </div>
  )
}

