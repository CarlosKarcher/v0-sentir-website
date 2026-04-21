"use client"

import * as React from "react"
import { X, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VideoPopup() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [muted, setMuted] = React.useState(true)
  const video1Ref = React.useRef<HTMLVideoElement>(null)
  const video2Ref = React.useRef<HTMLVideoElement>(null)

  // Autorun video 1 al montar (muted para que el navegador lo permita)
  React.useEffect(() => {
    const v = video1Ref.current
    if (!v) return
    v.muted = true
    const tryPlay = () => { v.play().catch(() => {}) }
    if (v.readyState >= 1) tryPlay()
    else v.addEventListener("loadedmetadata", tryPlay, { once: true })
    return () => v.removeEventListener("loadedmetadata", tryPlay)
  }, [])

  // Sincronizar mute/unmute en ambos videos
  React.useEffect(() => {
    if (video1Ref.current) video1Ref.current.muted = muted
    if (video2Ref.current) video2Ref.current.muted = muted
  }, [muted])

  // Cuando termina video 1 → autorun video 2
  const handleVideo1Ended = () => {
    const v = video2Ref.current
    if (!v) return
    v.muted = muted
    v.play().catch(() => {})
  }

  const handleClose = () => {
    video1Ref.current?.pause()
    video2Ref.current?.pause()
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
          style={{ position: "relative", background: "#000", borderRadius: "12px", overflow: "hidden", width: "min(920px, 98vw)", maxHeight: "90vh" }}
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

          {/* Dos videos lado a lado */}
          <div style={{ display: "flex", flexDirection: "row", gap: "1cm" }}>
            <video
              ref={video1Ref}
              src="/Video-Neco.mp4"
              playsInline
              controls
              preload="metadata"
              onEnded={handleVideo1Ended}
              style={{ flex: 1, minWidth: 0, maxHeight: "88vh", display: "block", background: "#000" }}
            />
            <video
              ref={video2Ref}
              src="/Luzu-taller-vivencial.mp4"
              playsInline
              controls
              preload="metadata"
              style={{ flex: 1, minWidth: 0, maxHeight: "88vh", display: "block", background: "#000" }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
