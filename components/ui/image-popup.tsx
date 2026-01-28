"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImagePopupProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

export function ImagePopup({ src, alt, isOpen, onClose }: ImagePopupProps) {
  React.useEffect(() => {
    if (isOpen) {
      // Prevenir scroll del body cuando el popup está abierto
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEscape)
    }

    return () => {
      window.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[9998] bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal con la imagen */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none p-4">
        <div
          className="relative bg-background rounded-lg shadow-2xl pointer-events-auto max-w-[95vw] max-h-[95vh] animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón de cerrar */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-[10000] rounded-full hover:bg-destructive hover:text-destructive-foreground cursor-pointer bg-background/90 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Cerrar imagen"
            type="button"
          >
            <X className="h-5 w-5" />
          </Button>
          
          {/* Imagen */}
          <div className="relative flex items-center justify-center p-4">
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              style={{ 
                objectFit: "contain",
                display: "block"
              }}
              onError={(e) => {
                console.error("Error al cargar la imagen:", src)
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
