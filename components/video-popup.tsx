"use client"

import * as React from "react"
import { X, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

function VideoPlayer({ src, autoPlay }: { src: string; autoPlay?: boolean }) {
  const [muted, setMuted] = React.useState(true)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    if (!autoPlay) return
    const v = videoRef.current
    if (!v) return
    v.muted = true
    const tryPlay = () => { v.play().catch(() => {}) }
    if (v.readyState >= 1) tryPlay()
    else v.addEventListener("loadedmetadata", tryPlay, { once: true })
    return () => v.removeEventListener("loadedmetadata", tryPlay)
  }, [autoPlay])

  React.useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted
  }, [muted])

  return (
    <div style={{ position: "relative", flex: 1, minWidth: 0, background: "#000" }}>
      <Button
        variant="ghost"
        size="icon"
        style={{
          position: "absolute", top: 8, right: 8, zIndex: 10,
          borderRadius: "50%",
          background: muted ? "#FFB84D" : "rgba(0,0,0,0.6)",
          color: muted ? "#000" : "white",
        }}
        onClick={() => setMuted((m) => !m)}
        type="button"
        aria-label={muted ? "Activar sonido" : "Silenciar"}
      >
        {muted ? <VolumeX style={{ width: 20, height: 20 }} /> : <Volume2 style={{ width: 20, height: 20 }} />}
      </Button>
      <video
        ref={videoRef}
        src={src}
        playsInline
        controls
        preload="auto"
        style={{ width: "100%", height: "100%", display: "block", background: "#000", objectFit: "contain" }}
      />
    </div>
  )
}

export function VideoPopup() {
  const [isOpen, setIsOpen] = React.useState(true)

  const handleClose = () => setIsOpen(false)

  if (!isOpen) return null

  return (
    <>
      <div
        style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.85)" }}
        onClick={handleClose}
      />
      <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px" }}>
        <div
          style={{
            position: "relative",
            background: "#000",
            borderRadius: "12px",
            overflow: "hidden",
            width: "min(360px, 98vw)",
            maxHeight: "90vh",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón cerrar */}
          <Button
            variant="ghost"
            size="icon"
            style={{ position: "absolute", top: 8, right: 8, zIndex: 20, borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "white" }}
            onClick={handleClose}
            type="button"
            aria-label="Cerrar"
          >
            <X style={{ width: 20, height: 20 }} />
          </Button>

          {/* Video biodecodificación */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <VideoPlayer src="/video-bio-promocion.mp4" autoPlay />
          </div>
        </div>
      </div>
    </>
  )
}
