"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { TiendaProductos } from "@/components/tienda-productos"

export function Merchandising() {
  const [showTienda, setShowTienda] = useState(false)

  const handleButtonClick = () => {
    setShowTienda(true)
  }

  const handleCloseTienda = () => {
    setShowTienda(false)
  }

  return (
    <section id="merchandising" className="py-12 sm:py-16 md:py-20 bg-background w-full">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center" style={{ marginBottom: "1cm" }}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-balance">Merchandising</h2>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty">
            Descubre nuestros productos oficiales de Sentir
          </p>
        </div>

        <div className="flex flex-col justify-center items-center gap-4">
          <div
            className="relative inline-block cursor-not-allowed rounded-lg overflow-hidden opacity-60"
            aria-disabled="true"
          >
            <img
              src="/logo-tienda-Sentir.jpeg"
              alt="Logo Tienda Sentir"
              className="object-contain"
              style={{ width: "8cm", height: "10cm" }}
            />
            {/* Indicador de no disponible */}
            <div className="absolute bottom-2 right-2 bg-gray-400 text-white rounded-full p-2 shadow-lg">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Próximamente disponible</p>
          
        </div>
      </div>
      {showTienda && <TiendaProductos onClose={handleCloseTienda} />}
    </section>
  )
}

