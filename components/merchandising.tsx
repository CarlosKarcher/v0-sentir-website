"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Merchandising() {
  const [showMessage, setShowMessage] = useState(false)

  const handleButtonClick = () => {
    setShowMessage(true)
    // Ocultar el mensaje después de 3 segundos
    if (typeof window !== "undefined") {
      setTimeout(() => {
        setShowMessage(false)
      }, 3000)
    }
  }

  return (
    <section id="merchandising" className="py-12 sm:py-16 md:py-20 bg-background w-full">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-balance">Merchandising</h2>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty">
            Descubre nuestros productos oficiales de Sentir
          </p>
        </div>

        <div className="flex flex-col justify-center items-center gap-4">
          <img
            src="/logo-tienda-Sentir.jpeg"
            alt="Logo Tienda Sentir"
            className="max-w-full h-auto object-contain"
            style={{ maxWidth: "400px" }}
          />
          <Button
            size="lg"
            className="px-8 py-6 text-base sm:text-lg font-semibold"
            onClick={handleButtonClick}
          >
            Ingresar a la Tienda Oficial Sentir
          </Button>
          
          {showMessage && (
            <div className="mt-2 px-4 py-2 bg-muted border border-border rounded-md text-sm text-muted-foreground transition-opacity duration-300">
              En desarrollo...
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

