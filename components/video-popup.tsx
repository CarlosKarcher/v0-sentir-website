"use client"

import * as React from "react"
import { X, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const VIDEOS = [
  "/video-bio-promocion.mp4",
  "/video-guerrero-mayo-rio-gallegos.mp4",
]

export function VideoPopup() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [muted, setMuted] = React.useState(true)
  const [index, setIndex] = React.useState(0)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  // Autoplay al montar o al cambiar de video
  React.useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = muted
    const tryPlay = () => { v.play().catch(() => {}) }
    if (v.readyState >= 1) tryPlay()
    else v.addEventListener("loadedmetadata", tryPlay, { once: true })
    return () => v.removeEventListener("loadedmetadata", tryPlay)
  }, [index]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sincronizar mute/unmute
  React.useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted
  }, [muted])

  // Al terminar el video pasar al siguiente automáticamente
  const handleEnded = () => {
    if (index < VIDEOS.length - 1) setIndex((i) => i + 1)
  }

  const handleClose = () => {
    videoRef.current?.pause()
    setIsOpen(false)
  }

  const toggleMute = () => setMuted((m) => !m)

  const goTo = (next: number) => {
    videoRef.current?.pause()
    setIndex(next)
  }

  if (!isOpen) return null

  return (
    <>
      <div
        style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.85)" }}
        onClick={handleClose}
      />
      <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px" }}>
        <div
          style={{ position: "relative", background: "#000", borderRadius: "12px", overflow: "hidden", width: "min(520px, 98vw)", maxHeight: "90vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón cerrar */}
          <Button
            variant="ghost"
            size="icon"
            style={{ position: "absolute", top: 8, right: 8, zIndex: 10, borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "white" }}
            onClick={handleClose}
            type="button"
            aria-label="Cerrar"
          >
            <X style={{ width: 20, height: 20 }} />
          </Button>

          {/* Botón activar/desactivar sonido */}
          <Button
            variant="ghost"
            size="icon"
            style={{ position: "absolute", top: 8, right: 52, zIndex: 10, borderRadius: "50%", background: muted ? "#FFB84D" : "rgba(0,0,0,0.6)", color: muted ? "#000" : "white" }}
            onClick={toggleMute}
            type="button"
            aria-label={muted ? "Activar sonido" : "Silenciar"}
          >
            {muted ? <VolumeX style={{ width: 20, height: 20 }} /> : <Volume2 style={{ width: 20, height: 20 }} />}
          </Button>

          <video
            key={VIDEOS[index]}
            ref={videoRef}
            src={VIDEOS[index]}
            playsInline
            controls
            preload="auto"
            onEnded={handleEnded}
            style={{ width: "100%", minHeight: "300px", maxHeight: "80vh", display: "block", background: "#000" }}
          />

          {/* Navegación entre videos */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "8px 0 10px", background: "#000" }}>
            <Button
              variant="ghost"
              size="icon"
              disabled={index === 0}
              onClick={() => goTo(index - 1)}
              style={{ borderRadius: "50%", background: "rgba(255,255,255,0.1)", color: "white", opacity: index === 0 ? 0.3 : 1 }}
              type="button"
              aria-label="Video anterior"
            >
              <ChevronLeft style={{ width: 20, height: 20 }} />
            </Button>

            {VIDEOS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: i === index ? "#FFB84D" : "rgba(255,255,255,0.35)",
                  border: "none", cursor: "pointer", padding: 0,
                }}
                aria-label={`Video ${i + 1}`}
              />
            ))}

            <Button
              variant="ghost"
              size="icon"
              disabled={index === VIDEOS.length - 1}
              onClick={() => goTo(index + 1)}
              style={{ borderRadius: "50%", background: "rgba(255,255,255,0.1)", color: "white", opacity: index === VIDEOS.length - 1 ? 0.3 : 1 }}
              type="button"
              aria-label="Video siguiente"
            >
              <ChevronRight style={{ width: 20, height: 20 }} />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
