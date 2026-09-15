"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VideoPopup() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const video1Ref = React.useRef<HTMLVideoElement>(null)
  const video2Ref = React.useRef<HTMLVideoElement>(null)

  // Autoplay primer video al abrir
  React.useEffect(() => {
    const v = video1Ref.current
    if (!v) return
    v.muted = true
    const tryPlay = () => { v.play().catch(() => {}) }
    if (v.readyState >= 1) tryPlay()
    else v.addEventListener("loadedmetadata", tryPlay, { once: true })
  }, [])

  const handleEnded1 = () => {
    setActiveIndex(1)
    const v = video2Ref.current
    if (!v) return
    v.muted = false
    const tryPlay = () => { v.play().catch(() => {}) }
    if (v.readyState >= 1) tryPlay()
    else v.addEventListener("loadedmetadata", tryPlay, { once: true })
  }

  const handleClose = () => {
    video1Ref.current?.pause()
    video2Ref.current?.pause()
    setIsOpen(false)
  }

  if (!isOpen) return null

  const ringStyle = (index: number): React.CSSProperties => ({
    outline: activeIndex === index ? "3px solid #fff" : "none",
    borderRadius: "8px",
  })

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
            width: "min(960px, 98vw)",
            maxHeight: "92vh",
            display: "flex",
            gap: "4px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
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

          {/* Video 1 — se reproduce primero */}
          <div style={{ flex: 1, ...ringStyle(0) }}>
            <video
              ref={video1Ref}
              src="/video-auto-11-09-2026-2.mp4"
              playsInline
              controls
              preload="auto"
              onEnded={handleEnded1}
              style={{ display: "block", width: "100%", maxHeight: "92vh", objectFit: "contain" }}
            />
          </div>

          {/* Video 2 — se reproduce después */}
          <div style={{ flex: 1, ...ringStyle(1) }}>
            <video
              ref={video2Ref}
              src="/video-auto-11-09-2026.mp4"
              playsInline
              controls
              preload="auto"
              style={{ display: "block", width: "100%", maxHeight: "92vh", objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
