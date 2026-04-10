"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImagePopupProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

export function ImagePopup({ src, alt, isOpen, onClose }: ImagePopupProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = "hidden"
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !mounted) return null

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[9998] bg-black/90 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-background rounded-lg shadow-2xl pointer-events-auto max-w-[95vw] max-h-[95vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 rounded-full hover:bg-destructive hover:text-destructive-foreground bg-background/90"
            onClick={onClose}
            aria-label="Cerrar imagen"
            type="button"
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="flex items-center justify-center p-4">
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
