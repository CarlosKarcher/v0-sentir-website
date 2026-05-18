"use client"

import * as React from "react"
import { X, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VideoPopup() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [muted, setMuted] = React.useState(true)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  // Autorun al montar (muted para que el navegador lo permita)
  React.useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    const tryPlay = () => { v.play().catch(() => {}) }
    if (v.readyState >= 1) tryPlay()
    else v.addEventListener("loadedmetadata", tryPlay, { once: true })
    return () => v.removeEventListener("loadedmetadata", tryPlay)
  }, [])

  // Sincronizar mute/unmute
  React.useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted
  }, [muted])

  const handleClose = () => {
    videoRef.current?.pause()
    setIsOpen(false)
  }

  const toggleMute = () => setMuted((m) => !m)

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
            ref={videoRef}
            src="/Video-guerrero-mayo-rio-gallegos.MP4"
            playsInline
            controls
            preload="auto"
            style={{ width: "100%", minHeight: "300px", maxHeight: "88vh", display: "block", background: "#000" }}
          />
        </div>
      </div>
    </>
  )
}
