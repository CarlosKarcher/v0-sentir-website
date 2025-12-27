"use client"

import { useState, useEffect, useRef } from "react"

export function ChristmasBanner() {
  const [showBanner, setShowBanner] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleListen = async () => {
    const audio = audioRef.current
    if (audio) {
      try {
        if (isPlaying) {
          // Terminar: detener audio y cerrar cartel
          audio.pause()
          audio.currentTime = 0
          setIsPlaying(false)
          setShowBanner(false)
        } else {
          await audio.play()
          setIsPlaying(true)
        }
      } catch (error) {
        console.error("Error al reproducir audio:", error)
      }
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const handleEnded = () => {
        setIsPlaying(false)
        setShowBanner(false)
      }
      const handleError = (e: Event) => {
        console.error("Error en audio:", e)
      }

      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('error', handleError)

      return () => {
        audio.removeEventListener('ended', handleEnded)
        audio.removeEventListener('error', handleError)
      }
    }
  }, [])

  if (!showBanner) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
      <div className="relative flex flex-col items-center justify-center" style={{ width: '15cm', height: '15cm', maxWidth: '90vw', maxHeight: '90vh' }}>
        {/* Imagen de fondo del fuego */}
        <img
          src="/fuego-de-sentir.png"
          alt="Fuego de Sentir"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Texto superior */}
        <div className="absolute top-4 left-0 right-0 text-center z-10 px-4">
          <p className="text-white font-bold text-xl sm:text-2xl md:text-3xl" style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.8), 0 0 10px rgba(0, 0, 0, 0.5)" }}>
            Escucha el hermoso Relato: Esto Tambien Pasara...
          </p>
        </div>

        {/* Botón Escuchar en la parte central inferior */}
        <button
          onClick={handleListen}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold text-lg sm:text-xl md:text-2xl rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
            boxShadow: "0 4px 20px rgba(255, 140, 0, 0.6), 0 0 40px rgba(255, 69, 0, 0.4)",
          }}
        >
          {isPlaying ? "Terminar" : "Escuchar"}
        </button>

        {/* Audio oculto */}
        <audio
          ref={audioRef}
          src="/Esto_tambien _pasara.ogg"
          preload="auto"
        >
          Tu navegador no soporta el elemento de audio.
        </audio>
      </div>
    </div>
  )
}
