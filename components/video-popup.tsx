"use client"

import * as React from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const VIDEOS = [
  "/video-sanando-junio-2026.mp4",
  "/video-bio-promocion.mp4",
]

export function VideoPopup() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [current, setCurrent] = React.useState(0)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    const tryPlay = () => { v.play().catch(() => {}) }
    if (v.readyState >= 1) tryPlay()
    else v.addEventListener("loadedmetadata", tryPlay, { once: true })
    return () => v.removeEventListener("loadedmetadata", tryPlay)
  }, [current])

  const handleClose = () => {
    videoRef.current?.pause()
    setIsOpen(false)
  }

  const goTo = (index: number) => {
    videoRef.current?.pause()
    setCurrent(index)
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
          style={{
            position: "relative",
            background: "#000",
            borderRadius: "12px",
            overflow: "hidden",
            width: "min(420px, 96vw)",
            maxHeight: "92vh",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cerrar */}
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

          {/* Video */}
          <video
            key={current}
            ref={videoRef}
            src={VIDEOS[current]}
            playsInline
            controls
            preload="auto"
            style={{ width: "100%", display: "block", maxHeight: "85vh" }}
          />

          {/* Navegación */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "#111" }}>
            <button
              onClick={() => goTo((current - 1 + VIDEOS.length) % VIDEOS.length)}
              style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}
              aria-label="Video anterior"
            >
              <ChevronLeft style={{ width: 18, height: 18 }} />
            </button>

            {/* Indicadores */}
            <div style={{ display: "flex", gap: 6 }}>
              {VIDEOS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  style={{ width: 8, height: 8, borderRadius: "50%", border: "none", cursor: "pointer", background: i === current ? "white" : "rgba(255,255,255,0.35)" }}
                  aria-label={`Video ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo((current + 1) % VIDEOS.length)}
              style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}
              aria-label="Video siguiente"
            >
              <ChevronRight style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
