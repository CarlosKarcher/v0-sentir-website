"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

const DURATION = 20

// Posiciones que va rotando el contador para no tapar el flyer
const POSITIONS = [
  { top: "auto", bottom: "10px", left: "10px",  right: "auto" },
  { top: "10px",  bottom: "auto", left: "auto",  right: "10px" },
  { top: "auto", bottom: "10px", left: "auto",  right: "10px" },
  { top: "10px",  bottom: "auto", left: "10px",  right: "auto" },
]

export function VideoPopup() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [seconds, setSeconds] = React.useState(DURATION)
  const [posIdx, setPosIdx] = React.useState(0)

  // Cuenta regresiva — cierra al llegar a 0
  React.useEffect(() => {
    if (!isOpen) return
    if (seconds <= 0) { setIsOpen(false); return }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [isOpen, seconds])

  // Mueve el contador de esquina cada 7 segundos
  React.useEffect(() => {
    if (!isOpen) return
    const t = setInterval(() => setPosIdx((i) => (i + 1) % POSITIONS.length), 5000)
    return () => clearInterval(t)
  }, [isOpen])

  if (!isOpen) return null

  const pos = POSITIONS[posIdx]

  return (
    <>
      {/* Fondo oscuro */}
      <div
        style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.85)" }}
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px" }}>
        <div
          style={{
            position: "relative",
            borderRadius: "12px",
            overflow: "hidden",
            width: "min(420px, 96vw)",
            maxHeight: "92vh",
            background: "#000",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón cerrar */}
          <Button
            variant="ghost"
            size="icon"
            style={{ position: "absolute", top: 8, right: 8, zIndex: 20, borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "white" }}
            onClick={() => setIsOpen(false)}
            type="button"
            aria-label="Cerrar"
          >
            <X style={{ width: 20, height: 20 }} />
          </Button>

          {/* Flyer */}
          <img
            src="/Talleres-Bonificados.jpeg"
            alt="Talleres Bonificados"
            style={{ width: "100%", display: "block", maxHeight: "90vh", objectFit: "contain" }}
          />

          {/* Contador flotante que se mueve de esquina en esquina */}
          <div
            style={{
              position: "absolute",
              top: pos.top,
              bottom: pos.bottom,
              left: pos.left,
              right: pos.right,
              zIndex: 25,
              transition: "top 0.6s ease, bottom 0.6s ease, left 0.6s ease, right 0.6s ease",
              background: "rgba(0,0,0,0.55)",
              color: "#fff",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              fontWeight: 700,
              backdropFilter: "blur(4px)",
              border: "2px solid rgba(255,255,255,0.35)",
              pointerEvents: "none",
            }}
          >
            {seconds}
          </div>
        </div>
      </div>
    </>
  )
}
