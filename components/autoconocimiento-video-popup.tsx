"use client"

import React, { useState, useRef } from "react"
import { X, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

const VIDEO_SRC = "/Video-Autoconocimiento-marzo-2026.mp4"
const WIDTH_CM = 10
const HEIGHT_CM = 15

export function AutoconocimientoVideoPopup() {
  const [isOpen, setIsOpen] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlay = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play()
        setIsPlaying(true)
      } catch (e) {
        console.error("Error al reproducir:", e)
      }
    }
  }

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden
      />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none p-4">
        <div
          className="relative pointer-events-auto bg-background rounded-lg shadow-2xl overflow-hidden flex flex-col"
          style={{
            width: `${WIDTH_CM}cm`,
            height: `${HEIGHT_CM}cm`,
            minWidth: "200px",
            maxWidth: "90vw",
            maxHeight: "90vh",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 z-10 rounded-full hover:bg-destructive hover:text-destructive-foreground bg-background/90"
            onClick={handleClose}
            aria-label="Cerrar"
            type="button"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="flex items-center justify-center gap-2 py-2 px-4 border-b shrink-0">
            <img
              src="/fuego-de-sentir.png"
              alt="Fuego de Sentir"
              className="h-8 w-auto object-contain"
            />
            <span className="text-xl font-bold text-foreground">Sentir</span>
          </div>

          <div className="flex-1 min-h-0 flex items-center justify-center relative p-2">
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              className="w-full h-full object-contain rounded-lg"
              playsInline
              preload="metadata"
              controls={isPlaying}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              Tu navegador no soporta el video.
            </video>
            {!isPlaying && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <Button
                  size="lg"
                  onClick={handlePlay}
                  className="rounded-full shadow-lg text-white font-semibold"
                  style={{ backgroundColor: "#FFB84D", borderColor: "#FFB84D" }}
                  aria-label="Reproducir"
                  type="button"
                >
                  <Play className="h-6 w-6 mr-2" />
                  Reproducir
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
