"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VideoPopup() {
  const [isOpen, setIsOpen] = React.useState(true)
  const video1Ref = React.useRef<HTMLVideoElement>(null)
  const video2Ref = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    [video1Ref, video2Ref].forEach(ref => {
      const v = ref.current
      if (!v) return
      v.muted = true
      const tryPlay = () => { v.play().catch(() => {}) }
      if (v.readyState >= 1) tryPlay()
      else v.addEventListener("loadedmetadata", tryPlay, { once: true })
    })
  }, [])

  const handleClose = () => {
    video1Ref.current?.pause()
    video2Ref.current?.pause()
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
            width: "min(860px, 96vw)",
            maxHeight: "92vh",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 4,
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
            ref={video1Ref}
            src="/video-sanando-junio-2026.mp4"
            playsInline
            controls
            preload="auto"
            style={{ display: "block", width: "100%", maxHeight: "92vh", objectFit: "contain" }}
          />

          <video
            ref={video2Ref}
            src="/video-bio-promocion.mp4"
            playsInline
            controls
            preload="auto"
            style={{ display: "block", width: "100%", maxHeight: "92vh", objectFit: "contain" }}
          />
        </div>
      </div>
    </>
  )
}
