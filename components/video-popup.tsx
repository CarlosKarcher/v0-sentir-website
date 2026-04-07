"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VideoPopup() {
  const [isOpen, setIsOpen] = React.useState(true)
  const video1Ref = React.useRef<HTMLVideoElement>(null)
  const video2Ref = React.useRef<HTMLVideoElement>(null)

  // Autorun video 1 al montar
  React.useEffect(() => {
    const v = video1Ref.current
    if (!v) return
    const tryPlay = () => {
      v.muted = false
      v.play().catch(() => { v.muted = true; v.play().catch(() => {}) })
    }
    if (v.readyState >= 1) tryPlay()
    else v.addEventListener("loadedmetadata", tryPlay, { once: true })
    return () => v.removeEventListener("loadedmetadata", tryPlay)
  }, [])

  // Cuando termina video 1 → autorun video 2
  const handleVideo1Ended = () => {
    const v = video2Ref.current
    if (!v) return
    v.muted = false
    v.play().catch(() => { v.muted = true; v.play().catch(() => {}) })
  }

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

          {/* Dos videos lado a lado */}
          <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <video
              ref={video1Ref}
              src="/Video-transfor.mp4"
              playsInline
              controls
              preload="metadata"
              onEnded={handleVideo1Ended}
              style={{ flex: 1, minWidth: 0, maxHeight: "88vh", display: "block", background: "#000" }}
            />
            <video
              ref={video2Ref}
              src="/La-tribu-de-sentir.mp4"
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
