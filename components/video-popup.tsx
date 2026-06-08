"use client"

import * as React from "react"
import { X } from "lucide-react"
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
  }, [current])

  const handleEnded = () => {
    if (current < VIDEOS.length - 1) {
      setCurrent(current + 1)
    } else {
      setIsOpen(false)
    }
  }

  const handleClose = () => {
    videoRef.current?.pause()
    setIsOpen(false)
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
            width: "min(480px, 96vw)",
            maxHeight: "92vh",
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

          <video
            key={current}
            ref={videoRef}
            src={VIDEOS[current]}
            playsInline
            controls
            preload="auto"
            onEnded={handleEnded}
            style={{ display: "block", width: "100%", maxHeight: "92vh", objectFit: "contain" }}
          />
        </div>
      </div>
    </>
  )
}
